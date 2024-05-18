import { useRouteError } from "react-router-dom";
import { Link } from "react-router-dom";

import { GoCloudOffline } from "react-icons/go";
import { MdOutlineRefresh } from "react-icons/md";

const Error = () => {
  const error = useRouteError();
  console.error("From useRouteError", error?.status, error?.data);
  return (
    <div className="flex-[4_4_0] mr-auto border-r border-gray-700 min-h-screen">
      <div className="flex flex-col items-center p-10 justify-center mt-7 text-white">
        <GoCloudOffline className="text-8xl" />
        <h1 className="text-center text-xl font-bold mt-2">
          Something went wrong, but don’t fret — it’s not your fault.
        </h1>
        <Link to="/">
          <button className="btn font-bold rounded-full mt-5 border-transparent bg-blue-500 hover:bg-blue-500">
            <MdOutlineRefresh className="text-2xl" />
            <span className="text-lg">Retry</span>
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Error;
