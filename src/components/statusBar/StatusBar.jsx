import React from "react";
import classNames from "classnames";

const StatusBar = ({ value }) => {
  const status = classNames({
    "bg-green-600": value === "secure",
    "bg-yellow-600": value === "malicious",
    "bg-red-600": value === "unsafe",
    // "bg-blue-600": value === "not active",
  });
  return (
    <div className="flex items-center justify-center h-[9px] w-full bg-black/20 absolute rounded-md py-0.5 px-1">
      <div
        className={`h-1/2 my-auto w-full rounded-md ${
          status ? status : "bg-black/20"
        }`}
      ></div>
    </div>
  );
};

export default StatusBar;
