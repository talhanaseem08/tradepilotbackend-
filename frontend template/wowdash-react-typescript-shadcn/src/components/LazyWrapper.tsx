import ComponentErrorBoundary from "@/error/ComponentErrorBoundary";
import LoadingSkeleton from "@/loading/LoadingSkeleton";
import { Suspense } from "react";

type Props = {
  children: React.ReactNode;
};

const LazyWrapper = ({ children }: Props) => {
  return (
    <ComponentErrorBoundary>
      <Suspense fallback={<LoadingSkeleton />}>
        {children}
      </Suspense>
    </ComponentErrorBoundary>
  );
};

export default LazyWrapper;
