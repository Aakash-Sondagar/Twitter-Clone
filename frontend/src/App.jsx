import { RouterProvider, createBrowserRouter, Outlet } from "react-router-dom";

import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import Notification from "./pages/Notification";
import Profile from "./pages/Profile";
import Error from "./pages/Error";

import Sidebar from "./components/common/Sidebar";
import RightPanel from "./components/common/RightPanel";

const Layout = () => {
  return (
    <div className="flex max-w-6xl mx-auto">
      <Sidebar />
      <Outlet />
      <RightPanel />
    </div>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <Error />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/signup",
        element: <SignUp />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/notifications",
        element: <Notification />,
      },
      {
        path: "/profile/:username",
        element: <Profile />,
      },
    ],
  },
]);

const App = () => {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
};

export default App;
