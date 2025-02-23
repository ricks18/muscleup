import React from "react";
import DayCard from "./DayCard";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useWorkouts } from "@/hooks/useWorkouts";

interface WeeklyCalendarProps {
  startDate?: Date;
  onAddWorkout?: (date: Date) => void;
  onEditWorkout?: (workoutId: string, date: Date) => void;
  onStartWorkout?: (workoutId: string, date: Date) => void;
}

const WeeklyCalendar = ({
  startDate = new Date(),
  onAddWorkout = () => {},
  onEditWorkout = () => {},
  onStartWorkout = () => {},
}: WeeklyCalendarProps) => {
  const [currentWeekStart, setCurrentWeekStart] = React.useState(startDate);
  const { workouts } = useWorkouts();

  // Get dates for the current week
  const weekDates = React.useMemo(() => {
    const dates = [];
    const firstDay = new Date(currentWeekStart);
    firstDay.setDate(firstDay.getDate() - firstDay.getDay()); // Start from Sunday

    for (let i = 0; i < 7; i++) {
      const date = new Date(firstDay);
      date.setDate(date.getDate() + i);
      dates.push(date);
    }
    return dates;
  }, [currentWeekStart]);

  const navigateWeek = (direction: "prev" | "next") => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(
      currentWeekStart.getDate() + (direction === "next" ? 7 : -7),
    );
    setCurrentWeekStart(newDate);
  };

  return (
    <div className="w-full max-w-[1512px] bg-background p-4 space-y-4">
      {/* Calendar Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">
          {currentWeekStart.toLocaleDateString("pt-BR", {
            month: "long",
            year: "numeric",
          })}
        </h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigateWeek("prev")}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigateWeek("next")}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="flex flex-col space-y-4">
        {weekDates.map((date) => (
          <DayCard
            key={date.toISOString()}
            date={date}
            workouts={workouts.filter((w) => {
              const workoutDate = new Date(w.created_at);
              return workoutDate.toDateString() === date.toDateString();
            })}
            onAddWorkout={() => onAddWorkout(date)}
            onEditWorkout={(workoutId) => onEditWorkout(workoutId, date)}
            onStartWorkout={(workoutId) => onStartWorkout(workoutId, date)}
          />
        ))}
      </div>
    </div>
  );
};

export default WeeklyCalendar;
