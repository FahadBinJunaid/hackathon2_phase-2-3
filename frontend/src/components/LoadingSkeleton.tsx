/**
 * LoadingSkeleton Component - Loading states during data fetching
 * Feature: 003-nextjs-frontend-integration
 * Agent: frontend-agent
 */

export default function LoadingSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="bg-slate-900/50 border border-slate-800 shadow-sm rounded-lg p-4 animate-pulse"
        >
          <div className="flex items-start space-x-3">
            <div className="h-5 w-5 bg-slate-800 rounded mt-1"></div>
            <div className="flex-1 space-y-3">
              <div className="h-6 bg-slate-800 rounded w-3/4"></div>
              <div className="h-4 bg-slate-800 rounded w-full"></div>
              <div className="h-3 bg-slate-800 rounded w-1/4"></div>
            </div>
            <div className="flex space-x-2">
              <div className="h-8 w-12 bg-slate-800 rounded"></div>
              <div className="h-8 w-16 bg-slate-800 rounded"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
