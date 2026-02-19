export function MovieCardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="aspect-[2/3] rounded-lg bg-[#333]" />
      <div className="mt-2 space-y-2">
        <div className="h-4 bg-[#333] rounded w-3/4" />
        <div className="h-3 bg-[#333] rounded w-1/2" />
      </div>
    </div>
  );
}
