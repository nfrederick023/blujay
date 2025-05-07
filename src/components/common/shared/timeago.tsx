import { default as ReactTimeAgo } from "react-timeago";
import React, { FC } from "react";
import dynamic from "next/dynamic";

const TimeAgo: FC<ReactTimeAgo.ReactTimeagoProps> = (props) => {
  return <ReactTimeAgo {...props}></ReactTimeAgo>;
};

export default dynamic(() => Promise.resolve(TimeAgo), {
  ssr: false,
});
