"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import UniversityCard from "@/components/UniversityCard";
import CommentCard from "@/components/CommentCard";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useAuth } from "@/lib/auth";
import { api } from "@/lib/api";
import type { Comment, University } from "@/types";

export default function HomePage() {
  const { isLoading: authLoading, error: authError, needsOnboarding, user } =
    useAuth();
  const [universities, setUniversities] = useState<University[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;

    async function loadData() {
      try {
        const [uniData, commentData] = await Promise.all([
          api.getUniversities(),
          api.getComments(),
        ]);
        setUniversities(uniData);
        setComments(commentData.slice(0, 5));
      } catch {
        setError("Failed to load data. Is the backend running?");
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [authLoading]);

  if (authLoading || isLoading) {
    return (
      <>
        <Header />
        <LoadingSpinner />
      </>
    );
  }

  return (
    <>
      <Header />

      <div className="space-y-6 px-4 py-5">
        {authError && (
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-300">
            {authError}
          </div>
        )}

        {needsOnboarding && (
          <div className="rounded-2xl border border-indigo-500/30 bg-indigo-500/10 p-4">
            <p className="font-medium text-indigo-200">Complete your profile</p>
            <p className="mt-1 text-sm text-indigo-300/80">
              Select your university and dorm to write a review.
            </p>
            <Link
              href="/profile"
              className="mt-3 inline-block rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
            >
              Set up profile
            </Link>
          </div>
        )}

        {!needsOnboarding && user?.current_building && (
          <Link
            href="/review"
            className="block rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 p-4 text-center font-semibold text-white transition hover:from-indigo-500 hover:to-violet-500"
          >
            Write a review for your dorm
          </Link>
        )}

        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-base font-semibold text-white">Universities</h2>
            <Link href="/universities" className="text-sm text-indigo-400">
              See all
            </Link>
          </div>
          {error ? (
            <p className="text-sm text-red-400">{error}</p>
          ) : universities.length === 0 ? (
            <p className="text-sm text-slate-500">No universities yet.</p>
          ) : (
            <div className="space-y-3">
              {universities.slice(0, 3).map((uni) => (
                <UniversityCard key={uni.id} university={uni} />
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="mb-3 text-base font-semibold text-white">
            Recent Reviews
          </h2>
          {comments.length === 0 ? (
            <p className="text-sm text-slate-500">No reviews yet. Be the first!</p>
          ) : (
            <div className="space-y-3">
              {comments.map((comment) => (
                <CommentCard key={comment.id} comment={comment} />
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  );
}
