import React from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { ScrollArea } from "./ui/scroll-area";
import { Timer, Play, Pause, SkipForward, CheckCircle } from "lucide-react";
import ExerciseLogger from "./ExerciseLogger";

interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight: number;
  completed: boolean;
}

interface ActiveWorkoutProps {
  workoutName?: string;
  exercises?: Exercise[];
  onComplete?: () => void;
  onPause?: () => void;
  isActive?: boolean;
}

const ActiveWorkout = ({
  workoutName = "Upper Body Workout",
  exercises = [
    {
      id: "1",
      name: "Bench Press",
      sets: 3,
      reps: 10,
      weight: 60,
      completed: false,
    },
    {
      id: "2",
      name: "Pull-ups",
      sets: 3,
      reps: 8,
      weight: 0,
      completed: false,
    },
    {
      id: "3",
      name: "Shoulder Press",
      sets: 3,
      reps: 12,
      weight: 40,
      completed: false,
    },
  ],
  onComplete = () => console.log("Workout completed"),
  onPause = () => console.log("Workout paused"),
  isActive = true,
}: ActiveWorkoutProps) => {
  const [activeExerciseIndex, setActiveExerciseIndex] = React.useState(0);
  const [elapsedTime, setElapsedTime] = React.useState(0);
  const [isPaused, setIsPaused] = React.useState(false);

  const totalExercises = exercises.length;
  const completedExercises = exercises.filter((ex) => ex.completed).length;
  const progress = (completedExercises / totalExercises) * 100;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && !isPaused) {
      interval = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, isPaused]);

  const handleNextExercise = () => {
    if (activeExerciseIndex < exercises.length - 1) {
      setActiveExerciseIndex((prev) => prev + 1);
    }
  };

  return (
    <Card className="w-full max-w-[800px] p-4 md:p-6 bg-background mx-auto">
      {/* Workout Header */}
      <div className="space-y-4 mb-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">{workoutName}</h2>
          <div className="flex items-center space-x-2">
            <Timer className="h-5 w-5" />
            <span className="font-mono">{formatTime(elapsedTime)}</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span>
              {completedExercises}/{totalExercises} exercises
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="flex space-x-2">
          <Button
            variant={isPaused ? "default" : "outline"}
            className="flex-1"
            onClick={() => setIsPaused(!isPaused)}
          >
            {isPaused ? (
              <>
                <Play className="h-4 w-4 mr-2" /> Resume
              </>
            ) : (
              <>
                <Pause className="h-4 w-4 mr-2" /> Pause
              </>
            )}
          </Button>
          <Button
            variant="outline"
            onClick={handleNextExercise}
            disabled={activeExerciseIndex === exercises.length - 1}
          >
            <SkipForward className="h-4 w-4 mr-2" /> Next
          </Button>
          <Button
            variant="default"
            className="bg-green-500 hover:bg-green-600"
            onClick={onComplete}
          >
            <CheckCircle className="h-4 w-4 mr-2" /> Complete
          </Button>
        </div>
      </div>

      {/* Exercise List */}
      <ScrollArea className="h-[500px] pr-4">
        <div className="space-y-4">
          {exercises.map((exercise, index) => (
            <div
              key={exercise.id}
              className={`transition-all ${index === activeExerciseIndex ? "scale-100" : "scale-95 opacity-50"}`}
            >
              <ExerciseLogger
                exerciseName={exercise.name}
                previousPerformance={[
                  {
                    weight: exercise.weight,
                    reps: exercise.reps,
                    formQuality: "good",
                  },
                ]}
                isOpen={index === activeExerciseIndex}
              />
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
};

export default ActiveWorkout;
