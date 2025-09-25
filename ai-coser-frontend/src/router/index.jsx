import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import App from "../App.jsx";

const Home = lazy(() => import("../pages/Home/Home.jsx"));

export const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      { path: "/", element: <Home /> },
      { path: "*", element: <div style={{ padding: 24 }}>Not Found</div> }
    ]
  }
]);
