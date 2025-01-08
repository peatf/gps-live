import React, { useState, useEffect } from "react";
import { Map, Heart, Activity } from "lucide-react";

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
      <div className="flex justify-between text-sm text-gray-600">
        {alphabet.map((letter, index) => (
          <span
            key={letter}
            className={`${
              index <= currentPosition ? "text-blue-600 font-bold" : ""
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
    </div>,

    // Step 6: Somatic Check
    <div key="somatic" className="space-y-6">
      <div className="p-4 bg-blue-50 rounded-lg">
        <p className="text-sm">
          Notice in your body: How does the journey from {alphabet[currentPosition]} to{" "}
          {alphabet[endPosition]} feel in your body?
        </p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {["Tension", "Warmth", "Lightness", "Heaviness", "Expansion", "Contraction"].map((sensation) => (
          <Button
            key={sensation}
            variant="ghost"
            className="justify-start"
          >
            + {sensation}
          </Button>
        ))}
      </div>
    </div>,

    // Step 7: Alignment Check
    <div key="alignment" className="space-y-6">
      <div className="p-4 bg-blue-50 rounded-lg">
        <p className="text-sm">How true do these statements feel in your body right now?</p>
      </div>
      <div className="space-y-6">
        {Object.entries(likertScores).map(([key, value]) => (
          <div key={key} className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm">
                {key === "safety" && "I feel safe to receive this experience"}
                {key === "confidence" && "I trust in my capacity to reach this point"}
                {key === "openness" && "I can stay open even if it takes time"}
                {key === "deserving" && "I feel deserving of this experience"}
                {key === "belief" && "I believe this is possible for me"}
              </span>
              <span className="text-sm text-gray-500">{value}/5</span>
            </div>
            <Slider
              value={[value]}
              min={1}
              max={5}
              step={1}
              onValueChange={(newValue) =>
                setLikertScores((prev) => ({ ...prev, [key]: newValue[0] }))
              }
              className="w-full"
            />
          </div>
        ))}
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
                ? "Name Your Goal"
                : step === 1
                ? "Choose Your Timeline"
                : step === 2
                ? "Map Your Journey"
                : step === 3
                ? "Map Your Midpoint"
                : step === 4
                ? "Map Your Target"
                : step === 5
                ? "Body Awareness Check"
                : "Alignment Check"}
            </span>
          </div>
          <span className="text-sm text-gray-500">{step + 1} of 7</span>
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
