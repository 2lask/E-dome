import { PostSkeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="max-w-xl mx-auto p-4 space-y-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <PostSkeleton key={i} />
      ))}
    </div>
  );
}
