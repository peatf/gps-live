import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Map, Heart, Activity } from "lucide-react";

const JourneyFlow = () => {
  const [step, setStep] = useState(0);
  const [goal, setGoal] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [daysUntilTarget, setDaysUntilTarget] = useState(0);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [midpointPosition, setMidpointPosition] = useState(0);
  const [endPosition, setEndPosition] = useState(0);
  const [likertScores, setLikertScores] = useState({
    safety: 3,
    confidence: 3,
    openness: 3,
    deserving: 3,
    belief: 3,
  });

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  useEffect(() => {
    if (targetDate) {
      const days = Math.ceil(
        (new Date(targetDate) - new Date()) / (1000 * 60 * 60 * 24)
      );
      setDaysUntilTarget(days);
    }
  }, [targetDate]);

  const steps = [
    <Card key="goal">
      <CardHeader>
        <CardTitle>Step 1: Define Your Goal</CardTitle>
      </CardHeader>
      <CardContent>
        <Input
          type="text"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          placeholder="What’s your desired goal or outcome?"
          className="w-full px-3 py-2 border rounded"
        />
      </CardContent>
    </Card>,
    <Card key="date">
      <CardHeader>
        <CardTitle>Step 2: Choose Your Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <Input
          type="date"
          value={targetDate}
          onChange={(e) => setTargetDate(e.target.value)}
          className="w-full"
        />
        {targetDate && (
          <div>
            <p>Your goal is {daysUntilTarget} days away.</p>
          </div>
        )}
      </CardContent>
    </Card>,
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
  ];

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {steps[step]}
      <div className="flex justify-between pt-4">
        <Button
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
