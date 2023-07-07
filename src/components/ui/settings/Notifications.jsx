import React, { useEffect, useState } from "react";

const notificationItems = [
  {
    id: 1,
    text: "Educate against malicious sites",
    storageKey: "educateMaliciousSites",
  },
  {
    id: 2,
    text: "Mode",
    storageKey: "mode",
  },
  {
    id: 3,
    text: "Protect against dangerous sites",
    storageKey: "protectDangerousSites",
  },
  {
    id: 4,
    text: "Protect against malicious sites",
    storageKey: "protectMaliciousSites",
  },
  {
    id: 5,
    text: "Educate against dangerous sites",
    storageKey: "educateDangerousSites",
  },
  {
    id: 6,
    text: "Allow redirect against dangerous sites",
    storageKey: "redirectDangerousSites",
  },
  {
    id: 7,
    text: "Allow redirect against malicious sites",
    storageKey: "redirectMaliciousSites",
  },
];

const Toggle = ({ enabled, handleToggle }) => {
  return (
    <div className="relative flex flex-col items-center justify-center select-none">
      <div className="flex items-center justify-center space-x-4">
        <span className="ml-6 text-sm font-medium text-gray-900">
          {enabled ? "Active" : "Standby"}
        </span>
        <label className="inline-flex relative items-center mr-5 cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer focus:outline-none"
            checked={enabled}
            readOnly
          />
          <div
            onClick={handleToggle}
            className="w-8 h-4 bg-black/30 shadow-2xl rounded-full peer  peer-focus:ring-[#4E46B4] peer-checked:after:translate-x-full peer-checked:after:border-black/30 after:content-[''] after:absolute after:-top-0.5 after:left-[-2px] after:bg-white after:border-black/30 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#4E46B4]"
          ></div>
        </label>
      </div>
    </div>
  );
};

export default function Notifications({
  notificationStates,
  setNotificationStates,
}) {
  // const [notificationStates, setNotificationStates] = useState({});

  useEffect(() => {
    // Retrieve the saved toggle values from Chrome storage
    chrome.storage.sync.get("notificationStates", (data) => {
      if (data.notificationStates) {
        setNotificationStates(data.notificationStates);
      } else {
        // Initialize notification states with default values
        const initialStates = notificationItems.reduce(
          (acc, notification) => ({
            ...acc,
            [notification.storageKey]: false,
          }),
          {}
        );
        setNotificationStates(initialStates);
        chrome.storage.sync.set({ notificationStates: initialStates });
      }
    });

    // Retrieve the saved phishScanEnabled value from Chrome storage
    chrome.storage.sync.get("phishingScanEnabled", (data) => {
      if (data.phishingScanEnabled) {
        setNotificationStates((prevStates) => ({
          ...prevStates,
          mode: data.phishingScanEnabled,
        }));
        chrome.storage.sync.set({ notificationStates });
      }
    });
  }, []);

  const handleToggle = (index) => {
    const updatedStates = { ...notificationStates };
    const storageKey = notificationItems[index].storageKey;

    if (storageKey === "mode") {
      // Update the "mode" toggle value
      updatedStates.mode = !updatedStates.mode;

      // Update the "phishScanEnabled" toggle value
      updatedStates.phishingScanEnabled = updatedStates.mode;

      // Save the updated "phishScanEnabled" value to Chrome storage
      chrome.storage.sync.set({ phishingScanEnabled: updatedStates.mode });
    } else {
      // Update other notification toggle values
      updatedStates[storageKey] = !updatedStates[storageKey];
    }

    setNotificationStates(updatedStates);

    // Save the updated toggle values to Chrome storage
    chrome.storage.sync.set({ notificationStates: updatedStates });
  };

  return (
    <div className="min-h-full bg-white border border-gray-300 px-2">
      {notificationItems.map((notification, index) => (
        <div
          key={notification.id}
          className="w-full flex items-center justify-between px-2 border-b border-black/20 my-8 py-2"
        >
          <span className="text-sm">{notification.text}</span>
          <Toggle
            enabled={notificationStates[notification.storageKey]}
            handleToggle={() => handleToggle(index)}
          />
        </div>
      ))}
    </div>
  );
}
