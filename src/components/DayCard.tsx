import React from "react";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Button } from "./ui/button";
import { Plus, Edit, Dumbbell } from "lucide-react";
import { Badge } from "./ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

interface Workout {
  id: string;
  name: string;
  description?: string;
  created_at: string;
}

interface DayCardProps {
  date: Date;
  workouts?: Workout[];
  onAddWorkout?: () => void;
  onEditWorkout?: (workoutId: string) => void;
  onStartWorkout?: (workoutId: string) => void;
}

const DayCard = ({
  date = new Date(),
  workouts = [],
  onAddWorkout = () => {},
  onEditWorkout = () => {},
  onStartWorkout = () => {},
}: DayCardProps) => {
  const dayName = date.toLocaleDateString("pt-BR", { weekday: "short" });
  const dayNumber = date.getDate();
  const isToday = new Date().toDateString() === date.toDateString();

  return (
    <Card className="w-full bg-background border-2 hover:border-primary/50 transition-all">
      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            <span
              className={`text-sm font-medium ${isToday ? "text-primary" : "text-muted-foreground"}`}
            >
              {dayName}
            </span>
            <span
              className={`text-2xl font-bold ${isToday ? "text-primary" : ""}`}
            >
              {dayNumber}
            </span>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={onAddWorkout}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Adicionar treino</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <div className="space-y-2">
          {workouts.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-2">
              Nenhum treino
            </p>
          ) : (
            workouts.map((workout) => (
              <div
                key={workout.id}
                className="p-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-sm">{workout.name}</span>
                </div>
                {workout.description && (
                  <div className="text-xs text-muted-foreground">
                    {workout.description}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </CardContent>
      {workouts.length > 0 && (
        <CardFooter className="p-4 pt-2">
          <div className="flex gap-2 w-full">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => onEditWorkout(workouts[0].id)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Editar treinos</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="default"
                    size="sm"
                    className="flex-1"
                    onClick={() => onStartWorkout(workouts[0].id)}
                  >
                    <Dumbbell className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Iniciar treino</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

export default DayCard;
