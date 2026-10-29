import { RouterProvider } from "react-router";
import { router } from "./routes";
import { SQCProvider } from "./context/SQCContext";
import { Toaster } from "./components/ui/sonner";

export default function App() {
  return (
    <SQCProvider>
      <RouterProvider router={router} />
      <Toaster />
    </SQCProvider>
  );
}
