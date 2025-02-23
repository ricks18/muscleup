import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import type { Database } from "@/types/supabase";

type Exercise = Database["public"]["Tables"]["exercises"]["Row"];

export function useExercises() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExercises();
  }, []);

  async function fetchExercises() {
    try {
      const { data, error } = await supabase
        .from("exercises")
        .select("*")
        .order("name");

      if (error) throw error;
      setExercises(data || []);
    } catch (error) {
      console.error("Error fetching exercises:", error);
    } finally {
      setLoading(false);
    }
  }

  async function createExercise(exercise: Omit<Exercise, "id" | "created_at">) {
    try {
      const { data, error } = await supabase
        .from("exercises")
        .insert([exercise])
        .select()
        .single();

      if (error) throw error;
      setExercises([...exercises, data]);
      return data;
    } catch (error) {
      console.error("Error creating exercise:", error);
      throw error;
    }
  }

  return { exercises, loading, createExercise };
}
