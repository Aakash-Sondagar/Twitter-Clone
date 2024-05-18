import { Link } from "react-router-dom";

import { GoGear } from "react-icons/go";
import { GoPersonFill } from "react-icons/go";
import { GoHeartFill } from "react-icons/go";

import LoadingSpinner from "../components/common/LoadingSpinner";

const NotificationPage = () => {
  const isLoading = false;
  const notifications = [
    {
      _id: "1",
      from: {
        _id: "1",
        username: "johndoe",
        profileImg: "/avatars/boy2.png",
      },
      type: "follow",
    },
    {
      _id: "2",
      from: {
        _id: "2",
        username: "janedoe",
        profileImg: "/avatars/girl1.png",
      },
      type: "like",
    },
  ];

  const deleteNotifications = () => {
    alert("All notifications deleted");
  };

  return (
    <div className="flex-[4_4_0] border-l border-r border-gray-700 min-h-screen">
      <div className="flex justify-between items-center p-4 border-b border-gray-700">
        <div className="text-xl font-bold">Notifications</div>
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="m-1">
            <GoGear className="w-6 h-6" />
          </div>
          <ul
            tabIndex={0}
            className="dropdown-content z-[100] border border-white rounded-3xl menu p-2 mt-1 shadow bg-base-100 w-52"
          >
            <li>
              <a
                className="hover:bg-stone-900 rounded-xl text-center"
                onClick={deleteNotifications}
              >
                Delete all notifications
              </a>
            </li>
          </ul>
        </div>
      </div>
      {isLoading && (
        <div className="flex justify-center h-full items-center">
          <LoadingSpinner size="lg" />
        </div>
      )}
      {notifications?.length === 0 && (
        <div className="text-center p-4 font-bold">No notifications 🤔</div>
      )}
      {notifications?.map((notification) => (
        <div className="border-b border-gray-700" key={notification._id}>
          <div className="flex gap-4 p-4 items-center">
            {notification.type === "follow" && (
              <GoPersonFill className="w-7 h-7 text-primary" />
            )}
            {notification.type === "like" && (
              <GoHeartFill className="w-7 h-7 text-red-600" />
            )}
            <Link
              className="flex items-center"
              to={`/profile/${notification.from.username}`}
            >
              <div className="avatar">
                <div className="w-8 rounded-full">
                  <img
                    src={
                      notification.from.profileImg || "/avatar-placeholder.png"
                    }
                  />
                </div>
              </div>
              <div className="flex gap-1 ml-2">
                <div className="font-bold">@{notification.from.username}</div>{" "}
                {notification.type === "follow"
                  ? "followed you"
                  : "liked your post"}
              </div>
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};
export default NotificationPage;
