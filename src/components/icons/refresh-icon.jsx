import React from "react";

const RefreshIcon = ({ isRefreshing }) => {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      className={isRefreshing ? " animate-spin" : " animate-none"}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5.99365 12.1638L2.8918 11.2233C2.64996 11.1499 2.40544 11.3293 2.40276 11.582L2.36832 14.8231"
        stroke="#353535"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M1.35352 8.00001C1.35352 4.23169 4.40834 1.17686 8.17666 1.17686C11.945 1.17686 14.9998 4.23169 14.9998 8.00001C14.9998 11.7683 11.945 14.8232 8.17666 14.8232C5.89299 14.8232 3.87135 13.7012 2.63286 11.9785"
        stroke="#353535"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default RefreshIcon;
