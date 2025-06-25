// services/searchService.js

import everestBaseCamp from "../data/everestBaseCamp";
import { difficulties, regions, treksData } from "../data/treksdata.js";

class SearchService {
  // Get detailed trek by slug
  static getTrekBySlug(slug) {
    if (slug === "everest-base-camp-trek") {
      return everestBaseCamp;
    }
    // Add other detailed trek data here
    return treksData.find((trek) => trek.slug === slug);
  }

  // Enhanced search suggestions using your data structure
  static getSearchSuggestions(searchTerm, limit = 8) {
    if (!searchTerm || searchTerm.length < 2) return [];

    const normalizedTerm = searchTerm.toLowerCase().trim();
    const suggestions = [];

    // Trek name suggestions
    treksData.forEach((trek) => {
      if (trek.name.toLowerCase().includes(normalizedTerm)) {
        suggestions.push({
          id: `trek-${trek.id}`,
          text: trek.name,
          type: "trek",
          subtitle: `${trek.duration} days • ${trek.region} • $${trek.price}`,
          data: trek,
          url: `/trek/${trek.slug}`,
        });
      }
    });

    // Region suggestions
    regions.forEach((region) => {
      if (region.displayName.toLowerCase().includes(normalizedTerm)) {
        suggestions.push({
          id: `region-${region.id}`,
          text: region.displayName,
          type: "region",
          subtitle: `${region.count} treks available`,
          data: region,
          url: `/region/${region.name}`,
        });
      }
    });

    // Highlight suggestions from Everest data
    if (everestBaseCamp.highlights) {
      everestBaseCamp.highlights.forEach((highlight) => {
        if (highlight.title.toLowerCase().includes(normalizedTerm)) {
          suggestions.push({
            id: `highlight-${highlight.id}`,
            text: highlight.title,
            type: "highlight",
            subtitle: highlight.subtitle,
            data: highlight,
            url: `/trek/everest-base-camp-trek#highlights`,
          });
        }
      });
    }

    // Difficulty suggestions
    difficulties.forEach((difficulty) => {
      if (difficulty.toLowerCase().includes(normalizedTerm)) {
        const trekCount = treksData.filter((trek) =>
          trek.difficulty.toLowerCase().includes(difficulty.toLowerCase())
        ).length;
        suggestions.push({
          id: `difficulty-${difficulty}`,
          text: difficulty,
          type: "difficulty",
          subtitle: `${trekCount} treks`,
          data: { difficulty, count: trekCount },
          url: `/search?difficulty=${difficulty.toLowerCase()}`,
        });
      }
    });

    return suggestions.slice(0, limit);
  }

  // Enhanced search with your data structure
  static async searchTreks(
    query = "",
    filters = {},
    sortBy = "relevance",
    page = 1,
    limit = 12
  ) {
    await new Promise((resolve) => setTimeout(resolve, 300));

    let results = [...treksData];

    // Enhanced text search across multiple fields
    if (query) {
      const normalizedQuery = query.toLowerCase().trim();
      results = results.filter((trek) => {
        // Search in basic fields
        const basicMatch =
          trek.name.toLowerCase().includes(normalizedQuery) ||
          trek.description.toLowerCase().includes(normalizedQuery) ||
          trek.region.toLowerCase().includes(normalizedQuery) ||
          trek.difficulty.toLowerCase().includes(normalizedQuery);

        // Search in tags
        const tagMatch = trek.tags?.some((tag) =>
          tag.toLowerCase().includes(normalizedQuery)
        );

        // Search in highlights
        const highlightMatch = trek.highlights?.some((highlight) =>
          highlight.toLowerCase().includes(normalizedQuery)
        );

        // Search in included/excluded items
        const includeMatch = trek.included?.some((item) =>
          item.toLowerCase().includes(normalizedQuery)
        );

        return basicMatch || tagMatch || highlightMatch || includeMatch;
      });
    }

    // Apply filters with your data structure
    if (filters.regions && filters.regions.length > 0) {
      results = results.filter((trek) => filters.regions.includes(trek.region));
    }

    if (filters.difficulties && filters.difficulties.length > 0) {
      results = results.filter((trek) =>
        filters.difficulties.some((difficulty) =>
          trek.difficulty.toLowerCase().includes(difficulty.toLowerCase())
        )
      );
    }

    if (filters.durations && filters.durations.length > 0) {
      results = results.filter((trek) => {
        return filters.durations.some((range) => {
          const [min, max] = this.parseDurationRange(range);
          return trek.duration >= min && trek.duration <= max;
        });
      });
    }

    if (filters.priceRange) {
      const [minPrice, maxPrice] = filters.priceRange;
      results = results.filter(
        (trek) => trek.price >= minPrice && trek.price <= maxPrice
      );
    }

    if (filters.rating) {
      results = results.filter((trek) => trek.rating >= filters.rating);
    }

    if (filters.maxAltitude) {
      results = results.filter(
        (trek) => trek.maxAltitude <= filters.maxAltitude
      );
    }

    // Enhanced sorting
    results = this.sortResults(results, sortBy, query);

    // Pagination
    const total = results.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedResults = results.slice(startIndex, endIndex);

    return {
      treks: paginatedResults,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      hasNextPage: endIndex < total,
      hasPrevPage: page > 1,
      filters: this.getAppliedFilters(results),
    };
  }

  // Get applied filters with counts
  static getAppliedFilters(results) {
    const regions = [...new Set(results.map((trek) => trek.region))];
    const difficulties = [...new Set(results.map((trek) => trek.difficulty))];

    return {
      regions: regions.map((region) => ({
        value: region,
        count: results.filter((trek) => trek.region === region).length,
      })),
      difficulties: difficulties.map((difficulty) => ({
        value: difficulty,
        count: results.filter((trek) => trek.difficulty === difficulty).length,
      })),
    };
  }

  // Get popular searches based on your data
  static getPopularSearches() {
    return [
      "Everest Base Camp",
      "Annapurna Circuit",
      "Kala Patthar",
      "Sherpa culture",
      "High altitude",
      "Tea house trek",
      "Strenuous trek",
      "Mountain views",
    ];
  }
}

export default SearchService;
