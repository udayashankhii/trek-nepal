import json
from pathlib import Path
from typing import Any, Dict, List, Optional, Sequence

from django.core.management.base import BaseCommand
from django.utils.text import slugify

from admin_api.services.tour_importer_service import sync_style_relations
from tours.models import Tour


class Command(BaseCommand):
    help = (
        "Re-syncs `travel_style` slugs with the new foreign-key/M2M fields and "
        "optionally rewrites JSON import payloads so they populate `primary_style` "
        "and `travel_styles`."
    )

    def add_arguments(self, parser):
        parser.add_argument(
            "--file",
            "-f",
            action="append",
            dest="files",
            default=[],
            help="Path to a JSON import payload to rewrite (can be repeated).",
        )
        parser.add_argument(
            "--dry-run",
            action="store_true",
            help="Show what would change but do not persist to the database or files.",
        )
        parser.add_argument(
            "--skip-db",
            action="store_true",
            help="Only rewrite provided files; do not sync the database.",
        )

    def handle(self, *args, files: Optional[List[str]] = None, dry_run: bool = False, skip_db: bool = False, **options):
        files = files or []
        if files:
            self._rewrite_files(files, dry_run)
        if skip_db:
            return
        self._sync_all_tours(dry_run)

    def _sync_all_tours(self, dry_run: bool) -> None:
        tours = Tour.objects.all()
        total = tours.count()
        self.stdout.write(f"Syncing {total} tours to new style relations...")
        synced = 0
        warnings_seen = 0
        for tour in tours.iterator():
            payload = self._build_payload_from_tour(tour)
            if not payload:
                continue
            if dry_run:
                synced += 1
                continue
            warnings = sync_style_relations(tour, payload)
            synced += 1
            warnings_seen += len(warnings)
        self.stdout.write(f"Processed {synced} tours; {warnings_seen} warnings emitted." if warnings_seen else f"Processed {synced} tours.")

    def _build_payload_from_tour(self, tour: Tour) -> Dict[str, Any]:
        slugs = [style.slug for style in tour.travel_styles.all() if style.slug]
        if tour.travel_style:
            slugs.insert(0, tour.travel_style)
        slugs = list(dict.fromkeys(filter(None, slugs)))
        payload: Dict[str, Any] = {}
        if tour.primary_style and tour.primary_style.slug:
            payload["primary_style"] = tour.primary_style.slug
        elif slugs:
            payload["primary_style"] = slugs[0]
        if slugs:
            payload["travel_styles"] = slugs
        else:
            payload["travel_styles"] = []
        if not payload["travel_styles"] and not payload.get("primary_style"):
            return {}
        return payload

    def _rewrite_files(self, files: Sequence[str], dry_run: bool) -> None:
        for raw_path in files:
            path = Path(raw_path)
            if not path.exists():
                self.stderr.write(f"Path does not exist: {path}")
                continue
            data = self._load_json(path)
            tours = self._extract_tour_list(data)
            if not tours:
                self.stdout.write(f"No tour definitions found in {path}.")
                continue
            updated = 0
            for tour in tours:
                if self._normalize_payload(tour):
                    updated += 1
            if updated and not dry_run:
                self._write_json(path, data)
            self.stdout.write(
                f"{path}: {updated} tour payload{'s' if updated != 1 else ''} normalized."
            )

    def _load_json(self, path: Path) -> Any:
        text = path.read_text(encoding="utf-8")
        return json.loads(text)

    def _write_json(self, path: Path, payload: Any) -> None:
        path.write_text(json.dumps(payload, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

    def _extract_tour_list(self, data: Any) -> List[Dict[str, Any]]:
        if isinstance(data, dict):
            if isinstance(data.get("tours"), list):
                return data["tours"]
            if isinstance(data.get("items"), list):
                return data["items"]
            if isinstance(data.get("tour_list"), list):
                return data["tour_list"]
            if isinstance(data.get("tour"), dict):
                return [data["tour"]]
            return []
        if isinstance(data, list):
            return data
        return []

    def _normalize_payload(self, tour: Dict[str, Any]) -> bool:
        slugs: List[str] = []
        self._collect_list_slugs(tour.get("travel_styles"), slugs)
        self._collect_list_slugs(tour.get("travelStyles"), slugs)
        for key in ("primary_style", "primaryStyle", "travel_style", "travelStyle"):
            value = tour.get(key)
            self._add_slug(value, slugs)
        unique_slugs = []
        for slug in slugs:
            if slug not in unique_slugs:
                unique_slugs.append(slug)
        primary_slug = self._select_primary_slug(tour) or (unique_slugs[0] if unique_slugs else None)
        changed = False
        if unique_slugs:
            if tour.get("travel_styles") != unique_slugs:
                tour["travel_styles"] = unique_slugs
                changed = True
        else:
            if "travel_styles" in tour:
                tour.pop("travel_styles", None)
                changed = True
        if primary_slug:
            if tour.get("primary_style") != primary_slug:
                tour["primary_style"] = primary_slug
                changed = True
            if tour.get("travel_style") != primary_slug:
                tour["travel_style"] = primary_slug
                changed = True
            if tour.get("travelStyle") != primary_slug:
                tour["travelStyle"] = primary_slug
                changed = True
        else:
            if "primary_style" in tour:
                tour.pop("primary_style", None)
                changed = True
        return changed

    def _collect_list_slugs(self, value: Any, out: List[str]) -> None:
        if isinstance(value, (list, tuple)):
            for item in value:
                self._add_slug(item, out)
        elif value:
            self._add_slug(value, out)

    def _add_slug(self, value: Any, target: List[str]) -> None:
        slug = self._slugify(value)
        if slug and slug not in target:
            target.append(slug)

    def _select_primary_slug(self, tour: Dict[str, Any]) -> Optional[str]:
        for key in ("primary_style", "primaryStyle"):
            slug = self._slugify(tour.get(key))
            if slug:
                return slug
        for key in ("travel_style", "travelStyle"):
            slug = self._slugify(tour.get(key))
            if slug:
                return slug
        return None

    def _slugify(self, value: Any) -> Optional[str]:
        if value is None:
            return None
        if isinstance(value, dict):
            candidate = value.get("slug") or value.get("name") or value.get("value") or ""
        else:
            candidate = value
        candidate = str(candidate).strip()
        if not candidate:
            return None
        normalized = slugify(candidate)
        return normalized or None
