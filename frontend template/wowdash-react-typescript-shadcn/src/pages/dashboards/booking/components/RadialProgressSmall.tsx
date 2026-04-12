import React, { useEffect, useRef } from "react";

interface RadialProgressBarProps {
  percentage: number;
  size?: number; // width/height of SVG
  strokeWidth?: number;
  color?: string;
  bgColor?: string;
  textColor?: string;
}

const RadialProgressBarSmall: React.FC<RadialProgressBarProps> = ({
  percentage,
  size = 80,
  strokeWidth = 6,
  color = "#45b369",
  bgColor = "#ddd",
  textColor = "#333",
}) => {
  const circleRef = useRef<SVGCircleElement>(null);
  const radius = (size / 2) - strokeWidth; // fit inside SVG
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    if (circleRef.current) {
      const offset = circumference - (percentage / 100) * circumference;
      circleRef.current.style.strokeDasharray = `${circumference}`;
      circleRef.current.style.strokeDashoffset = `${offset}`;
      circleRef.current.style.transition = "stroke-dashoffset 1s ease-in-out";
    }
  }, [percentage, circumference]);

  return (
    <svg
      className="radial-progress"
      viewBox={`0 0 ${size} ${size}`}
      width={size}
      height={size}
    >
      {/* Background circle */}
      <circle
        className="incomplete"
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke={bgColor}
        strokeWidth={strokeWidth}
        fill="none"
      />

      {/* Progress circle */}
      <circle
        ref={circleRef}
        className="complete"
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke={color}
        strokeWidth={strokeWidth}
        fill="none"
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />

      {/* Text in center */}
      <text
        className="percentage"
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={size * 0.25}
        fill={textColor}
      >
        {percentage}%
      </text>
    </svg>
  );
};

export default RadialProgressBarSmall;
