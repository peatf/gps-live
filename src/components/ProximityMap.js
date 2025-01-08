import { useState } from "react";

export default function ProximityMap({ onSubmit }) {
  // Define A-Z range
  const alphabet = Array.from({ length: 26 }, (_, i) =>
    String.fromCharCode(65 + i)
  );

  const [current, setCurrent] = useState("M"); // Default position for A
  const [midpoint, setMidpoint] = useState("Q"); // Default position for B
  const [target, setTarget] = useState("Z"); // Default position for C

  const handleSubmit = () => {
    const data = { current, midpoint, target };
    onSubmit(data); // Pass data to parent or save
  };

  return (
    <div className="p-4 bg-gray-100 border rounded shadow-md retro-style">
      <h2 className="text-lg font-bold mb-4">Proximity Mapping (A-Z)</h2>

      <div className="mb-6">
        <label htmlFor="current" className="block text-sm font-medium mb-1">
          Current Position (A)
        </label>
        <input
          id="current"
          type="range"
          min="0"
          max="25"
          value={alphabet.indexOf(current)}
          onChange={(e) => setCurrent(alphabet[Number(e.target.value)])}
          className="slider"
        />
        <p className="text-sm mt-1">Value: {current}</p>
      </div>

      <div className="mb-6">
        <label htmlFor="midpoint" className="block text-sm font-medium mb-1">
          Midpoint (B)
        </label>
        <input
          id="midpoint"
          type="range"
          min="0"
          max="25"
          value={alphabet.indexOf(midpoint)}
          onChange={(e) => setMidpoint(alphabet[Number(e.target.value)])}
          className="slider"
        />
        <p className="text-sm mt-1">Value: {midpoint}</p>
      </div>

      <div className="mb-6">
        <label htmlFor="target" className="block text-sm font-medium mb-1">
          Target Position (C)
        </label>
        <input
          id="target"
          type="range"
          min="0"
          max="25"
          value={alphabet.indexOf(target)}
          onChange={(e) => setTarget(alphabet[Number(e.target.value)])}
          className="slider"
        />
        <p className="text-sm mt-1">Value: {target}</p>
      </div>

      <button
        onClick={handleSubmit}
        className="px-4 py-2 bg-blue-600 text-white font-bold rounded hover:bg-blue-700"
      >
        Submit
      </button>
    </div>
  );
}
