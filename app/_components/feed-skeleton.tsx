const FeedSkeleton = () => (
  <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
    {Array.from({ length: 6 }).map((_, i) => (
      <div
        key={i}
        className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col h-full animate-pulse"
      >
        <div className="relative w-full h-48 bg-gray-200" />
        <div className="flex flex-col justify-between p-5 flex-1">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="inline-block px-10 py-2 bg-red-100 rounded-full" />
              <span className="h-4 w-12 bg-gray-200 rounded" />
            </div>
            <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
            <div className="h-5 bg-gray-200 rounded w-2/3 mb-2" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
            <span className="h-4 w-16 bg-gray-200 rounded" />
            <span className="h-4 w-16 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    ))}
  </section>
);

export default FeedSkeleton;
