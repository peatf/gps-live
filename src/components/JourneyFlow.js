import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "./Card/Card";
import { Slider } from "./Slider/Slider";
import { Alert, AlertDescription } from "./Alert/Alert";
import { Button } from "./Button/Button";

const JourneyFlow = () => {
  const [step, setStep] = useState(0);
  const [goal, setGoal] = useState("");
  const [journeyScale, setJourneyScale] = useState(100);
  const [currentPosition, setCurrentPosition] = useState(0);
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  const steps = [
    // Step 1: Define Your Goal
    <Card key="goal">
      <CardHeader>
        <CardTitle>Step 1: Define Your Goal</CardTitle>
      </CardHeader>
      <CardContent>
        <input
          type="text"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          placeholder="Describe your goal..."
          className="w-full px-3 py-2 border rounded"
        />
      </CardContent>
    </Card>,

    // Step 2: Adjust Journey Scale
    <Card key="journey">
      <CardHeader>
        <CardTitle>Step 2: Adjust Your Journey Scale</CardTitle>
      </CardHeader>
      <CardContent>
        <Slider
          value={[journeyScale]}
          min={10}
          max={100}
          step={10}
          onValueChange={(value) => setJourneyScale(value[0])}
        />
        {journeyScale < 100 && (
          <Alert className="bg-blue-50 border-blue-200">
            <AlertDescription>
              <p>
                Consider scaling down your journey. Does this adjustment feel
                more achievable in your body?
              </p>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>,

    // Step 3: Where Are You Now?
    <Card key="current">
      <CardHeader>
        <CardTitle>Step 3: Where Are You Now?</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between text-sm">
          {alphabet.map((letter, index) => (
            <span
              key={letter}
              className={`${
                index <= currentPosition
                  ? "text-blue-600 font-bold"
                  : "text-gray-400"
              }`}
            >
              {letter}
            </span>
          ))}
        </div>
        <Slider
          value={[currentPosition]}
          min={0}
          max={25}
          step={1}
          onValueChange={(value) => setCurrentPosition(value[0])}
        />
      </CardContent>
    </Card>,

    // Step 4: Midpoint Position
    <Card key="midpoint">
      <CardHeader>
        <CardTitle>Step 4: Midpoint Position</CardTitle>
      </CardHeader>
      <CardContent>
        <p>
          Imagine where you'll be halfway through your journey. Select the
          letter that represents this position.
        </p>
      </CardContent>
    </Card>,

    // Step 5: Alignment Check
    <Card key="alignment">
      <CardHeader>
        <CardTitle>Step 5: Alignment Check</CardTitle>
      </CardHeader>
      <CardContent>
        <p>How true do these statements feel in your body?</p>
      </CardContent>
    </Card>,
  ];

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {steps[step]}
      <div className="flex justify-between pt-4">
        <Button
          variant="outline"
          onClick={() => setStep(step - 1)}
          disabled={step === 0}
        >
          Back
        </Button>
        <Button
          onClick={() => setStep(step + 1)}
          disabled={step === steps.length - 1}
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default JourneyFlow;
