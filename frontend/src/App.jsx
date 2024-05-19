import { useEffect, useState } from "react"; // Use useState for document title
import {
  RouterProvider,
  createBrowserRouter,
  Outlet,
  useLocation,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";

import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import Notification from "./pages/Notification";
import Profile from "./pages/Profile";
import Error from "./pages/Error";

import Sidebar from "./components/common/Sidebar";
import RightPanel from "./components/common/RightPanel";

import apiService from "./utils/apiService";

const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const getPage = (currentPath) => {
  switch (currentPath) {
    case "/":
      return "home";
    case "/signup":
      return "signup";
    case "/login":
      return "login";
    case "/notifications":
      return "notifications";
    case /^\/profile\/.*$/:
      return "profile";
    default:
      return "";
  }
};

const Layout = ({ authUser }) => {
  const location = useLocation();
  const currentPath = location.pathname;
  const page = getPage(currentPath);

  useEffect(() => {
    let newTitle =
      page === "profile"
        ? `${capitalizeFirstLetter(
            currentPath.substring("/profile/".length)
          )}` + "'s Profile"
        : capitalizeFirstLetter(page);
    document.title = newTitle + " / X Clone";
  }, [currentPath]); // Dependency array for useEffect

  return (
    <div className="flex max-w-6xl mx-auto">
      {authUser && <Sidebar pageTitle={page} />}
      <Outlet />
      {authUser && <RightPanel />}
      <Toaster />
    </div>
  );
};

const requiresAuth = (children, name) => {
  const { data: authUser } = useQuery({
    // we use queryKey to give a unique name to our query and refer to it later
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
        const response = await apiService("get", "/api/auth/me");
        const data = await response.json();
        if (data.message) return null;
        if (!response.ok) {
          throw new Error(data.error || "Something went wrong");
        }
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
  });

  if (["home", "notifications", "profile"].includes(name)) {
    if (!authUser) {
      return <Navigate to="/login" />;
    }
  } else if (["login", "signup".includes(name)]) {
    if (authUser) {
      return <Navigate to="/" />;
    }
  }
  return children;
};

const App = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <Layout
          authUser={
            useQuery({
              queryKey: ["authUser"],
            }).data
          }
        />
      ),
      errorElement: <Error />,
      children: [
        {
          path: "/",
          element: requiresAuth(<Home />, "home"),
        },
        {
          path: "/signup",
          element: requiresAuth(<SignUp />, "signup"),
        },
        {
          path: "/login",
          element: requiresAuth(<Login />, "login"),
        },
        {
          path: "/notifications",
          element: requiresAuth(<Notification />, "notifications"),
        },
        {
          path: "/profile/:username",
          element: requiresAuth(<Profile />, "profile"),
        },
      ],
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
};

export default App;
