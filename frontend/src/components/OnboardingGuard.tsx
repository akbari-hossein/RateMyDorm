"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";

interface OnboardingGuardProps {
  children: React.ReactNode;
  requireComplete?: boolean;
}

export default function OnboardingGuard({
  children,
  requireComplete = false,
}: OnboardingGuardProps) {
  const { isLoading, needsOnboarding, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (requireComplete && isAuthenticated && needsOnboarding) {
      router.replace("/profile");
    }
  }, [isLoading, needsOnboarding, isAuthenticated, requireComplete, router]);

  if (isLoading) return null;

  return <>{children}</>;
}
