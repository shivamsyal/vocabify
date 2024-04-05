import React from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { Disclosure } from "@headlessui/react";
import {
  MdOutlineSpaceDashboard,
  MdOutlineAnalytics,
  MdOutlineIntegrationInstructions,
  MdOutlineMoreHoriz,
  MdOutlineSettings,
  MdOutlineLogout,
  MdOutlineUpload,
  MdContactSupport
} from "react-icons/md";
import { PiCards } from "react-icons/pi";
import { CgProfile } from "react-icons/cg";
import { SiGoogleclassroom } from "react-icons/si";


function SideNavbar() {
  return (
    <div className="p-6 w-1/2 h-screen bg-white z-20 fixed top-0 -left-96 lg:left-0 lg:w-60  peer-focus:left-0 peer:transition ease-out delay-150 duration-200">
      <div className="flex flex-col justify-start item-center">
        <h1 className="text-base text-center cursor-pointer font-bold text-blue-900 border-b border-gray-100 pb-4 w-full">
          Vocabify
        </h1>
        <div className=" my-4 border-b border-gray-100 pb-4">
          <div className="flex mb-2 justify-start items-center gap-4 pl-5 hover:bg-gray-900 p-2 rounded-md group cursor-pointer hover:shadow-lg m-auto">
            <MdOutlineSpaceDashboard className="text-2xl text-gray-600 group-hover:text-white " />
            <h3 className="text-base text-gray-800 group-hover:text-white font-semibold ">
              Overview
            </h3>
          </div>
          <div className="flex  mb-2 justify-start items-center gap-4 pl-5 hover:bg-gray-900 p-2 rounded-md group cursor-pointer hover:shadow-lg m-auto">
            <CgProfile className="text-2xl text-gray-600 group-hover:text-white " />
            <h3 className="text-base text-gray-800 group-hover:text-white font-semibold ">
              Profile
            </h3>
          </div>
          <div className="flex  mb-2 justify-start items-center gap-4 pl-5 hover:bg-gray-900 p-2 rounded-md group cursor-pointer hover:shadow-lg m-auto">
            <MdContactSupport className="text-2xl text-gray-600 group-hover:text-white " />
            <h3 className="text-base text-gray-800 group-hover:text-white font-semibold ">
              Support
            </h3>
          </div>
          <div className="flex  mb-2 justify-start items-center gap-4 pl-5 hover:bg-gray-900 p-2 rounded-md group cursor-pointer hover:shadow-lg m-auto">
            <SiGoogleclassroom className="text-2xl text-gray-600 group-hover:text-white "/>
            <h3 className="text-base text-gray-800 group-hover:text-white font-semibold ">
              Classes
            </h3>
          </div>
          <div className="flex  mb-2 justify-start items-center gap-4 pl-5 hover:bg-gray-900 p-2 rounded-md group cursor-pointer hover:shadow-lg m-auto">
            <PiCards className="text-2xl text-gray-600 group-hover:text-white "/>
            <h3 className="text-base text-gray-800 group-hover:text-white font-semibold ">
              Flashcards
            </h3>
          </div>
          <div className="flex  mb-2 justify-start items-center gap-4 pl-5 hover:bg-gray-900 p-2 rounded-md group cursor-pointer hover:shadow-lg m-auto">
          <MdOutlineUpload className="text-2xl text-gray-600 group-hover:text-white " />
            <h3 className="text-base text-gray-800 group-hover:text-white font-semibold ">
              Upload
            </h3>
          </div>
        </div>
        {/* setting  */}
        <div className=" my-4 border-b border-gray-100 pb-4">
          <div className="flex mb-2 justify-start items-center gap-4 pl-5 hover:bg-gray-900 p-2 rounded-md group cursor-pointer hover:shadow-lg m-auto">
            <MdOutlineSettings className="text-2xl text-gray-600 group-hover:text-white " />
            <h3 className="text-base text-gray-800 group-hover:text-white font-semibold ">
              Settings
            </h3>
          </div>
        </div>
        {/* logout */}
        <div className=" my-4">
          <div className="flex mb-2 justify-start items-center gap-4 pl-5 border border-gray-200  hover:bg-gray-900 p-2 rounded-md group cursor-pointer hover:shadow-lg m-auto">
            <MdOutlineLogout className="text-2xl text-gray-600 group-hover:text-white " />
            <h3 className="text-base text-gray-800 group-hover:text-white font-semibold ">
              Logout
            </h3>
          </div>
        </div>
      </div>
  </div>
  );
}

export default SideNavbar;
