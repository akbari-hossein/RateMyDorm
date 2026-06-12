"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import UniversityCard from "@/components/UniversityCard";
import LoadingSpinner from "@/components/LoadingSpinner";
import { api } from "@/lib/api";
import type { University } from "@/types";

export default function UniversitiesPage() {
  const [universities, setUniversities] = useState<University[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .getUniversities()
      .then(setUniversities)
      .catch(() => setError("Failed to load universities."))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <>
      <Header title="Universities" showBack backHref="/" />

      <div className="px-4 py-5">
        {isLoading ? (
          <LoadingSpinner />
        ) : error ? (
          <p className="text-sm text-red-400">{error}</p>
        ) : universities.length === 0 ? (
          <p className="text-sm text-slate-500">No universities found.</p>
        ) : (
          <div className="space-y-3">
            {universities.map((uni) => (
              <UniversityCard key={uni.id} university={uni} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
