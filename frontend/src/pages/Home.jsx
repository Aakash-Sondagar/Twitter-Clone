import { useState } from "react";

import { GoSun } from "react-icons/go";
import { GoMoon } from "react-icons/go";

import Posts from "../components/common/Posts";
import CreatePost from "../components/common/CreatePost";

const Home = () => {
  const [feedType, setFeedType] = useState("forYou");

  return (
    <div className="flex-[4_4_0] mr-auto border-r border-gray-700 min-h-screen">
      {/* Header */}
      <div className="flex w-full border-b border-gray-700">
        <div
          className={
            "flex justify-center flex-1 mt-2 p-3 hover:bg-secondary transition duration-300 cursor-pointer relative" +
            (feedType === "forYou" ? " font-bold" : "")
          }
          onClick={() => setFeedType("forYou")}
        >
          For You
          {feedType === "forYou" && (
            <div className="absolute bottom-0 w-10  h-1 rounded-full bg-primary"></div>
          )}
        </div>
        <div
          className={
            "flex justify-center flex-1 mt-2 p-3 hover:bg-secondary transition duration-300 cursor-pointer relative" +
            (feedType === "following" ? " font-bold" : "")
          }
          onClick={() => setFeedType("following")}
        >
          Following
          {feedType === "following" && (
            <div className="absolute bottom-0 w-14 h-1 rounded-full bg-primary"></div>
          )}
        </div>
        <div className="p-2 my-auto mt-2 mr-2">
          <label className="swap swap-rotate">
            <input
              type="checkbox"
              className="theme-controller"
              value="synthwave"
            />
            <GoSun className="swap-off fill-current w-6 h-6" />
            <GoMoon className="swap-on fill-current w-6 h-6" />
          </label>
        </div>
      </div>

      {/*  CREATE POST INPUT */}
      <CreatePost />

      {/* POSTS */}
      <Posts />
    </div>
  );
};

export default Home;
