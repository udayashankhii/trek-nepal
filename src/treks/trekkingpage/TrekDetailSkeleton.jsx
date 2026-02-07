import React from 'react';

const TrekDetailSkeleton = () => {
    return (
        <div className="bg-gray-50 min-h-screen animate-pulse">
            {/* Hero Skeleton */}
            <div className="h-[60vh] md:h-[75vh] bg-gray-200 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-8 md:p-16">
                    <div className="max-w-7xl mx-auto w-full">
                        <div className="h-4 w-32 bg-gray-300/50 rounded mb-4"></div>
                        <div className="h-12 w-3/4 md:w-1/2 bg-gray-300/50 rounded mb-6"></div>
                        <div className="flex flex-wrap gap-4">
                            <div className="h-10 w-36 bg-gray-300/50 rounded-lg"></div>
                            <div className="h-10 w-36 bg-gray-400/30 rounded-lg"></div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 px-4 py-10">
                {/* Main Content Skeleton */}
                <div className="flex-1 space-y-8">
                    {/* Key Info Skeleton */}
                    <div className="bg-white rounded-2xl shadow-sm p-6 grid grid-cols-2 md:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="flex items-center space-x-3">
                                <div className="h-10 w-10 bg-gray-100 rounded-full"></div>
                                <div className="space-y-2">
                                    <div className="h-3 w-16 bg-gray-100 rounded"></div>
                                    <div className="h-4 w-24 bg-gray-200 rounded"></div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Overview Skeleton */}
                    <div className="bg-white rounded-2xl shadow-sm p-8 space-y-6">
                        <div className="h-8 w-48 bg-gray-200 rounded"></div>
                        <div className="space-y-4">
                            <div className="h-4 w-full bg-gray-100 rounded"></div>
                            <div className="h-4 w-full bg-gray-100 rounded"></div>
                            <div className="h-4 w-5/6 bg-gray-100 rounded"></div>
                        </div>
                    </div>

                    {/* Highlights Skeleton */}
                    <div className="bg-white rounded-2xl shadow-sm p-8 space-y-6">
                        <div className="h-8 w-56 bg-gray-200 rounded"></div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="flex items-center space-x-3">
                                    <div className="h-5 w-5 bg-emerald-100/50 rounded-full"></div>
                                    <div className="h-4 w-3/4 bg-gray-100 rounded"></div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Inclusions Skeleton */}
                    <div className="bg-white rounded-2xl shadow-sm p-8 space-y-6">
                        <div className="h-8 w-40 bg-gray-200 rounded"></div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <div className="h-5 w-32 bg-emerald-50 rounded"></div>
                                {[...Array(4)].map((_, i) => (
                                    <div key={i} className="h-4 w-full bg-gray-50 rounded"></div>
                                ))}
                            </div>
                            <div className="space-y-4">
                                <div className="h-5 w-32 bg-red-50 rounded"></div>
                                {[...Array(4)].map((_, i) => (
                                    <div key={i} className="h-4 w-full bg-gray-50 rounded"></div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar Skeleton */}
                <aside className="w-full lg:w-96">
                    <div className="bg-white rounded-2xl shadow-lg p-6 space-y-8 sticky top-24">
                        <div className="text-center space-y-4">
                            <div className="h-6 w-1/2 bg-gray-200 rounded mx-auto"></div>
                            <div className="flex justify-center items-baseline space-x-2">
                                <div className="h-10 w-28 bg-gray-300 rounded"></div>
                                <div className="h-4 w-12 bg-gray-100 rounded"></div>
                            </div>
                        </div>

                        <div className="space-y-4 py-6 border-y border-gray-100">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="flex justify-between items-center">
                                    <div className="h-4 w-32 bg-gray-100 rounded"></div>
                                    <div className="h-4 w-16 bg-gray-200 rounded"></div>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-3">
                            <div className="h-14 w-full bg-emerald-600/20 rounded-xl"></div>
                            <div className="h-14 w-full bg-gray-100 rounded-xl"></div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="flex flex-col items-center space-y-2">
                                    <div className="h-8 w-8 bg-gray-100 rounded-lg"></div>
                                    <div className="h-2 w-16 bg-gray-50 rounded"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default TrekDetailSkeleton;
