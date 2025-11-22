"use client";

export default function Error({ reset }: { reset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        Something went wrong!
      </h2>
      <p className="text-gray-600 mb-6 max-w-md">
        We couldn't load the articles. Please try again later.
      </p>
      <button
        onClick={reset}
        className="px-6 py-2 bg-black text-white rounded-full font-medium hover:opacity-90 transition-opacity"
      >
        Try again
      </button>
    </div>
  );
}
