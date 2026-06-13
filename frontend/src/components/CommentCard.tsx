import Image from "next/image";
import { getMediaUrl } from "@/lib/api";
import StarRating from "@/components/StarRating";
import type { Comment } from "@/types";

interface CommentCardProps {
  comment: Comment;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function CommentCard({ comment }: CommentCardProps) {
  const imageUrl = getMediaUrl(comment.image);

  return (
    <article className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-medium text-white">{comment.student}</p>
          <p className="text-xs text-slate-500">{formatDate(comment.created_at)}</p>
        </div>
        <StarRating rating={comment.rating} size="sm" />
      </div>

      <p className="mt-3 text-sm leading-relaxed text-slate-300">
        {comment.content}
      </p>

      {imageUrl && (
        <div className="relative mt-3 overflow-hidden rounded-xl">
          <Image
            src={imageUrl}
            alt="Review photo"
            width={600}
            height={400}
            className="h-48 w-full object-cover"
            unoptimized
          />
        </div>
      )}
    </article>
  );
}
