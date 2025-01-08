export const Slider = ({ value, min, max, step, onValueChange, className }) => {
  const percentage = ((value[0] - min) / (max - min)) * 100;

  return (
    <div className={`relative w-full ${className}`}>
      <input
        type="range"
        value={value[0]}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onValueChange([parseInt(e.target.value, 10)])}
        className="appearance-none w-full h-2 bg-gradient-to-r from-blue-600 to-gray-300 rounded"
        style={{
          background: `linear-gradient(to right, #2563EB ${percentage}%, #E5E7EB ${percentage}%)`,
        }}
      />
    </div>
  );
};
