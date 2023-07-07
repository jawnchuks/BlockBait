/*global chrome*/

import React, { useEffect, useState } from "react";

function History({ history, setHistory }) {
  useEffect(() => {
    const fetchHistory = () => {
      chrome.history.search({ text: "", maxResults: 15 }, (results) => {
        const visitedSites = results.map((result) => ({
          date: new Date(result.lastVisitTime).toLocaleString(),
          url: result.url,
          status: "Visited",
        }));
        setHistory(visitedSites);
        chrome.storage.sync.set({ visitedSites });
      });
    };

    fetchHistory();
  }, []);

  return (
    <table className="min-w-full bg-white border border-gray-300">
      <thead>
        <tr className="text-left bg-[#4E46B4] text-white text-[1rem]">
          <th className="px-4 py-3 border-b">Date</th>
          <th className="px-4 py-3 border-b">URL</th>
          <th className="px-4 py-3 border-b">Status</th>
        </tr>
      </thead>
      {history.length <= 0 ? (
        <tbody className="w-full text-center text-[1rem] flex items-center justify-center h-24">
          No data
        </tbody>
      ) : (
        <tbody className="text-[0.8rem]">
          {history.map((item, index) => (
            <tr key={index}>
              <td className="px-4 py-3 border-b">{item.date}</td>
              <td className="px-4 py-3 border-b max-w-md truncate">
                <a href={item.url} className="text-blue-500 hover:underline">
                  {item.url}
                </a>
              </td>
              <td className="px-4 py-3 border-b">{item.status}</td>
            </tr>
          ))}
        </tbody>
      )}
    </table>
  );
}

export default History;
