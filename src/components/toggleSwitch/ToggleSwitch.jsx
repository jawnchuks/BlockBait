import React, { useState } from "react";

const ToggleSwitch = ({ enabled, handleToggle }) => {
  return (
    <div className="relative flex flex-col items-center justify-center select-none">
      <div className="flex">
        <label className="inline-flex relative items-center mr-5 cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer focus:outline-none"
            checked={enabled}
            readOnly
          />
          <div
            onClick={handleToggle}
            className="w-8 h-4 bg-black/30 shadow-2xl rounded-full peer  peer-focus:ring-[#4E46B4] peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:-top-0.5 after:left-[-2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#4E46B4]"
          ></div>
          {/* <span className="ml-6 text-sm font-medium text-gray-900">
            {enabled ? "Activated" : "Deactivated"}
          </span> */}
        </label>
      </div>
    </div>
  );
};

export default ToggleSwitch;
