import ProximityMap from "../components/ProximityMap";

export default function Home() {
  const handleProximitySubmit = (data) => {
    console.log("Proximity Data Submitted:", data);
    // Example output: { current: "D", midpoint: "M", target: "Z" }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-4xl font-bold text-blue-600 mb-8">
        Welcome to GPS LIVE 🌟
      </h1>

      {/* Awareness Dashboard Section */}
      <div className="w-full max-w-lg">
        <ProximityMap onSubmit={handleProximitySubmit} />
      </div>
    </div>
  );
}
