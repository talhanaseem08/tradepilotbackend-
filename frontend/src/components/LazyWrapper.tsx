import ComponentErrorBoundary from "@/error/ComponentErrorBoundary";
import LoadingSkeleton from "@/loading/LoadingSkeleton";
import { Suspense } from "react";

type Props = {
  children: React.ReactNode;
  fallback?: React.ReactNode;
};

const LazyWrapper = ({ children, fallback = <LoadingSkeleton /> }: Props) => {
  return (
    <ComponentErrorBoundary>
      <Suspense fallback={fallback}>
        {children}
      </Suspense>
    </ComponentErrorBoundary>
  );
};

export default LazyWrapper;
