import { useEffect } from "react";
import {
  RouterProvider,
  createBrowserRouter,
  Outlet,
  useLocation,
} from "react-router-dom";

import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import Notification from "./pages/Notification";
import Profile from "./pages/Profile";
import Error from "./pages/Error";

import Sidebar from "./components/common/Sidebar";
import RightPanel from "./components/common/RightPanel";

const Layout = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const projectName = "X Clone";

  const getPage = () => {
    if (currentPath === "/") return "home";
    else if (currentPath === "/signup") return "signup";
    else if (currentPath === "/login") return "login";
    else if (currentPath === "/notifications") return "notifications";
    else if (currentPath.startsWith("/profile/")) return "profile";
  };

  const page = getPage();

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  useEffect(() => {
    let newTitle =
      page === "profile"
        ? `${capitalizeFirstLetter(
            currentPath.substring("/profile/".length)
          )}'s Profile`
        : capitalizeFirstLetter(page);
    document.title = newTitle + ` / ${projectName}`;
  }, [currentPath]);

  return (
    <div className="flex max-w-6xl mx-auto">
      <Sidebar pageTitle={page} />
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
