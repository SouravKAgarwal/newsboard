import { timeAgo } from "@/lib/time";

const TimeAgoSkeleton = () => {
  return (
    <span className="inline-block h-4 w-16 bg-gray-200 rounded-full animate-pulse" />
  );
};

const TimeAgo = ({ date }: { date: Date }) => {
  return <span className="text-xs text-gray-500">{timeAgo(date)}</span>;
};

export { TimeAgo, TimeAgoSkeleton };
