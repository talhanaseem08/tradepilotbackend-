"use client";

import Image from "next/image";

interface ScreenshotProps {
  srcDark: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
}

export default function Screenshot({
  srcDark,
  alt,
  width,
  height,
  className,
}: ScreenshotProps) {

  return (
    <Image
      src={srcDark}
      alt={alt}
      width={width}
      height={height}
      className={className}
    />
  );
}
