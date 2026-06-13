"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useAuth } from "@/lib/auth";
import { api, displayName, formatApiError } from "@/lib/api";
import type { Building, University } from "@/types";

export default function ProfilePage() {
  const router = useRouter();
  const { user, isLoading: authLoading, updateProfile, logout } = useAuth();

  const [universities, setUniversities] = useState<University[]>([]);
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [selectedUniversity, setSelectedUniversity] = useState<number | "">("");
  const [selectedBuilding, setSelectedBuilding] = useState<number | "">("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (authLoading) return;

    async function loadData() {
      try {
        const [uniData, buildingData] = await Promise.all([
          api.getUniversities(),
          api.getBuildings(),
        ]);
        setUniversities(uniData);
        setBuildings(buildingData);

        if (user) {
          setSelectedUniversity(user.university || "");
          setSelectedBuilding(user.current_building || "");
        }
      } catch {
        setError("Failed to load profile data.");
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [authLoading, user]);

  const filteredBuildings = useMemo(() => {
    if (!selectedUniversity) return [];
    return buildings.filter((b) => b.university === selectedUniversity);
  }, [buildings, selectedUniversity]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!selectedUniversity || !selectedBuilding) {
      setError("Please select both a university and a dormitory.");
      return;
    }

    setIsSaving(true);
    try {
      await updateProfile({
        university: selectedUniversity,
        current_building: selectedBuilding,
      });
      setSuccess(true);
      setTimeout(() => router.push("/"), 1500);
    } catch (err) {
      setError(formatApiError(err));
    } finally {
      setIsSaving(false);
    }
  };

  if (authLoading || isLoading) {
    return (
      <>
        <Header title="Profile" showBack backHref="/" />
        <LoadingSpinner />
      </>
    );
  }

  return (
    <>
      <Header title="Profile" showBack backHref="/" />

      <div className="px-4 py-5">
        {user && (
          <div className="mb-6 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
            <p className="text-lg font-semibold text-white">
              {displayName(user)}
            </p>
            {user.username && (
              <p className="text-sm text-slate-400">@{user.username}</p>
            )}
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label
              htmlFor="university"
              className="mb-2 block text-sm font-medium text-slate-300"
            >
              University
            </label>
            <select
              id="university"
              value={selectedUniversity}
              onChange={(e) => {
                setSelectedUniversity(Number(e.target.value) || "");
                setSelectedBuilding("");
              }}
              className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white focus:border-indigo-500 focus:outline-none"
            >
              <option value="">Select university</option>
              {universities.map((uni) => (
                <option key={uni.id} value={uni.id}>
                  {uni.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="building"
              className="mb-2 block text-sm font-medium text-slate-300"
            >
              Your dormitory
            </label>
            <select
              id="building"
              value={selectedBuilding}
              onChange={(e) =>
                setSelectedBuilding(Number(e.target.value) || "")
              }
              disabled={!selectedUniversity}
              className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white focus:border-indigo-500 focus:outline-none disabled:opacity-50"
            >
              <option value="">Select dormitory</option>
              {filteredBuildings.map((building) => (
                <option key={building.id} value={building.id}>
                  {building.name}
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-slate-500">
              You can only review the dorm you live in.
            </p>
          </div>

          {error && (
            <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400">
              {error}
            </p>
          )}

          {success && (
            <p className="rounded-lg bg-emerald-500/10 px-3 py-2 text-sm text-emerald-400">
              Profile saved! Redirecting...
            </p>
          )}

          <button
            type="submit"
            disabled={isSaving}
            className="w-full rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:opacity-50"
          >
            {isSaving ? "Saving..." : "Save profile"}
          </button>
        </form>

        <button
          type="button"
          onClick={logout}
          className="mt-6 w-full rounded-xl border border-slate-700 py-3 text-sm text-slate-400 transition hover:border-red-500/50 hover:text-red-400"
        >
          Sign out
        </button>
      </div>
    </>
  );
}
