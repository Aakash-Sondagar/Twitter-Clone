import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { MdEmail } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { MdPassword } from "react-icons/md";
import { MdDriveFileRenameOutline } from "react-icons/md";

import XSvg from "../components/svgs/X";

import apiService from "../utils/apiService";

const SignUp = () => {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    fullName: "",
    password: "",
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const queryClient = useQueryClient();

  // Use Mutation to manipulate the data like Create Update & delete
  const {
    mutate: signupMutation,
    isError,
    isPending,
    error,
  } = useMutation({
    mutationFn: async () => {
      try {
        const response = await apiService("post", "/api/auth/signup", formData);

        const data = await response.json();
        if (!response.ok)
          throw new Error(data?.message || "Failed to create account");
        return data;
      } catch (error) {
        console.error("error", error);
        toast.error(error.message);
        throw error;
      }
    },
    onSuccess: () => {
      toast.success("Account created successfully");
      queryClient.invalidateQueries(["authUser"]);
    },
  });
  // when we need to fetch data
  // useQuery();
  const handelSubmit = (e) => {
    e.preventDefault(); // page won't reload
    signupMutation(formData);
  };

  return (
    <div className="max-w-screen-xl mx-auto h-screen px-10 flex">
      <div className="flex-1 hidden lg:flex items-center justify-center">
        <XSvg className=" lg:w-2/3 fill-white" />
      </div>
      <div className="flex-1 flex flex-col justify-center items-center">
        <form
          className="lg:w-2/3 mx-auto md:mx-20 flex flex-col gap-4"
          onSubmit={handelSubmit}
        >
          <XSvg className="w-24 lg:hidden fill-white" />
          <h1 className="text-4xl font-extrabold text-white">Join X today.</h1>
          <label className="input input-bordered rounded-md flex items-center gap-2">
            <MdEmail className="w-4 h-4 opacity-70" />
            <input
              type="text"
              className="grow"
              placeholder="Email"
              name="email"
              onChange={handleInputChange}
              value={formData.email}
            />
          </label>
          <div className="flex gap-4 flex-wrap">
            <label className="input input-bordered rounded-md flex items-center gap-2 flex-1">
              <FaUser className="w-4 h-4 opacity-70" />
              <input
                type="text"
                className="grow"
                placeholder="UserName"
                name="username"
                onChange={handleInputChange}
                value={formData.username}
              />
            </label>
            <label className="input input-bordered rounded-md flex items-center gap-2 flex-1">
              <MdPassword className="w-4 h-4 opacity-70" />
              <input
                type="text"
                className="grow"
                placeholder="Full Name"
                name="fullName"
                onChange={handleInputChange}
                value={formData.fullName}
              />
            </label>
          </div>
          <label className="input input-bordered rounded-md flex items-center gap-2">
            <MdDriveFileRenameOutline className="w-4 h-4 opacity-70" />
            <input
              type="password"
              className="grow"
              placeholder="Password"
              name="password"
              onChange={handleInputChange}
              value={formData.password}
            />
          </label>
          <button className="btn rounded-full btn-primary text-white">
            {isPending ? "Loading..." : "Sign Up"}
          </button>
          {isError && <p className="text-red-500 mx-auto">{error.message}</p>}
        </form>
        <div className="flex mt-4">
          <p className="text-white text-base">Have an account already?</p>
          <Link to="/Login">
            <button className="ml-1 text-base text-blue-500  hover:text-white hover">
              Log in
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
