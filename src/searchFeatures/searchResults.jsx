// components/search/SearchResults.jsx
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSearch } from '../../hooks/useSearch';
import SearchFilters from './SearchFilters';
import TrekCard from './TrekCard';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import { FiGrid, FiList, FiFilter } from 'react-icons/fi';

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [filters, setFilters] = useState({
    regions: [],
    difficulties: [],
    durations: [],
    priceRange: [0, 3000]
  });
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);

  const { 
    results, 
    loading, 
    error, 
    totalResults, 
    sortBy, 
    updateSort,
    hasMore,
    loadMore 
  } = useSearch(query, filters);

  const sortOptions = [
    { value: 'relevance', label: 'Most Relevant' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'duration-short', label: 'Duration: Short to Long' },
    { value: 'duration-long', label: 'Duration: Long to Short' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'popularity', label: 'Most Popular' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {query ? `Search Results for "${query}"` : 'All Treks'}
          </h1>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <p className="text-gray-600 mb-4 sm:mb-0">
              {totalResults > 0 ? `${totalResults} treks found` : 'No treks found'}
            </p>
            
            {/* Controls */}
            <div className="flex items-center space-x-4">
              {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => updateSort(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              {/* View Mode Toggle */}
              <div className="flex border border-gray-300 rounded-lg">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-amber-500 text-white' : 'text-gray-600'}`}
                >
                  <FiGrid size={16} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-amber-500 text-white' : 'text-gray-600'}`}
                >
                  <FiList size={16} />
                </button>
              </div>

              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <FiFilter className="mr-2" size={16} />
                Filters
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className={`lg:w-1/4 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <SearchFilters 
              filters={filters} 
              setFilters={setFilters}
              onClose={() => setShowFilters(false)}
            />
          </div>

          {/* Results */}
          <div className="lg:w-3/4">
            {loading && <LoadingSpinner />}
            {error && <ErrorMessage message={error} />}
            
            {!loading && !error && (
              <>
                <div className={viewMode === 'grid' ? 'grid gap-6' : 'space-y-6'}>
                  {results.map((trek) => (
                    <TrekCard key={trek.id} trek={trek} viewMode={viewMode} />
                  ))}
                </div>
                
                {results.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-gray-500 text-lg mb-4">
                      No treks found matching your criteria.
                    </p>
                    <button
                      onClick={() => setFilters({})}
                      className="text-amber-600 hover:text-amber-700 font-medium"
                    >
                      Clear all filters
                    </button>
                  </div>
                )}

                {/* Load More Button */}
                {hasMore && (
                  <div className="text-center mt-8">
                    <button
                      onClick={loadMore}
                      className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-3 rounded-lg font-medium transition-colors"
                    >
                      Load More Treks
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
