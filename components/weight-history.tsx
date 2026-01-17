"use client";

import * as React from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

/**
 * Weight entry interface
 */
interface WeightEntry {
  id: string;
  weight: number;
  height?: number;
  bodyPhoto?: string;
  date: string;
  notes?: string;
}

/**
 * Weight history component
 * Displays the user's weight tracking history
 */
export function WeightHistory({ userId }: { userId: string }) {
  const [weights, setWeights] = React.useState<WeightEntry[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  /**
   * Fetches weight entries from the API
   */
  const fetchWeights = React.useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/weights?userId=${userId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch weights");
      }

      setWeights(
        data.weights.map((w: any) => ({
          id: w.id,
          weight: w.weight,
          height: w.height,
          bodyPhoto: w.bodyPhoto,
          date: new Date(w.date).toISOString().split("T")[0],
          notes: w.notes || "",
        }))
      );
    } catch (error) {
      toast.error("Failed to load weights", {
        description:
          error instanceof Error ? error.message : "An unexpected error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  /**
   * Loads weights on component mount
   */
  React.useEffect(() => {
    fetchWeights();
  }, [fetchWeights]);

  /**
   * Handles weight entry deletion
   */
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this weight entry?")) {
      return;
    }

    try {
      const response = await fetch(`/api/weights/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete weight");
      }

      toast.success("Weight entry deleted successfully");
      await fetchWeights();
    } catch (error) {
      toast.error("Failed to delete weight", {
        description:
          error instanceof Error ? error.message : "An unexpected error occurred",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weight History</CardTitle>
        <CardDescription>Your weight tracking history</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">
            Loading...
          </div>
        ) : weights.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No weight entries yet. Add your first entry!
          </div>
        ) : (
          <div className="space-y-4">
            {weights.map((entry) => (
              <div
                key={entry.id}
                className="border rounded-lg hover:bg-accent/50 transition-colors overflow-hidden"
              >
                <div className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        <div className="font-semibold text-lg">
                          {entry.weight} kg
                        </div>
                        {entry.height && (
                          <div className="text-sm text-muted-foreground">
                            {entry.height} cm
                          </div>
                        )}
                        <div className="text-sm text-muted-foreground">
                          {new Date(entry.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </div>
                      </div>
                      {entry.notes && (
                        <div className="text-sm text-muted-foreground mb-2">
                          {entry.notes}
                        </div>
                      )}
                      {entry.bodyPhoto && (
                        <div className="mt-3">
                          <img
                            src={entry.bodyPhoto}
                            alt="Body photo"
                            className="w-full max-w-xs h-48 object-contain rounded-md border bg-muted"
                          />
                        </div>
                      )}
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(entry.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
