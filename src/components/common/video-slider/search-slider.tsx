import { VideoContext } from "../contexts/video-context";
import React, { FC, useContext } from "react";
import VideoSlider from "./video-slider";

interface SearchSliderProps {
  search: string;
}

const SearchSlider: FC<SearchSliderProps> = ({ search }: SearchSliderProps) => {
  const { videos } = useContext(VideoContext);
  const searchResults = videos.filter((video) => video.name.toLowerCase().includes(search.toLowerCase()));

  return <VideoSlider videos={searchResults} sliderType={"verticle"} headerText={"Search Results"} search={search} />;
};
export default SearchSlider;
