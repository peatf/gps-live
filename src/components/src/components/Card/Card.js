export const Card = ({ children, className }) => (
  <div className={`p-4 bg-white shadow-md rounded-lg ${className}`}>
    {children}
  </div>
);

export const CardHeader = ({ children }) => <div className="mb-4">{children}</div>;

export const CardTitle = ({ children }) => (
  <h2 className="text-lg font-bold mb-2">{children}</h2>
);

export const CardContent = ({ children, className }) => (
  <div className={`space-y-4 ${className}`}>{children}</div>
);
