import { OrderType, SortType, Video } from "./types";

export const sortVideos = (videos: Video[], sort: SortType, order: OrderType): Video[] => {
  const sortedVideos = [...videos];
  switch (sort) {
    case "Date Updated": {
      sortedVideos.sort((a, b) => b.updated - a.updated);
      break;
    }
    case "Date Uploaded": {
      sortedVideos.sort((a, b) => b.uploaded - a.uploaded);
      break;
    }
    case "File Size": {
      sortedVideos.sort((a, b) => a.size - b.size);
      break;
    }
    case "View Count": {
      sortedVideos.sort((a, b) => b.views - a.views);
      break;
    }
    default: {
      sortedVideos.sort((a, b) => a.name.localeCompare(b.name));
    }
  }

  if (order === "Descending") sortedVideos.reverse();

  return sortedVideos;
};