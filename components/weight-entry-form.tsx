"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
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
 * Weight entry form component
 * Allows users to add new weight entries
 */
export function WeightEntryForm({ userId }: { userId: string }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [formData, setFormData] = React.useState({
    weight: "",
    height: "",
    bodyPhoto: "",
    date: new Date().toISOString().split("T")[0],
    notes: "",
  });

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
      router.push("/dashboard");
    } catch (error) {
      toast.error("Failed to add weight", {
        description:
          error instanceof Error ? error.message : "An unexpected error occurred",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
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
          <div className="flex gap-2">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Weight"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/dashboard")}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
