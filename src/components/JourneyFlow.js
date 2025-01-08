import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "./Card/Card";
import { Button } from "./Button/Button";
import { Slider } from "./Slider/Slider";
import { Input } from "./Input/Input"; // If Input is used in your code

const JourneyFlow = () => {
  const [step, setStep] = useState(0);
  const [goal, setGoal] = useState(""); // Ensure a default value exists
  const [targetDate, setTargetDate] = useState(""); // Ensure a default value exists
  const [currentPosition, setCurrentPosition] = useState(0);
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  const steps = [
    // Step 1: Set Goal
    <Card key="goal">
      <CardHeader>
        <CardTitle>Set Your Goal</CardTitle>
      </CardHeader>
      <CardContent>
        <Input
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          placeholder="Describe your goal..."
          className="w-full"
        />
      </CardContent>
    </Card>,

    // Step 2: Set Target Date
    <Card key="target-date">
      <CardHeader>
        <CardTitle>Set Your Target Date</CardTitle>
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
              className={index === currentPosition ? "text-blue-600 font-bold" : ""}
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
