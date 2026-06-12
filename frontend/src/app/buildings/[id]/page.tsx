"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Header from "@/components/Header";
import CommentCard from "@/components/CommentCard";
import StarRating from "@/components/StarRating";
import LoadingSpinner from "@/components/LoadingSpinner";
import { api, averageRating, genderLabel } from "@/lib/api";
import type { Building, Comment, University } from "@/types";

export default function BuildingDetailPage() {
  const params = useParams();
  const id = Number(params.id);

  const [building, setBuilding] = useState<Building | null>(null);
  const [university, setUniversity] = useState<University | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    async function loadData() {
      try {
        const buildingData = await api.getBuilding(id);
        setBuilding(buildingData);

        const [uni, allComments] = await Promise.all([
          api.getUniversity(buildingData.university),
          api.getComments(),
        ]);
        setUniversity(uni);
        setComments(
          allComments.filter((c) => c.building_id === buildingData.id)
        );
      } catch {
        setError("Failed to load building.");
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [id]);

  const avgRating = useMemo(() => averageRating(comments), [comments]);

  return (
    <>
      <Header
        title={building?.name || "Dormitory"}
        showBack
        backHref={university ? `/universities/${university.id}` : "/"}
      />

      <div className="px-4 py-5">
        {isLoading ? (
          <LoadingSpinner />
        ) : error ? (
          <p className="text-sm text-red-400">{error}</p>
        ) : building ? (
          <>
            <div className="mb-6 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
              {university && (
                <p className="text-sm text-indigo-400">{university.name}</p>
              )}
              {building.address && (
                <p className="mt-1 text-sm text-slate-400">{building.address}</p>
              )}
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-slate-800 px-2.5 py-1 text-xs text-slate-300">
                  {genderLabel(building.gender)}
                </span>
                {avgRating !== null && (
                  <div className="flex items-center gap-2">
                    <StarRating rating={Math.round(avgRating)} size="sm" />
                    <span className="text-sm text-slate-400">
                      {avgRating} ({comments.length} review
                      {comments.length !== 1 ? "s" : ""})
                    </span>
                  </div>
                )}
              </div>
              {building.description && (
                <p className="mt-3 text-sm leading-relaxed text-slate-500">
                  {building.description}
                </p>
              )}
              {building.facilities && (
                <p className="mt-2 text-xs text-slate-600">
                  Facilities: {building.facilities}
                </p>
              )}
            </div>

            <h2 className="mb-3 text-base font-semibold text-white">Reviews</h2>

            {comments.length === 0 ? (
              <p className="text-sm text-slate-500">
                No reviews yet for this dorm.
              </p>
            ) : (
              <div className="space-y-3">
                {comments.map((comment) => (
                  <CommentCard key={comment.id} comment={comment} />
                ))}
              </div>
            )}
          </>
        ) : null}
      </div>
    </>
  );
}
