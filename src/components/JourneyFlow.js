import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "./Card/Card";
import { Button } from "./Button/Button";
import { Slider } from "./Slider/Slider";
import { Alert, AlertDescription } from "./Alert/Alert";

const JourneyFlow = () => {
  const [step, setStep] = useState(0);
  const [goal, setGoal] = useState(""); // Ensure goal has a default value
  const [currentPosition, setCurrentPosition] = useState(0);
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  const steps = [
    <Card key="goal">
      <CardHeader>
        <CardTitle>Set Your Goal</CardTitle>
      </CardHeader>
      <CardContent>
        <input
          type="text"
          value={goal}
          onChange={(e) => setGoal(e.target.value || "")}
          placeholder="Describe your goal..."
          className="w-full border rounded px-3 py-2"
        />
      </CardContent>
    </Card>,

    <Card key="current-position">
      <CardHeader>
        <CardTitle>Where Are You Now?</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between">
          {alphabet.map((letter, index) => (
            <span key={letter} className={index === currentPosition ? "text-blue-600 font-bold" : ""}>
              {letter}
            </span>
          ))}
        </div>
        <Slider
          value={[currentPosition]}
          min={0}
          max={alphabet.length - 1}
          step={1}
          onValueChange={(value) => setCurrentPosition(value[0] || 0)}
          className="w-full"
        />
      </CardContent>
    </Card>,
  ];

  return (
    <div className="w-full max-w-4xl mx-auto">
      {steps[step]}
      <div className="flex justify-between mt-4">
        <Button variant="outline" onClick={() => setStep(step - 1)} disabled={step === 0}>
          Back
        </Button>
        <Button onClick={() => setStep(step + 1)} disabled={step === steps.length - 1}>
          Continue
        </Button>
      </div>
    </div>
  );
};

export default JourneyFlow;
