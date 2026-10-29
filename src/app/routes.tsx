import { createBrowserRouter } from "react-router";
import { Landing } from "./screens/Landing";
import { ChartSelection } from "./screens/ChartSelection";
import { DataInput } from "./screens/DataInput";
import { Parameters } from "./screens/Parameters";
import { Results } from "./screens/Results";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Landing,
  },
  {
    path: "/chart-selection",
    Component: ChartSelection,
  },
  {
    path: "/data-input",
    Component: DataInput,
  },
  {
    path: "/parameters",
    Component: Parameters,
  },
  {
    path: "/results",
    Component: Results,
  },
]);
