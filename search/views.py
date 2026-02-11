from __future__ import annotations

from difflib import SequenceMatcher
from typing import Any, Dict, Iterable, List, Tuple

from django.db.models import Q
from rest_framework import views
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from TrekCard.models import TrekInfo
from search.serializers import SearchResultSerializer
from tours.models import Tour


class UnifiedSearchAPIView(views.APIView):
    """Search endpoint that returns both treks and tours with scoring + fallbacks."""

    permission_classes = [AllowAny]

    DEFAULT_LIMIT = 12
    MAX_LIMIT = 24
    CANDIDATE_LIMIT = 120
    SIMILAR_THRESHOLD = 0.28

    def get(self, request, *args, **kwargs) -> Response:
        raw_query = (request.query_params.get("q") or request.query_params.get("query") or "").strip()
        scope = (request.query_params.get("scope") or "both").lower()
        limit = self._normalize_limit(request.query_params.get("limit"))
        page = self._normalize_page(request.query_params.get("page"))
        include_similar = (request.query_params.get("similar", "true").lower() in ("1", "true", "yes"))

        trek_results: List[Dict[str, Any]] = []
        tour_results: List[Dict[str, Any]] = []

        if scope in ("trek", "both"):
            trek_results = self._search_treks(raw_query)
        if scope in ("tour", "both"):
            tour_results = self._search_tours(raw_query)

        all_results = sorted(
            trek_results + tour_results,
            key=lambda item: (-item.get("score", 0), -(item.get("rating") or 0), item.get("title", "")),
        )

        start = (page - 1) * limit
        end = start + limit
        paginated = all_results[start:end]

        payload: Dict[str, Any] = {
            "query": raw_query,
            "scope": scope,
            "page": page,
            "limit": limit,
            "total": len(all_results),
            "results": SearchResultSerializer(paginated, many=True).data,
            "has_more": end < len(all_results),
            "fallback": self._popular_fallbacks(),
        }

        if include_similar and not all_results and raw_query:
            payload["suggestions"] = self._get_similarity_suggestions(raw_query)
        elif include_similar and raw_query:
            payload["suggestions"] = self._get_similarity_suggestions(raw_query, limit=4)

        return Response(payload)

    def _search_treks(self, query: str) -> List[Dict[str, Any]]:
        queryset = (
            TrekInfo.objects.select_related("region", "hero_section", "booking_card")
            .order_by("-rating", "-reviews")
        )
        if query:
            icontains = lambda field: Q(**{f"{field}__icontains": query})
            filters = Q()
            filters |= icontains("title")
            filters |= icontains("slug")
            filters |= icontains("region__name")
            filters |= icontains("activity")
            filters |= icontains("duration")
            filters |= icontains("trip_grade")
            filters |= icontains("start_point")
            queryset = queryset.filter(filters)
        queryset = list(queryset[: self.CANDIDATE_LIMIT])
        return [self._build_trek_payload(trek, query) for trek in queryset]

    def _search_tours(self, query: str) -> List[Dict[str, Any]]:
        queryset = (
            Tour.objects.filter(is_published=True)
            .order_by("-rating", "-reviews_count")
        )
        if query:
            icontains = lambda field: Q(**{f"{field}__icontains": query})
            filters = Q()
            filters |= icontains("title")
            filters |= icontains("slug")
            filters |= icontains("tagline")
            filters |= icontains("short_description")
            filters |= icontains("long_description")
            filters |= icontains("location")
            filters |= icontains("travel_style")
            filters |= icontains("activity")
            queryset = queryset.filter(filters)
        queryset = list(queryset[: self.CANDIDATE_LIMIT])
        return [self._build_tour_payload(tour, query) for tour in queryset]

    def _build_trek_payload(self, trek: TrekInfo, query: str) -> Dict[str, Any]:
        query_lower = query.lower() if query else ""
        hero_image = getattr(getattr(trek, "hero_section", None), "image", None)
        image_url = self._absolute_url(hero_image)
        rating = float(trek.rating or 0.0)
        booking_card = getattr(trek, "booking_card", None)
        price = self._decimal_to_float(getattr(booking_card, "base_price", None))
        region_name = trek.region.name if trek.region else ""
        region_slug = trek.region.slug if trek.region else ""
        match_fields = self._match_fields(
            query_lower,
            {
                "title": trek.title,
                "region": region_name,
                "activity": trek.activity,
                "duration": trek.duration,
                "trip_grade": trek.trip_grade,
                "start_point": trek.start_point,
            },
        )
        score = self._similarity_score(query_lower, trek.title)
        return {
            "id": str(trek.public_id),
            "type": "trek",
            "slug": trek.slug,
            "title": trek.title,
            "subtitle": trek.trip_grade or trek.activity or trek.start_point or "",
            "location": region_name or trek.start_point or "",
            "region": region_name,
            "region_slug": region_slug,
            "duration": trek.duration,
            "rating": rating,
            "price": price,
            "image_url": image_url,
            "meta": {
                "activity": trek.activity,
                "trip_grade": trek.trip_grade,
                "start_point": trek.start_point,
                "reviews": trek.reviews,
            },
            "match_fields": match_fields,
            "score": score,
        }

    def _build_tour_payload(self, tour: Tour, query: str) -> Dict[str, Any]:
        query_lower = query.lower() if query else ""
        score = self._similarity_score(query_lower, tour.title)
        match_fields = self._match_fields(
            query_lower,
            {
                "title": tour.title,
                "location": tour.location,
                "tagline": tour.tagline,
                "travel_style": tour.travel_style,
                "activity": tour.activity,
                "badge": tour.badge,
            },
        )
        price = self._decimal_to_float(tour.price or tour.base_price or tour.old_price)
        subtitle = tour.tagline or tour.short_description or tour.long_description or ""
        return {
            "id": str(tour.public_id),
            "type": "tour",
            "slug": tour.slug,
            "title": tour.title,
            "subtitle": subtitle,
            "location": tour.location,
            "region": tour.travel_style or "",
            "duration": tour.duration,
            "rating": float(tour.rating or 0.0),
            "price": price,
            "image_url": self._absolute_url(tour.image_url),
            "meta": {
                "badge": tour.badge,
                "activity": tour.activity,
                "travel_style": tour.travel_style,
                "reviews": tour.reviews_count,
            },
            "match_fields": match_fields,
            "score": score,
        }

    def _absolute_url(self, value: Any) -> str | None:
        if not value:
            return None
        url = getattr(value, "url", None) or str(value)
        if not url:
            return None
        if url.startswith("http"):
            return url
        request = self.request
        return request.build_absolute_uri(url) if request else url

    def _match_fields(self, query_lower: str, candidates: Dict[str, str]) -> List[str]:
        if not query_lower:
            return []
        matches = []
        for field_name, value in candidates.items():
            if value and query_lower in value.lower():
                matches.append(field_name)
        return matches

    def _similarity_score(self, query: str, text: str | None) -> float:
        if not query or not text:
            return 0.0
        return SequenceMatcher(None, query, text.lower()).ratio()

    def _get_similarity_suggestions(self, query: str, limit: int = 6) -> List[Dict[str, Any]]:
        suggestions: List[Tuple[float, Dict[str, Any]]] = []
        candidates = (
            list(
                TrekInfo.objects.select_related("hero_section", "booking_card")
                .order_by("-rating", "-reviews")[: limit * 3]
            )
        )
        suggestions.extend(self._score_candidates(query, candidates, self._build_trek_payload, limit))
        tour_candidates = list(Tour.objects.filter(is_published=True).order_by("-rating", "-reviews_count")[: limit * 3])
        suggestions.extend(self._score_candidates(query, tour_candidates, self._build_tour_payload, limit))
        suggestions.sort(key=lambda item: (-item[0], item[1]["title"]))
        return [item[1] for item in suggestions[:limit]]

    def _score_candidates(
        self,
        query: str,
        candidates: Iterable[Any],
        builder,
        limit: int,
    ) -> List[Tuple[float, Dict[str, Any]]]:
        scored: List[Tuple[float, Dict[str, Any]]] = []
        query_lower = query.lower()
        for candidate in candidates:
            score = self._similarity_score(query_lower, getattr(candidate, "title", ""))
            if score < self.SIMILAR_THRESHOLD:
                continue
            payload = builder(candidate, query)
            scored.append((score, payload))
        scored.sort(key=lambda item: -item[0])
        return scored[: limit * 2]

    def _popular_fallbacks(self) -> Dict[str, List[Dict[str, Any]]]:
        treks = (
            TrekInfo.objects.select_related("region", "hero_section", "booking_card")
            .order_by("-rating", "-reviews")[:3]
        )
        tours = Tour.objects.filter(is_published=True).order_by("-rating", "-reviews_count")[:3]
        return {
            "treks": [self._build_trek_payload(trek, "") for trek in treks],
            "tours": [self._build_tour_payload(tour, "") for tour in tours],
        }

    def _normalize_limit(self, value: str | None) -> int:
        try:
            limit = int(value)
        except (TypeError, ValueError):
            return self.DEFAULT_LIMIT
        return max(1, min(limit, self.MAX_LIMIT))

    def _normalize_page(self, value: str | None) -> int:
        try:
            page = int(value)
        except (TypeError, ValueError):
            return 1
        return max(1, page)

    def _decimal_to_float(self, value: Any) -> float | None:
        if value is None:
            return None
        try:
            return float(value)
        except (TypeError, ValueError):
            return None
