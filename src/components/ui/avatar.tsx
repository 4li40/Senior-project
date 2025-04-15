import * as React from "react";

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children: React.ReactNode;
}

export const Avatar: React.FC<AvatarProps> = ({ className = "", children, ...props }) => (
  <div
    className={`inline-flex items-center justify-center rounded-full bg-gray-200 text-gray-700 font-bold ${className}`}
    style={{ width: 32, height: 32, fontSize: 16 }}
    {...props}
  >
    {children}
  </div>
);

export const AvatarFallback: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span>{children}</span>
);

export default Avatar;
