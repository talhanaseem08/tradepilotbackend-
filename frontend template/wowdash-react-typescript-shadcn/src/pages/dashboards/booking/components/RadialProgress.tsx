import React, { useEffect, useRef } from "react";

interface RadialProgressProps {
  percentage: number;
  color: string;
  icon?: React.ReactNode;
  label?: string;
  size?: number;
  strokeWidth?: number;
  backgroundColor?: string;
}

const RadialProgress: React.FC<RadialProgressProps> = ({
  percentage,
  color,
  icon,
  label,
  size = 120,
  strokeWidth = 8,
  backgroundColor = "#e5e7eb",
}) => {
  const circleRef = useRef<SVGCircleElement>(null);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    if (circleRef.current) {
      const offset = circumference - (percentage / 100) * circumference;
      circleRef.current.style.transition = "stroke-dashoffset 1.25s ease-in-out";
      circleRef.current.style.strokeDashoffset = `${offset}`;
    }
  }, [percentage, circumference]);

  return (
    <div className="text-center">
      <div className="relative inline-block">
        <svg
          className="radial-progress"
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={backgroundColor}
            strokeWidth={strokeWidth}
            fill="none"
          />
          <circle
            ref={circleRef}
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={circumference}
            strokeLinecap="round"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        </svg>

        {icon && (
          <span
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex justify-center items-center"
            style={{
              width: size / 2,
              height: size / 2,
            }}
          >
            {icon}
          </span>
        )}
      </div>

      {label && (
        <div className="mt-2">
          <h5 className="mb-1">{percentage}%</h5>
          <span className="text-neutral-600 dark:text-neutral-300">{label}</span>
        </div>
      )}
    </div>
  );
};

export default RadialProgress;
