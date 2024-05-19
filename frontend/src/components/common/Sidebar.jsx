import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { GoHome } from "react-icons/go";
import { GoHomeFill } from "react-icons/go";
import { GoBell } from "react-icons/go";
import { GoBellFill } from "react-icons/go";
import { GoPerson } from "react-icons/go";
import { GoPersonFill } from "react-icons/go";

import { GoKebabHorizontal } from "react-icons/go";

import XSvg from "../svgs/X";
import apiService from "../../utils/apiService";

const Sidebar = (props) => {
  const selectedPage = props.pageTitle;

  const queryClient = useQueryClient();

  const { mutate: logout } = useMutation({
    mutationFn: async () => {
      try {
        const response = await apiService("post", "/api/auth/logout");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Something went wrong");
        }
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
    onSuccess: () => {
      toast.success("Log out successful");
      queryClient.invalidateQueries(["authUser"]);
    },
    onError: () => {
      toast.error("Logout failed");
    },
  });
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

  return (
    <div className="md:flex-[2_2_0] w-20 max-w-52">
      <div className="sticky top-0 left-0 h-screen flex flex-col border-r border-gray-700 w-20 md:w-full">
        <Link to="/" className="flex justify-center md:justify-start">
          <XSvg className="mr-2 mt-2 p-2 w-12 h-12 rounded-full fill-white hover:bg-stone-900" />
        </Link>
        <ul className="flex flex-col gap-3 mt-4">
          <li className="flex justify-center md:justify-start">
            <Link
              to="/"
              className="flex gap-3 items-center hover:bg-stone-900 transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer"
            >
              {selectedPage === "home" ? (
                <GoHomeFill className="w-8 h-8" />
              ) : (
                <GoHome className="w-8 h-8" />
              )}
              <div
                className={
                  "text-lg hidden md:block " +
                  (selectedPage === "home" ? "font-bold" : "")
                }
              >
                Home
              </div>
            </Link>
          </li>
          <li className="flex justify-center md:justify-start">
            <Link
              to="/notifications"
              className="flex gap-3 items-center hover:bg-stone-900 transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer"
            >
              {selectedPage === "notifications" ? (
                <GoBellFill className="w-6 h-6" />
              ) : (
                <GoBell className="w-6 h-6" />
              )}
              <div
                className={
                  "text-lg hidden md:block " +
                  (selectedPage === "notifications" ? "font-bold" : "")
                }
              >
                Notifications
              </div>
            </Link>
          </li>
          <li className="flex justify-center md:justify-start">
            <Link
              to={`/profile/${authUser?.username}`}
              className="flex gap-3 items-center hover:bg-stone-900 transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer"
            >
              {selectedPage === "profile" ? (
                <GoPersonFill className="w-6 h-6" />
              ) : (
                <GoPerson className="w-6 h-6" />
              )}
              <div
                className={
                  "text-lg hidden md:block " +
                  (selectedPage === "profile" ? "font-bold" : "")
                }
              >
                Profile
              </div>
            </Link>
          </li>
        </ul>
        {authUser && (
          <div className="dropdown dropdown-top mt-auto mb-10">
            <div
              tabIndex={0}
              role="button"
              className=" flex items-center gap-2 transition-all duration-300 hover:bg-stone-900 py-2 px-4 rounded-full"
            >
              <div className="avatar hidden md:inline-flex">
                <div className="w-8 rounded-full">
                  <img
                    src={authUser?.profileImg || "/avatar-placeholder.png"}
                  />
                </div>
              </div>
              <div className="flex items-center justify-between flex-1">
                <div className="ml-2 hidden md:block">
                  <p className="text-white font-bold text-sm w-20 truncate">
                    {authUser?.fullName}
                  </p>
                  <p className="text-gray-500 text-sm">@{authUser?.username}</p>
                </div>
                <GoKebabHorizontal className="w-5 h-5 mr-1" />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content z-[100] mb-2 border border-white rounded-3xl menu p-2 text-center shadow bg-base-100 w-52"
            >
              <li>
                <Link to={"/login"} className="hover:bg-stone-900 rounded-xl">
                  Add an existing account
                </Link>
              </li>
              <li>
                <div
                  to={"/login"}
                  className="hover:bg-stone-900 rounded-xl"
                  onClick={() => {
                    logout();
                  }}
                >
                  Log out @{authUser?.username}
                </div>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
export default Sidebar;
