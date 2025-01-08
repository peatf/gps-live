export const Button = ({ children, variant, onClick, disabled, className }) => {
  const baseStyles =
    "px-4 py-2 rounded font-medium text-white transition duration-150";
  const variantStyles =
    variant === "outline"
      ? "bg-transparent border border-blue-600 text-blue-600 hover:bg-blue-50"
      : "bg-blue-600 hover:bg-blue-700";

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles} ${className}`}
    >
      {children}
    </button>
  );
};
