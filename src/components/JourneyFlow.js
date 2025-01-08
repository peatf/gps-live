import React, { useState, useEffect } from "react";
import { Map, Heart, Activity } from "lucide-react";

// Replace missing components with styled divs and buttons
const Card = ({ children, className }) => (
  <div className={`p-4 bg-white shadow-md rounded-lg ${className}`}>
    {children}
  </div>
);
const CardHeader = ({ children }) => <div className="mb-4">{children}</div>;
const CardTitle = ({ children }) => (
  <h2 className="text-lg font-bold mb-2">{children}</h2>
);
const CardContent = ({ children, className }) => (
  <div className={`space-y-4 ${className}`}>{children}</div>
);
const Button = ({ children, onClick, variant, disabled }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded ${
      variant === "outline"
        ? "border border-gray-400 text-gray-600"
        : "bg-blue-600 text-white"
    } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
    disabled={disabled}
  >
    {children}
  </button>
);
const Slider = ({ value, min, max, step, onValueChange, className }) => (
  <div className="relative w-full">
    <input
      type="range"
      value={value[0]}
      min={min}
      max={max}
      step={step}
      onChange={(e) => onValueChange([parseInt(e.target.value, 10)])}
      className={`w-full ${className}`}
    />
    <div
      className="absolute top-[-30px] left-1/2 transform -translate-x-1/2 text-blue-600 font-bold"
      style={{
        left: `calc(${((value[0] - min) / (max - min)) * 100}% - 10px)`,
      }}
    >
      {String.fromCharCode(65 + value[0])}
    </div>
  </div>
);

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
    // Step 1: Naming the Goal
    <div key="goal" className="space-y-6">
      <div className="p-4 bg-blue-50 rounded-lg">
        <p className="text-sm">
          What is your goal or desire for your business? Be specific about what
          you want to achieve.
        </p>
      </div>
      <div className="space-y-2">
        <label className="text-sm text-gray-500">Name your goal</label>
        <input
          type="text"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          className="w-full border border-gray-300 rounded px-2 py-1"
        />
      </div>
    </div>,

    // Step 2: Date Selection
    <div key="date" className="space-y-6">
      <div className="p-4 bg-blue-50 rounded-lg">
        <p className="text-sm">
          Choose a date for your goal—not as a deadline, but as a way to track
          your progress.
        </p>
      </div>
      <div className="space-y-2">
        <label className="text-sm text-gray-500">Choose a target date</label>
        <input
          type="date"
          value={targetDate}
          onChange={(e) => setTargetDate(e.target.value)}
          className="w-full border border-gray-300 rounded px-2 py-1"
        />
      </div>
      {targetDate && (
        <div className="text-sm text-gray-600">
          This date is {daysUntilTarget} days away. The halfway point would be
          in {Math.ceil(daysUntilTarget / 2)} days.
        </div>
      )}
    </div>,

    // Step 3: Current Position
    <div key="current" className="space-y-6">
      <div className="p-4 bg-blue-50 rounded-lg">
        <p className="text-sm">
          Imagine yourself on a slider. If point A is where you start and point
          Z is your goal, where are you now?
        </p>
      </div>
      <Slider
        value={[currentPosition]}
        min={0}
        max={25}
        step={1}
        onValueChange={(value) => setCurrentPosition(value[0])}
        className="w-full"
      />
    </div>,

    // Step 4: Midpoint Position
    <div key="midpoint" className="space-y-6">
      <div className="p-4 bg-blue-50 rounded-lg">
        <p className="text-sm">
          On your halfway date, where do you believe you will be on the slider?
        </p>
      </div>
      <Slider
        value={[midpointPosition]}
        min={0}
        max={25}
        step={1}
        onValueChange={(value) => setMidpointPosition(value[0])}
        className="w-full"
      />
    </div>,

    // Step 5: End Position
    <div key="end" className="space-y-6">
      <div className="p-4 bg-blue-50 rounded-lg">
        <p className="text-sm">
          Where do you believe you will be on the target date?
        </p>
      </div>
      <Slider
        value={[endPosition]}
        min={0}
        max={25}
        step={1}
        onValueChange={(value) => setEndPosition(value[0])}
        className="w-full"
      />
    </div>,

    // Step 6: Somatic Check
    <div key="somatic" className="space-y-6">
      <div className="p-4 bg-blue-50 rounded-lg">
        <p className="text-sm">
          How does the journey from {alphabet[currentPosition]} to{" "}
          {alphabet[endPosition]} feel in your body?
        </p>
      </div>
    </div>,

    // Step 7: Alignment Check
    <div key="alignment" className="space-y-6">
      <div className="p-4 bg-blue-50 rounded-lg">
        <p className="text-sm">How aligned do you feel with this journey?</p>
      </div>
    </div>,
  ];

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Map className="w-5 h-5" />
            <span>Step {step + 1} of 7</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>{steps[step]}</CardContent>
      <div className="flex justify-between pt-4">
        <Button
          variant="outline"
          onClick={() => setStep(Math.max(0, step - 1))}
          disabled={step === 0}
        >
          Back
        </Button>
        <Button
          onClick={() => setStep(Math.min(steps.length - 1, step + 1))}
          disabled={step === steps.length - 1}
        >
          Continue
        </Button>
      </div>
    </Card>
  );
};

export default JourneyFlow;
