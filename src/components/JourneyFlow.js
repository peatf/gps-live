import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../components/Card/Card";
import { Button } from "../components/Button/Button";
import { Slider } from "../components/Slider/Slider";
import { Input } from "../components/Input/Input";
import { Map, Heart, Activity } from "lucide-react";

const JourneyFlow = () => {
  const [step, setStep] = useState(0);
  const [goal, setGoal] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [currentPosition, setCurrentPosition] = useState(0);
  const [alphabet] = useState("ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""));

  useEffect(() => {
    if (!goal) setStep(0); // Always ensure the goal step is first.
  }, [goal]);

  const steps = [
    // Step 1: Goal Input
    <Card key="goal">
      <CardHeader>
        <CardTitle>Set Your Goal</CardTitle>
      </CardHeader>
      <CardContent>
        <Input
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          placeholder="Enter your goal or desire..."
          className="w-full"
        />
      </CardContent>
    </Card>,

    // Step 2: Timeline
    <Card key="timeline">
      <CardHeader>
        <CardTitle>Set Your Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <Input
          type="date"
          value={targetDate}
          onChange={(e) => setTargetDate(e.target.value)}
          className="w-full"
        />
      </CardContent>
    </Card>,

    // Step 3: Current Position
    <Card key="current-position">
      <CardHeader>
        <CardTitle>Where Are You Now?</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between">
          {alphabet.map((letter, index) => (
            <span
              key={letter}
              className={`${index === currentPosition ? "text-blue-600 font-bold" : ""}`}
            >
              {letter}
            </span>
          ))}
        </div>
        <Slider
          value={[currentPosition]}
          min={0}
          max={alphabet.length - 1}
          step={1}
          onValueChange={(value) => setCurrentPosition(value[0])}
        />
      </CardContent>
    </Card>,
  ];

  return (
    <Card className="w-full max-w-4xl mx-auto">
      {steps[step]}
      <div className="flex justify-between mt-4">
        <Button variant="outline" onClick={() => setStep(step - 1)} disabled={step === 0}>
          Back
        </Button>
        <Button onClick={() => setStep(step + 1)} disabled={step === steps.length - 1}>
          Continue
        </Button>
      </div>
    </Card>
  );
};

export default JourneyFlow;
