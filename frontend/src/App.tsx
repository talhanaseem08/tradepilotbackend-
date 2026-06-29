import { ThemeProvider } from "@/components/theme-provider";
import { RouterProvider } from "react-router-dom";
import { IsSubmittingContextProvider } from "./context/isSubmittingContext";
import { router } from "./routes/AppRoutes";

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <IsSubmittingContextProvider>
        <RouterProvider router={router} />
      </IsSubmittingContextProvider>
    </ThemeProvider>
  );
}

export default App;
