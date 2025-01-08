import React, { useState } from "react";
import { Timer, Heart, Map, Activity, Calendar } from "lucide-react";

const SomaticDashboard = () => {
  const [currentPosition, setCurrentPosition] = useState(0);
  const [targetPosition, setTargetPosition] = useState(13);
  const [breathTimer, setBreathTimer] = useState(0);
  const [activeTab, setActiveTab] = useState("map");
  const [likertScores, setLikertScores] = useState({
    safety: 3,
    confidence: 3,
    openness: 3,
    deserving: 3,
    belief: 3,
    gratitude: 3,
  });

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  const startBreathTimer = () => {
    setBreathTimer(4);
    const interval = setInterval(() => {
      setBreathTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Tabs */}
      <div className="grid grid-cols-4 mb-4">
        {[
          { label: "Proximity Map", icon: <Map />, value: "map" },
          { label: "Body Check", icon: <Heart />, value: "somatic" },
          { label: "Alignment", icon: <Activity />, value: "alignment" },
          { label: "Journal", icon: <Calendar />, value: "journal" },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`p-2 text-sm font-bold ${
              activeTab === tab.value ? "text-blue-600" : "text-gray-500"
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "map" && (
        <div className="p-4 bg-gray-50 border rounded shadow-md">
          <h2 className="text-lg font-bold mb-4">Your Journey Map</h2>
          <div className="space-y-8">
            <div>
              <p className="text-sm text-gray-500 mb-2">Current Position</p>
              <input
                type="range"
                min="0"
                max="25"
                value={currentPosition}
                onChange={(e) => setCurrentPosition(Number(e.target.value))}
                className="w-full"
              />
              <p className="text-sm mt-1">
                Selected: {alphabet[currentPosition]}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-2">Target Position</p>
              <input
                type="range"
                min="0"
                max="25"
                value={targetPosition}
                onChange={(e) => setTargetPosition(Number(e.target.value))}
                className="w-full"
              />
              <p className="text-sm mt-1">
                Selected: {alphabet[targetPosition]}
              </p>
            </div>
            <div className="p-4 bg-gray-100 rounded">
              <p className="text-sm mb-4">
                The distance between your current position (
                {alphabet[currentPosition]}) and target position (
                {alphabet[targetPosition]}) is{" "}
                {Math.abs(targetPosition - currentPosition)} steps. How does
                this gap feel in your body?
              </p>
              <button
                onClick={startBreathTimer}
                className="w-full p-2 bg-blue-600 text-white rounded"
              >
                {breathTimer > 0
                  ? `Take a deep breath... ${breathTimer}`
                  : "Start Body Check"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add similar logic for other tabs */}
    </div>
  );
};

export default SomaticDashboard;
