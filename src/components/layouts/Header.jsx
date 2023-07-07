import React, { useEffect, useState } from "react";
import Logo from "../../../public/icons/Logo-48.png";
import RefreshIcon from "../icons/refresh-icon";
import SettingsIcon from "../icons/settings-icon";

const Header = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const openSettingsPage = () => {
    chrome.runtime.openOptionsPage();
  };

  useEffect(() => {
    if (isRefreshing) {
      const timeoutId = setTimeout(() => {
        setIsRefreshing(false);
      }, 2000);

      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [isRefreshing]);

  const refreshTab = () => {
    setIsRefreshing(true);
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.reload(tabs[0].id);
    });
  };
  return (
    <header className="w-full flex items-center justify-between px-2">
      <div className="flex items-center justify-center space-x-1">
        <span
          className="w-[1.7rem] aspect-square "
          style={{
            background: `url(${Logo.src}) center center/contain no-repeat`,
          }}
        ></span>
        <span className="text-center font-bold text-[#2d2964] font-sans text-[1.3rem]">
          BlockBait
        </span>
      </div>
      <div className="flex items-center justify-center space-x-4">
        <button onClick={refreshTab} className="w-[0.8rem] aspect-square ">
          <RefreshIcon isRefreshing={isRefreshing} />
        </button>
        <button
          onClick={openSettingsPage}
          className="w-[0.8rem] aspect-square "
        >
          <SettingsIcon />
        </button>
      </div>
    </header>
  );
};
export default Header;
