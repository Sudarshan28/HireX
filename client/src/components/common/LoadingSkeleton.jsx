const LoadingSkeleton = ({ type = 'card' }) => {
  const shimmerClass = "relative overflow-hidden bg-bg-surface before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-accent-primary/10 before:to-transparent";

  if (type === 'card') {
    return (
      <div className="p-6 rounded-xl border border-border bg-bg-card h-40 flex flex-col gap-4">
        <div className="flex justify-between items-start">
          <div className={`w-12 h-12 rounded-lg ${shimmerClass}`} />
        </div>
        <div className="mt-auto">
          <div className={`h-4 w-1/3 rounded mb-2 ${shimmerClass}`} />
          <div className={`h-8 w-1/2 rounded ${shimmerClass}`} />
        </div>
      </div>
    );
  }

  if (type === 'job-card') {
    return (
      <div className="p-6 rounded-xl border border-border bg-bg-card flex flex-col gap-4 h-64">
        <div className="flex gap-4">
          <div className={`w-12 h-12 rounded-full ${shimmerClass}`} />
          <div className="flex-1">
            <div className={`h-6 w-3/4 rounded mb-2 ${shimmerClass}`} />
            <div className={`h-4 w-1/2 rounded ${shimmerClass}`} />
          </div>
        </div>
        <div className={`h-4 w-full rounded ${shimmerClass}`} />
        <div className={`h-4 w-5/6 rounded ${shimmerClass}`} />
        <div className="mt-auto flex gap-2">
          <div className={`h-8 w-16 rounded-full ${shimmerClass}`} />
          <div className={`h-8 w-16 rounded-full ${shimmerClass}`} />
        </div>
      </div>
    );
  }

  if (type === 'profile') {
    return (
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/3 p-6 rounded-xl border border-border bg-bg-card flex flex-col items-center gap-4">
          <div className={`w-32 h-32 rounded-full ${shimmerClass}`} />
          <div className={`h-6 w-3/4 rounded ${shimmerClass}`} />
          <div className={`h-4 w-1/2 rounded ${shimmerClass}`} />
        </div>
        <div className="w-full md:w-2/3 p-6 rounded-xl border border-border bg-bg-card flex flex-col gap-6">
          <div className={`h-10 w-full rounded ${shimmerClass}`} />
          <div className={`h-32 w-full rounded ${shimmerClass}`} />
          <div className={`h-10 w-full rounded ${shimmerClass}`} />
        </div>
      </div>
    );
  }

  return <div className={`w-full h-full rounded ${shimmerClass}`} />;
};

export default LoadingSkeleton;
