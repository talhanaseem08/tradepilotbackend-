import React from "react";

type Props = {
  children: React.ReactNode;
};

type State = {
  hasError: boolean;
};

class ComponentErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("Component error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 text-center">
          <h2 className="text-lg font-semibold text-red-600">
            Failed to load this section
          </h2>
          <p className="text-sm text-muted-foreground mt-2">
            Please refresh the page.
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ComponentErrorBoundary;
