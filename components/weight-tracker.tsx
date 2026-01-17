"use client";

import * as React from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ImageUpload } from "@/components/image-upload";

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
 * Weight tracker component
 * Allows users to add and view weight entries
 */
export function WeightTracker({ userId }: { userId: string }) {
  const [weights, setWeights] = React.useState<WeightEntry[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [formData, setFormData] = React.useState({
    weight: "",
    height: "",
    bodyPhoto: "",
    date: new Date().toISOString().split("T")[0],
    notes: "",
  });

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
   * Handles form input changes
   */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /**
   * Handles form submission
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const weightValue = parseFloat(formData.weight);
      if (isNaN(weightValue) || weightValue <= 0) {
        throw new Error("Please enter a valid weight");
      }

      const heightValue = formData.height
        ? parseFloat(formData.height)
        : undefined;

      const response = await fetch("/api/weights", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          weight: weightValue,
          height: heightValue && !isNaN(heightValue) && heightValue > 0 ? heightValue : undefined,
          bodyPhoto: formData.bodyPhoto || undefined,
          date: new Date(formData.date).toISOString(),
          notes: formData.notes.trim() || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to add weight");
      }

      toast.success("Weight added successfully!");
      setFormData({
        weight: "",
        height: "",
        bodyPhoto: "",
        date: new Date().toISOString().split("T")[0],
        notes: "",
      });
      await fetchWeights();
    } catch (error) {
      toast.error("Failed to add weight", {
        description:
          error instanceof Error ? error.message : "An unexpected error occurred",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add Weight Entry</CardTitle>
          <CardDescription>Record your weight for today</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  name="weight"
                  type="number"
                  step="0.1"
                  min="0"
                  placeholder="70.5"
                  value={formData.weight}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="height">Height (cm)</Label>
                <Input
                  id="height"
                  name="height"
                  type="number"
                  step="0.1"
                  min="0"
                  placeholder="175"
                  value={formData.height}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes (optional)</Label>
                <Input
                  id="notes"
                  name="notes"
                  type="text"
                  placeholder="Morning weight, after workout, etc."
                  value={formData.notes}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div>
              <ImageUpload
                value={formData.bodyPhoto}
                onChange={(url) => setFormData((prev) => ({ ...prev, bodyPhoto: url || "" }))}
                label="Body Photo (optional)"
              />
            </div>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Weight"}
            </Button>
          </form>
        </CardContent>
      </Card>

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
              No weight entries yet. Add your first entry above!
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
    </div>
  );
}
