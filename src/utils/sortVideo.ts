import { OrderType, SortType, Video } from "./types";

export const sortVideos = (videos: Video[], sort: SortType, order: OrderType): Video[] => {
  const sortedVideos = [...videos];
  switch (sort) {
    case "Date Updated": {
      sortedVideos.sort((a, b) => b.saved - a.saved);
      break;
    }
    case "Date Created": {
      sortedVideos.sort((a, b) => b.created - a.created);
      break;
    }
    case "File Size": {
      sortedVideos.sort((a, b) => b.size - a.size);
      break;
    }
    case "View Count": {
      sortedVideos.sort((a, b) => a.id.localeCompare(b.id));
      break;
    }
    default: {
      sortedVideos.sort((a, b) => a.name.localeCompare(b.name));
    }
  }

  if (order === "Descending") sortedVideos.reverse();

  return sortedVideos;
};