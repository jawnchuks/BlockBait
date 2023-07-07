/*global chrome*/

import React, { useEffect, useState } from "react";
import Logo from "../../../public/icons/Logo-48.png";
import ToggleSwitch from "../toggleSwitch/ToggleSwitch";
import MaliciousIcon from "../icons/malicious-icon";
import UnsafeIcon from "../icons/unsafe-icon";
import SecureIcon from "../icons/secure-icon";
import NotActiveIcon from "../icons/not-active-icon";
import StatusBar from "../statusBar/StatusBar";

const Main = () => {
  const [currentTabUrl, setCurrentTabUrl] = useState("");
  const [isPhishingScanEnabled, setPhishingScanEnabled] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [value, setValue] = useState("not active");

  const handleToggle = async () => {
    if (!isPhishingScanEnabled) {
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.reload(tabs[0].id, { bypassCache: true });
      });
      setPhishingScanEnabled(true);
      startSession();
      await chrome.storage.sync.set({ phishingScanEnabled: true });
    } else {
      setPhishingScanEnabled(false);
      endSession();
      await chrome.storage.sync.set({ phishingScanEnabled: false });
    }
  };

  const startSession = async () => {
    const { urlStatus } = await chrome.storage.sync.get("urlStatus");
    // setCurrentTabUrl(urlStatus);
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
      setCurrentTabUrl(tabs[0]?.url || urlStatus);
    });
    const { scanStatus } = await chrome.storage.sync.get("scanStatus");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setValue(scanStatus || "not active");
    }, 2000);
  };

  const endSession = async () => {
    setCurrentTabUrl("");
    await chrome.storage.sync.set({ urlStatus: "" });
    stopPhishScanning();
  };

  const stopPhishScanning = () => {
    setLoading(false);
    setValue("not active");
  };

  useEffect(() => {
    chrome.storage.sync.get("phishingScanEnabled", (result) => {
      if (result.phishingScanEnabled === true) {
        startSession();
        setPhishingScanEnabled(true);
      }
    });
  }, []);

  useEffect(() => {
    chrome.storage.onChanged.addListener((changes) => {
      if (changes.scanStatus) {
        const newScanStatus = changes.scanStatus.newValue;
        setValue(newScanStatus || "not active");
      }
    });
    chrome.storage.onChanged.addListener((changes) => {
      if (changes.urlStatus) {
        const newUrl = changes.urlStatus.newValue;
        setCurrentTabUrl(newUrl);
      }
    });
  }, [isPhishingScanEnabled]);

  return (
    <main className="w-full bg-white h-[300px] pt-[1.6rem] mx-auto flex flex-col items-start shadow-inner rounded-xl relative overflow-hidden p-2">
      <div
        className="absolute inset-0 w-[90%] aspect-square bg-opacity-10 mx-auto my-auto"
        style={{
          background: `url(${Logo.src}) center center/contain no-repeat`,
          opacity: 0.1,
        }}
      ></div>
      <span className="w-full mx-auto text-left font-bold text-black/70 text-[0.8rem] mt-1.5">
        BlockBait helps protect you from phishing and illegal websites, keeping
        you safe online.
      </span>
      <hr className="w-full my-4 border-t-2 border-black/30" />

      <div className="w-[95%] mx-auto flex flex-col items-center justify-center space-y-4 overflow-hidden">
        <div className="grid grid-cols-3 items-center justify-items-start gap-2 w-full">
          <span className="col-span-1 text-black/70 text-[0.8rem] font-semibold">
            {isPhishingScanEnabled ? "Deactivate:" : "Activate:"}
          </span>
          <span className="col-span-2 ">
            <ToggleSwitch
              handleToggle={handleToggle}
              enabled={isPhishingScanEnabled}
            />
          </span>
        </div>
        <div className="grid grid-cols-3 items-center justify-items-start gap-2 w-full">
          <span className="col-span-1 text-black/70 text-[0.8rem] font-semibold">
            This URL:
          </span>
          <span className="col-span-2 w-[95%] truncate text-[#520F00] text-left font-semibold text-[0.7rem]">
            {isLoading && isPhishingScanEnabled
              ? "getting url..."
              : currentTabUrl}
          </span>
        </div>
        <div className="grid grid-cols-3 items-center justify-items-start gap-2 w-full">
          <span className="col-span-1 text-black/70 text-[0.8rem] font-semibold">
            Status:
          </span>
          {isPhishingScanEnabled && isLoading ? (
            <div className="w-6 aspect-square mx-auto my-2 border-4 border-dotted rounded-full animate-spin border-[#4E46B4]"></div>
          ) : (
            <div className="col-span-2 w-3/4 relative flex flex-col items-start justify-center space-y-10">
              <div className="flex items-center justify-center space-x-1">
                <span className="text-left font-semibold text-[0.7rem]">
                  {value}
                </span>
                <span>
                  {value === "malicious" ? (
                    <MaliciousIcon />
                  ) : value === "unsafe" ? (
                    <UnsafeIcon />
                  ) : value === "secure" ? (
                    <SecureIcon />
                  ) : (
                    <NotActiveIcon />
                  )}
                </span>
              </div>
              <StatusBar value={value} />
            </div>
          )}
        </div>
        <div className="grid grid-cols-3 items-center justify-items-start gap-2 w-full">
          <span className="col-span-1 text-black/70 text-[0.8rem] font-semibold"></span>
          <div className="col-span-2 w-3/4 relative flex flex-col items-start justify-center space-y-10">
            <div className="flex items-center justify-center space-x-1">
              <span>
                {value === "malicious" ? (
                  <button
                    type="button"
                    className="bg-none m-0 border-none text-red-500 text-[0.6rem]"
                  >
                    please refresh
                  </button>
                ) : value === "unsafe" ? (
                  <button
                    type="button"
                    className="bg-none m-0 border-none text-red-500 text-[0.6rem]"
                  >
                    please refresh
                  </button>
                ) : (
                  ""
                )}
              </span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Main;
