import { isRouteErrorResponse, useRouteError } from "react-router-dom";

const RouteErrorBoundary = () => {
  const error = useRouteError();

  let message = "Please refresh the page or try again in a moment.";

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      message = "We could not find that page.";
    } else if (error.status === 401) {
      message = "Please sign in again.";
    }
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
