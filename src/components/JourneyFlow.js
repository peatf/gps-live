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
  <input
    type="range"
    value={value[0]}
    min={min}
    max={max}
    step={step}
    onChange={(e) => onValueChange([parseInt(e.target.value, 10)])}
    className={`w-full ${className}`}
  />
);

const JourneyFlow = () => {
  const [step, setStep] = useState(0);
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
    // Step 1: Date Selection
    <div key="date" className="space-y-6">
      <div className="p-4 bg-blue-50 rounded-lg">
        <p className="text-sm">
          I want you to have a date in mind for your goal - not as a deadline or
          a tool to punish yourself, because that does nothing for you. But for
          the sake of honest evaluation.
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

    // Step 2: Current Position
    <div key="current" className="space-y-6">
      <div className="p-4 bg-blue-50 rounded-lg">
        <p className="text-sm">
          Imagine yourself in the now moment like an object on a slider. If
          point A was the first stop on a map moving in the direction of the
          next experience you want to attract and point Z was the last stop,
          which letter would you currently find yourself at?
        </p>
      </div>
      <div className="space-y-4">
        <div className="flex justify-between text-sm text-gray-600">
          {alphabet.map((letter, index) => (
            <span
              key={letter}
              className={`${
                index === currentPosition ? "text-blue-600 font-bold" : ""
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
          className="w-full"
        />
      </div>
    </div>,

    // Step 3: Midpoint Position
    <div key="midpoint" className="space-y-6">
      <div className="p-4 bg-blue-50 rounded-lg">
        <p className="text-sm">
          Using your imagination, on that halfway date ({
            new Date(
              Date.now() + (daysUntilTarget / 2) * 24 * 60 * 60 * 1000
            ).toLocaleDateString()
          }), what letter on the map do you believe you will be at?
        </p>
      </div>
      <div className="space-y-4">
        <div className="flex justify-between text-sm text-gray-600">
          {alphabet.map((letter, index) => (
            <span
              key={letter}
              className={`${
                index === midpointPosition ? "text-green-600 font-bold" : ""
              }`}
            >
              {letter}
            </span>
          ))}
        </div>
        <Slider
          value={[midpointPosition]}
          min={0}
          max={25}
          step={1}
          onValueChange={(value) => setMidpointPosition(value[0])}
          className="w-full"
        />
      </div>
    </div>,
  ];

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {step <= 3 && <Map className="w-5 h-5" />}
            {step === 4 && <Heart className="w-5 h-5" />}
            {step === 5 && <Activity className="w-5 h-5" />}
            <span>
              {step === 0
                ? "Choose Your Timeline"
                : step <= 3
                ? "Map Your Journey"
                : step === 4
                ? "Body Awareness Check"
                : "Alignment Check"}
            </span>
          </div>
          <span className="text-sm text-gray-500">{step + 1} of 6</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {steps[step]}

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
      </CardContent>
    </Card>
  );
};

export default JourneyFlow;
