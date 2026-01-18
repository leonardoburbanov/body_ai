"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { WeightHistory } from "@/components/weight-history";

/**
 * Weight history page
 * Displays the weight tracking history
 */
export default function WeightHistoryPage() {
  const router = useRouter();
  const [userId, setUserId] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    // Get user ID from localStorage (set during login)
    const storedUserId = localStorage.getItem("userId");
    const storedUser = localStorage.getItem("user");

    if (!storedUserId || !storedUser) {
      // Redirect to login if not authenticated
      router.push("/login");
      return;
    }

    setUserId(storedUserId);
    setIsLoading(false);
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!userId) {
    return null;
  }

  return (
    <div className="container mx-auto p-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Weight History</h1>
          <p className="text-muted-foreground">
            View your weight tracking history
          </p>
        </div>
        <WeightHistory userId={userId} />
      </div>
    </div>
  );
}
