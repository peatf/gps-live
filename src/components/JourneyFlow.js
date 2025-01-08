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
  <div className="relative w-full">
    <input
      type="range"
      value={value[0]}
      min={min}
      max={max}
      step={step}
      onChange={(e) => onValueChange([parseInt(e.target.value, 10)])}
      className="appearance-none w-full h-2 bg-gradient-to-r from-blue-600 to-gray-300 rounded"
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
      <input
        type="text"
        value={goal}
        onChange={(e) => setGoal(e.target.value)}
        className="w-full border border-gray-300 rounded px-2 py-1"
      />
    </div>,

    // Step 2: Date Selection
    <div key="date" className="space-y-6">
      <div className="p-4 bg-blue-50 rounded-lg">
        <p className="text-sm">Choose a target date for your goal.</p>
      </div>
      <input
        type="date"
        value={targetDate}
        onChange={(e) => setTargetDate(e.target.value)}
        className="w-full border border-gray-300 rounded px-2 py-1"
      />
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
          Imagine yourself in the now moment like an object on a slider. If
          point A was the first stop on a map moving in the direction of the
          next experience you want to attract and point Z was the last stop,
          which letter would you currently find yourself at?
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
        <p className="text-sm">What letter on the map do you believe you'll be at halfway?</p>
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

    // Step 5: Target Position
    <div key="target" className="space-y-6">
      <div className="p-4 bg-blue-50 rounded-lg">
        <p className="text-sm">What letter do you believe you'll reach on the target date?</p>
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
          What sensations feel closest to what you're experiencing?
        </p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {["Tension", "Warmth", "Lightness", "Heaviness"].map((sensation) => (
          <Button key={sensation} variant="ghost">{sensation}</Button>
        ))}
      </div>
    </div>,

    // Step 7: Alignment Check
    <div key="alignment" className="space-y-6">
      <div className="p-4 bg-blue-50 rounded-lg">
        <p className="text-sm">How true do these statements feel in your body?</p>
      </div>
      {Object.entries(likertScores).map(([key, value]) => (
        <div key={key} className="space-y-2">
          <p className="text-sm">
            {key === "safety" && "I feel safe to receive my goal."}
            {key === "confidence" && "I trust in my capacity to reach this point."}
          </p>
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
    </div>,
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Step {step + 1} of {steps.length}</CardTitle>
      </CardHeader>
      <CardContent>{steps[step]}</CardContent>
      <div className="flex justify-between">
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
    </Card>
  );
};

export default JourneyFlow;
