import { isRouteErrorResponse, useRouteError } from "react-router-dom";

const RouteErrorBoundary = () => {
  const error = useRouteError();

  let message = "An unexpected error occurred.";

  if (isRouteErrorResponse(error)) {
    message = error.statusText;
  } else if (error instanceof Error) {
    message = error.message;
  }

  return (
    <div className="p-10 text-center">
      <h1 className="text-3xl font-bold text-red-600">
        Something went wrong!
      </h1>
      <p className="mt-4 text-gray-700">{message}</p>
    </div>
  );
};

export default RouteErrorBoundary;
