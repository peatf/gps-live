export const Alert = ({ children, className }) => (
  <div className={`p-4 rounded-lg border ${className}`}>{children}</div>
);

export const AlertDescription = ({ children }) => (
  <div className="text-sm">{children}</div>
);
