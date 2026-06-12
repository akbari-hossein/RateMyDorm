"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import ReviewForm from "@/components/ReviewForm";
import LoadingSpinner from "@/components/LoadingSpinner";
import OnboardingGuard from "@/components/OnboardingGuard";
import { useAuth } from "@/lib/auth";
import { api } from "@/lib/api";
import type { Building } from "@/types";

export default function ReviewPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [building, setBuilding] = useState<Building | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (authLoading || !user?.current_building) return;

    api
      .getBuilding(user.current_building)
      .then(setBuilding)
      .finally(() => setIsLoading(false));
  }, [authLoading, user]);

  const handleSubmit = async (data: {
    content: string;
    rating: number;
    image?: File;
  }) => {
    if (!user?.current_building) return;

    await api.createComment({
      ...data,
      building_id: user.current_building,
    });

    setTimeout(() => router.push(`/buildings/${user.current_building}`), 2000);
  };

  if (authLoading || isLoading) {
    return (
      <>
        <Header title="Write Review" showBack backHref="/" />
        <LoadingSpinner />
      </>
    );
  }

  return (
    <OnboardingGuard requireComplete>
      <Header title="Write Review" showBack backHref="/" />

      <div className="px-4 py-5">
        {building && (
          <div className="mb-6 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
            <p className="text-xs uppercase tracking-wider text-indigo-400">
              Reviewing
            </p>
            <p className="mt-1 text-lg font-semibold text-white">
              {building.name}
            </p>
            {building.address && (
              <p className="text-sm text-slate-400">{building.address}</p>
            )}
          </div>
        )}

        {user?.current_building && (
          <ReviewForm
            buildingId={user.current_building}
            onSubmit={handleSubmit}
          />
        )}
      </div>
    </OnboardingGuard>
  );
}
