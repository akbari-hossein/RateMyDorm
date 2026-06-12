"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Header from "@/components/Header";
import BuildingCard from "@/components/BuildingCard";
import LoadingSpinner from "@/components/LoadingSpinner";
import { api, averageRating } from "@/lib/api";
import type { Building, Comment, University } from "@/types";

export default function UniversityDetailPage() {
  const params = useParams();
  const id = Number(params.id);

  const [university, setUniversity] = useState<University | null>(null);
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    async function loadData() {
      try {
        const [uni, allBuildings, allComments] = await Promise.all([
          api.getUniversity(id),
          api.getBuildings(),
          api.getComments(),
        ]);
        setUniversity(uni);
        setBuildings(allBuildings.filter((b) => b.university === id));
        setComments(allComments);
      } catch {
        setError("Failed to load university.");
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [id]);

  const buildingStats = useMemo(() => {
    const stats: Record<number, { count: number; avg: number | null }> = {};

    for (const building of buildings) {
      const buildingComments = comments.filter(
        (c) => c.building_id === building.id
      );
      stats[building.id] = {
        count: buildingComments.length,
        avg: averageRating(buildingComments),
      };
    }

    return stats;
  }, [buildings, comments]);

  return (
    <>
      <Header
        title={university?.name || "University"}
        showBack
        backHref="/universities"
      />

      <div className="px-4 py-5">
        {isLoading ? (
          <LoadingSpinner />
        ) : error ? (
          <p className="text-sm text-red-400">{error}</p>
        ) : (
          <>
            {university && (
              <div className="mb-6">
                <p className="text-sm text-slate-400">
                  {university.city}, {university.country}
                </p>
                {university.description && (
                  <p className="mt-2 text-sm leading-relaxed text-slate-500">
                    {university.description}
                  </p>
                )}
              </div>
            )}

            <h2 className="mb-3 text-base font-semibold text-white">
              Dormitories
            </h2>

            {buildings.length === 0 ? (
              <p className="text-sm text-slate-500">No dormitories listed yet.</p>
            ) : (
              <div className="space-y-3">
                {buildings.map((building) => (
                  <BuildingCard
                    key={building.id}
                    building={building}
                    reviewCount={buildingStats[building.id]?.count || 0}
                    avgRating={buildingStats[building.id]?.avg}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
