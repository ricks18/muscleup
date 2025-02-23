import React from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Slider } from "./ui/slider";
import { Badge } from "./ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import {
  ChevronUp,
  ChevronDown,
  ThumbsUp,
  ThumbsDown,
  Minus,
} from "lucide-react";

interface ExerciseSet {
  weight: number;
  reps: number;
  formQuality: "good" | "okay" | "poor";
}

interface ExerciseLoggerProps {
  exerciseName?: string;
  previousPerformance?: ExerciseSet[];
  onSetLogged?: (set: ExerciseSet) => void;
  isOpen?: boolean;
}

const ExerciseLogger = ({
  exerciseName = "Barbell Squat",
  previousPerformance = [
    { weight: 100, reps: 8, formQuality: "good" },
    { weight: 100, reps: 8, formQuality: "okay" },
    { weight: 95, reps: 8, formQuality: "good" },
  ],
  onSetLogged = () => {},
  isOpen = true,
}: ExerciseLoggerProps) => {
  const [weight, setWeight] = React.useState(100);
  const [reps, setReps] = React.useState(8);
  const [formQuality, setFormQuality] = React.useState<
    "good" | "okay" | "poor"
  >("good");

  const formQualityColors = {
    good: "bg-green-500",
    okay: "bg-yellow-500",
    poor: "bg-red-500",
  };

  const handleLogSet = () => {
    onSetLogged({ weight, reps, formQuality });
    // Reset form quality after logging
    setFormQuality("good");
  };

  return (
    <Card className="w-full max-w-[800px] p-6 bg-background">
      <div className="space-y-6">
        {/* Exercise Header */}
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold">{exerciseName}</h3>
          <Badge variant="secondary">
            Previous: {previousPerformance[0]?.weight}kg ×{" "}
            {previousPerformance[0]?.reps}
          </Badge>
        </div>

        {/* Weight Input */}
        <div className="space-y-2">
          <Label>Weight (kg)</Label>
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setWeight((prev) => Math.max(0, prev - 2.5))}
            >
              <ChevronDown className="h-4 w-4" />
            </Button>
            <Input
              type="number"
              value={weight}
              onChange={(e) => setWeight(Number(e.target.value))}
              className="w-24 text-center"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={() => setWeight((prev) => prev + 2.5)}
            >
              <ChevronUp className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Reps Input */}
        <div className="space-y-2">
          <Label>Reps</Label>
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setReps((prev) => Math.max(1, prev - 1))}
            >
              <ChevronDown className="h-4 w-4" />
            </Button>
            <Input
              type="number"
              value={reps}
              onChange={(e) => setReps(Number(e.target.value))}
              className="w-24 text-center"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={() => setReps((prev) => prev + 1)}
            >
              <ChevronUp className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Form Quality */}
        <div className="space-y-2">
          <Label>Form Quality</Label>
          <div className="flex space-x-4">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={formQuality === "good" ? "default" : "outline"}
                    className={
                      formQuality === "good"
                        ? "bg-green-500 hover:bg-green-600"
                        : ""
                    }
                    onClick={() => setFormQuality("good")}
                  >
                    <ThumbsUp className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Good Form</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={formQuality === "okay" ? "default" : "outline"}
                    className={
                      formQuality === "okay"
                        ? "bg-yellow-500 hover:bg-yellow-600"
                        : ""
                    }
                    onClick={() => setFormQuality("okay")}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Okay Form</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={formQuality === "poor" ? "default" : "outline"}
                    className={
                      formQuality === "poor"
                        ? "bg-red-500 hover:bg-red-600"
                        : ""
                    }
                    onClick={() => setFormQuality("poor")}
                  >
                    <ThumbsDown className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Poor Form</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        {/* Log Set Button */}
        <Button className="w-full" onClick={handleLogSet}>
          Registrar Série
        </Button>

        {/* Previous Sets */}
        <div className="space-y-2">
          <Label>Séries Anteriores</Label>
          <div className="space-y-2">
            {previousPerformance.map((set, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 rounded-lg border"
              >
                <span>
                  {set.weight}kg × {set.reps}
                </span>
                <Badge
                  variant="secondary"
                  className={formQualityColors[set.formQuality]}
                >
                  {set.formQuality}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ExerciseLogger;
