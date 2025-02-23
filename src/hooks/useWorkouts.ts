import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";
import type { Database } from "@/types/supabase";

type Workout = Database["public"]["Tables"]["workouts"]["Row"];
type WorkoutExercise = Database["public"]["Tables"]["workout_exercises"]["Row"];

export function useWorkouts() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchWorkouts();
    }
  }, [user]);

  async function fetchWorkouts() {
    try {
      const { data, error } = await supabase
        .from("workouts")
        .select(
          `
          *,
          workout_exercises (*, exercises (*))
        `,
        )
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setWorkouts(data || []);
    } catch (error) {
      console.error("Error fetching workouts:", error);
    } finally {
      setLoading(false);
    }
  }

  async function createWorkout(workout: {
    name: string;
    description?: string;
    exercises: { id: string; order: number }[];
  }) {
    try {
      // Criar o treino
      const { data: workoutData, error: workoutError } = await supabase
        .from("workouts")
        .insert([
          {
            name: workout.name,
            description: workout.description,
            user_id: user?.id,
          },
        ])
        .select()
        .single();

      if (workoutError) throw workoutError;

      // Adicionar exercícios ao treino
      const workoutExercises = workout.exercises.map((exercise) => ({
        workout_id: workoutData.id,
        exercise_id: exercise.id,
        order: exercise.order,
      }));

      const { error: exercisesError } = await supabase
        .from("workout_exercises")
        .insert(workoutExercises);

      if (exercisesError) throw exercisesError;

      await fetchWorkouts(); // Recarregar treinos
      return workoutData;
    } catch (error) {
      console.error("Error creating workout:", error);
      throw error;
    }
  }

  async function importWorkout(workoutId: string) {
    try {
      // Buscar o treino original
      const { data: originalWorkout, error: workoutError } = await supabase
        .from("workouts")
        .select(
          `
          *,
          workout_exercises (*, exercises (*))
        `,
        )
        .eq("id", workoutId)
        .single();

      if (workoutError) throw workoutError;

      // Criar uma cópia para o usuário atual
      const { data: newWorkout, error: copyError } = await supabase
        .from("workouts")
        .insert([
          {
            name: `${originalWorkout.name} (Importado)`,
            description: originalWorkout.description,
            user_id: user?.id,
          },
        ])
        .select()
        .single();

      if (copyError) throw copyError;

      // Copiar os exercícios
      const workoutExercises = originalWorkout.workout_exercises.map(
        (we: WorkoutExercise) => ({
          workout_id: newWorkout.id,
          exercise_id: we.exercise_id,
          order: we.order,
        }),
      );

      const { error: exercisesError } = await supabase
        .from("workout_exercises")
        .insert(workoutExercises);

      if (exercisesError) throw exercisesError;

      await fetchWorkouts();
      return newWorkout;
    } catch (error) {
      console.error("Error importing workout:", error);
      throw error;
    }
  }

  return { workouts, loading, createWorkout, importWorkout };
}
