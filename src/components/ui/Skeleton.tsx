"use client";

import { designSystem } from "@/lib/design-system";

interface SkeletonProps {
  className?: string;
  style?: React.CSSProperties;
}

export function Skeleton({ className = "", style }: SkeletonProps) {
  return (
    <div className={`animate-pulse bg-slate-200/80 rounded-md ${className}`} style={style} />
  );
}

export function CardSkeleton() {
  const roundedClass = designSystem.borderRadius.card;
  return (
    <div className={`bg-white border border-slate-100 p-6 md:p-8 flex flex-col h-full animate-pulse ${roundedClass}`}>
      <Skeleton className="h-44 w-full rounded-2xl mb-6" />
      <Skeleton className="h-6 w-3/4 mb-3" />
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-5/6 mb-6" />
      <div className="flex justify-between items-center mt-auto pt-4 border-t border-slate-100">
        <Skeleton className="h-5 w-1/3" />
        <Skeleton className="h-8 w-8 rounded-lg" />
      </div>
    </div>
  );
}

export function StatSkeleton() {
  return (
    <div className="bg-white border border-slate-100 p-5 rounded-2xl animate-pulse shadow-sm">
      <Skeleton className="h-8 w-12 bg-slate-200/80 mb-2" />
      <Skeleton className="h-4 w-24 bg-slate-200/80" />
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="w-full space-y-4 p-4 animate-pulse">
      <div className="flex gap-4 pb-3 border-b border-slate-100">
        <Skeleton className="h-4 w-1/4 bg-slate-200/80" />
        <Skeleton className="h-4 w-1/4 bg-slate-200/80" />
        <Skeleton className="h-4 w-1/6 bg-slate-200/80" />
        <Skeleton className="h-4 w-1/6 bg-slate-200/80" />
      </div>
      {Array.from({ length: rows }).map((_, idx) => (
        <div key={idx} className="flex gap-4 py-2 border-b border-slate-100/40">
          <Skeleton className="h-10 w-1/4 bg-slate-200/50" />
          <Skeleton className="h-8 w-1/4 bg-slate-200/50" />
          <Skeleton className="h-6 w-1/6 bg-slate-200/50" />
          <Skeleton className="h-6 w-1/6 bg-slate-200/50" />
        </div>
      ))}
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Header */}
      <div>
        <Skeleton className="h-4 w-24 bg-slate-200/80 mb-2" />
        <Skeleton className="h-8 w-48 bg-slate-200/80 mb-2" />
        <Skeleton className="h-4 w-64 bg-slate-200/80" />
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div key={idx} className="bg-white border border-slate-100/80 rounded-2xl p-5 shadow-sm">
            <Skeleton className="w-10 h-10 rounded-xl bg-slate-200/80 mb-4" />
            <Skeleton className="h-8 w-16 bg-slate-200/80 mb-2" />
            <Skeleton className="h-4 w-24 bg-slate-200/80" />
          </div>
        ))}
      </div>

      {/* Analytics Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Lead Growth Sparkline */}
        <div className="bg-white border border-slate-100/80 rounded-2xl p-5 col-span-1 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <div>
              <Skeleton className="h-4 w-24 bg-slate-200/80 mb-1" />
              <Skeleton className="h-3 w-16 bg-slate-200/80" />
            </div>
            <Skeleton className="h-5 w-5 bg-slate-200/80 rounded-md" />
          </div>
          <div className="flex items-end gap-1 h-8 mt-6">
            {Array.from({ length: 7 }).map((_, i) => (
              <Skeleton key={i} className="flex-1 bg-slate-200/80 rounded-sm" style={{ height: `${20 + i * 10}%` }} />
            ))}
          </div>
        </div>

        {/* Top Programs */}
        <div className="bg-white border border-slate-100/80 rounded-2xl p-5 col-span-2 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <Skeleton className="h-4 w-36 bg-slate-200/80" />
            <Skeleton className="h-4 w-16 bg-slate-200/80" />
          </div>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-4 w-1/4 bg-slate-200/80" />
                <Skeleton className="flex-1 h-2 bg-slate-200/80 rounded-full" />
                <Skeleton className="h-4 w-6 bg-slate-200/80" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pipeline Status Strip */}
      <div className="bg-white border border-slate-100/80 rounded-2xl p-5 shadow-sm">
        <Skeleton className="h-4 w-32 bg-slate-200/80 mb-4" />
        <Skeleton className="h-3 w-full bg-slate-200/80 rounded-full mb-3" />
        <div className="flex flex-wrap gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <Skeleton className="w-2 h-2 rounded-full bg-slate-200/80" />
              <Skeleton className="h-3 w-16 bg-slate-200/80" />
            </div>
          ))}
        </div>
      </div>

      {/* Recent Leads */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <Skeleton className="h-5 w-28 bg-slate-200/80" />
          <Skeleton className="h-4 w-24 bg-slate-200/80" />
        </div>
        <div className="bg-white border border-slate-100/80 rounded-2xl p-4 shadow-sm">
          <TableSkeleton rows={4} />
        </div>
      </div>
    </div>
  );
}

