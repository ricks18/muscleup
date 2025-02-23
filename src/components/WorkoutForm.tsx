import React from "react";
import { Card, CardContent, CardHeader } from "./ui/card";
import { useExercises } from "@/hooks/useExercises";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { ScrollArea } from "./ui/scroll-area";
import { Search, Plus, X, Save } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";

interface Exercise {
  id: string;
  name: string;
  description: string;
  category: string;
}

interface WorkoutFormProps {
  onSave?: (workout: {
    name: string;
    description: string;
    exercises: Exercise[];
  }) => void;
  isOpen?: boolean;
  onClose?: () => void;
  initialWorkout?: {
    name: string;
    description: string;
    exercises: Exercise[];
  };
}

const WorkoutForm = ({
  onSave = () => {},
  isOpen = true,
  onClose = () => {},
  initialWorkout = {
    name: "",
    description: "",
    exercises: [],
  },
}: WorkoutFormProps) => {
  const [workoutName, setWorkoutName] = React.useState(initialWorkout.name);
  const [description, setDescription] = React.useState(
    initialWorkout.description,
  );
  const [selectedExercises, setSelectedExercises] = React.useState<Exercise[]>(
    initialWorkout.exercises,
  );
  const [searchQuery, setSearchQuery] = React.useState("");

  const { exercises: exerciseDatabase } = useExercises();

  const filteredExercises = exerciseDatabase.filter((exercise) =>
    exercise.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleAddExercise = (exercise: Exercise) => {
    if (!selectedExercises.find((e) => e.id === exercise.id)) {
      setSelectedExercises([...selectedExercises, exercise]);
    }
  };

  const handleRemoveExercise = (exerciseId: string) => {
    setSelectedExercises(selectedExercises.filter((e) => e.id !== exerciseId));
  };

  const handleSave = () => {
    onSave({
      name: workoutName,
      description,
      exercises: selectedExercises,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[800px] w-[95vw] h-[90vh] md:h-[80vh] flex flex-col bg-background">
        <DialogHeader>
          <DialogTitle>Criar Treino</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col space-y-4 flex-grow overflow-hidden">
          {/* Workout Details */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="workout-name">Nome do Treino</Label>
              <Input
                id="workout-name"
                value={workoutName}
                onChange={(e) => setWorkoutName(e.target.value)}
                placeholder="E.g., Upper Body Strength"
              />
            </div>
            <div>
              <Label htmlFor="workout-description">Descrição</Label>
              <Textarea
                id="workout-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add workout description..."
              />
            </div>
          </div>

          <div className="flex flex-1 gap-4 min-h-0">
            {/* Exercise Selection */}
            <Card className="flex-1">
              <CardHeader>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search exercises..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px] pr-4">
                  <div className="space-y-2">
                    {filteredExercises.map((exercise) => (
                      <div
                        key={exercise.id}
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-muted cursor-pointer"
                        onClick={() => handleAddExercise(exercise)}
                      >
                        <div>
                          <h4 className="font-medium">{exercise.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {exercise.category}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddExercise(exercise);
                          }}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Selected Exercises */}
            <Card className="flex-1">
              <CardHeader>Exercícios Selecionados</CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px] pr-4">
                  <div className="space-y-2">
                    {selectedExercises.map((exercise) => (
                      <div
                        key={exercise.id}
                        className="flex items-center justify-between p-2 rounded-lg bg-muted"
                      >
                        <div>
                          <h4 className="font-medium">{exercise.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {exercise.category}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveExercise(exercise.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Salvar Treino
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WorkoutForm;
