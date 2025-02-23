import React from "react";
import WeeklyCalendar from "./WeeklyCalendar";
import WorkoutForm from "./WorkoutForm";
import ActiveWorkout from "./ActiveWorkout";
import MeasurementsTracker from "./MeasurementsTracker";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Plus, LineChart } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";

const Home = () => {
  const [isWorkoutFormOpen, setIsWorkoutFormOpen] = React.useState(false);
  const [activeWorkout, setActiveWorkout] = React.useState<string | null>(null);

  const handleStartWorkout = (workoutId: string) => {
    setActiveWorkout(workoutId);
  };

  const handleCompleteWorkout = () => {
    setActiveWorkout(null);
  };

  return (
    <div className="min-h-screen w-full bg-background p-4 md:p-6">
      <div className="max-w-[1512px] mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">MuscleUP</h1>
          <div className="flex gap-2">
            <Dialog
              open={isWorkoutFormOpen}
              onOpenChange={setIsWorkoutFormOpen}
            >
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Treino
                </Button>
              </DialogTrigger>
              <DialogContent className="p-0">
                <WorkoutForm
                  onSave={() => setIsWorkoutFormOpen(false)}
                  onClose={() => setIsWorkoutFormOpen(false)}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="calendar" className="w-full">
          <TabsList className="grid w-full max-w-[300px] md:max-w-[400px] grid-cols-2">
            <TabsTrigger value="calendar">Calendário</TabsTrigger>
            <TabsTrigger value="stats">
              <LineChart className="h-4 w-4 mr-2" />
              Medidas
            </TabsTrigger>
          </TabsList>

          <TabsContent value="calendar" className="space-y-6">
            {activeWorkout ? (
              <ActiveWorkout
                onComplete={handleCompleteWorkout}
                isActive={true}
              />
            ) : (
              <WeeklyCalendar
                onStartWorkout={handleStartWorkout}
                onAddWorkout={() => setIsWorkoutFormOpen(true)}
              />
            )}
          </TabsContent>

          <TabsContent value="stats">
            <MeasurementsTracker />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Home;
