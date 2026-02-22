import React from 'react';

export default function SkeletonCard({ isDark }) {
    const base = isDark
        ? 'bg-slate-700'
        : 'bg-gray-200';

    return (
        <div className={`rounded-2xl p-6 border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100'} overflow-hidden relative`}>
            {/* Shimmer overlay */}
            <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            {/* Author row */}
            <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-full ${base} animate-pulse`} />
                <div className="flex-1 space-y-2">
                    <div className={`h-3 w-24 rounded-full ${base} animate-pulse`} />
                    <div className={`h-2 w-16 rounded-full ${base} animate-pulse`} />
                </div>
            </div>

            {/* Title */}
            <div className={`h-5 w-3/4 rounded-full ${base} animate-pulse mb-3`} />
            <div className={`h-5 w-1/2 rounded-full ${base} animate-pulse mb-5`} />

            {/* Excerpt lines */}
            <div className={`h-3 w-full rounded-full ${base} animate-pulse mb-2`} />
            <div className={`h-3 w-5/6 rounded-full ${base} animate-pulse mb-2`} />
            <div className={`h-3 w-4/6 rounded-full ${base} animate-pulse mb-6`} />

            {/* Footer */}
            <div className="flex items-center gap-4">
                <div className={`h-3 w-16 rounded-full ${base} animate-pulse`} />
                <div className={`h-3 w-12 rounded-full ${base} animate-pulse`} />
                <div className={`h-6 w-16 rounded-full ${base} animate-pulse ml-auto`} />
            </div>
        </div>
    );
}
