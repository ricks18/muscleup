import React from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ArrowUp, ArrowDown, Scale, Ruler } from "lucide-react";

interface Measurement {
  date: Date;
  weight: number;
  measurements: {
    chest: number;
    waist: number;
    hips: number;
    biceps: number;
    thighs: number;
  };
}

interface MeasurementsTrackerProps {
  measurements?: Measurement[];
  onSaveMeasurements?: (measurements: Omit<Measurement, "date">) => void;
}

const MeasurementsTracker = ({
  measurements = [
    {
      date: new Date("2024-03-01"),
      weight: 75,
      measurements: {
        chest: 100,
        waist: 80,
        hips: 95,
        biceps: 35,
        thighs: 55,
      },
    },
    {
      date: new Date("2024-03-08"),
      weight: 74.5,
      measurements: {
        chest: 101,
        waist: 79,
        hips: 95,
        biceps: 35.5,
        thighs: 55.5,
      },
    },
  ],
  onSaveMeasurements = () => console.log("Measurements saved"),
}: MeasurementsTrackerProps) => {
  const [weight, setWeight] = React.useState(75);
  const [bodyMeasurements, setBodyMeasurements] = React.useState({
    chest: 100,
    waist: 80,
    hips: 95,
    biceps: 35,
    thighs: 55,
  });

  const handleSave = () => {
    onSaveMeasurements({
      weight,
      measurements: bodyMeasurements,
    });
  };

  const getChange = (current: number, previous: number) => {
    const diff = current - previous;
    if (diff === 0) return null;
    return (
      <span
        className={`text-xs ${diff < 0 ? "text-green-500" : "text-red-500"}`}
      >
        {diff < 0 ? (
          <ArrowDown className="h-3 w-3 inline" />
        ) : (
          <ArrowUp className="h-3 w-3 inline" />
        )}
        {Math.abs(diff).toFixed(1)}
      </span>
    );
  };

  return (
    <Card className="w-full max-w-[800px] p-4 md:p-6 bg-background mx-auto">
      <Tabs defaultValue="input" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="input">Registrar Medidas</TabsTrigger>
          <TabsTrigger value="history">Histórico</TabsTrigger>
        </TabsList>

        <TabsContent value="input" className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Scale className="h-4 w-4" /> Weight (kg)
              </Label>
              <Input
                type="number"
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
                step="0.1"
              />
            </div>

            <div className="space-y-4">
              <Label className="flex items-center gap-2">
                <Ruler className="h-4 w-4" /> Body Measurements (cm)
              </Label>
              {Object.entries(bodyMeasurements).map(([key, value]) => (
                <div key={key} className="flex items-center gap-4">
                  <Label className="w-24 capitalize">{key}</Label>
                  <Input
                    type="number"
                    value={value}
                    onChange={(e) =>
                      setBodyMeasurements((prev) => ({
                        ...prev,
                        [key]: Number(e.target.value),
                      }))
                    }
                    step="0.5"
                  />
                </div>
              ))}
            </div>

            <Button className="w-full" onClick={handleSave}>
              Salvar Medidas
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <div className="space-y-4">
            {measurements.map((measurement, index) => (
              <Card key={index} className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-medium">
                    {measurement.date.toLocaleDateString()}
                  </span>
                  <div className="flex items-center gap-2">
                    <Scale className="h-4 w-4" />
                    {measurement.weight}kg
                    {index < measurements.length - 1 &&
                      getChange(
                        measurement.weight,
                        measurements[index + 1].weight,
                      )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(measurement.measurements).map(
                    ([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="capitalize text-muted-foreground">
                          {key}
                        </span>
                        <div>
                          {value}cm
                          {index < measurements.length - 1 &&
                            getChange(
                              value,
                              measurements[index + 1].measurements[
                                key as keyof typeof bodyMeasurements
                              ],
                            )}
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default MeasurementsTracker;
