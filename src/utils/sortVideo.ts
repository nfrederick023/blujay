import { OrderType, SortType, Video } from "./types";

export const sortVideos = (videos: Video[], sort: SortType, order: OrderType): Video[] => {
  const sortedVideos = [...videos];

  const sortByField = (fieldName: "updated" | "uploaded" | "size" | "views" | "name"): void => {
    sortedVideos.sort((a, b) => {

      let comparison = 0;

      const fieldA = a[fieldName];
      const fieldB = b[fieldName];
      if (typeof fieldA === "string" && typeof fieldB === "string") {
        comparison = fieldA.localeCompare(fieldB);
      }
      if (typeof fieldA === "number" && typeof fieldB === "number") {
        comparison = fieldA - fieldB;
      }

      if (comparison) {
        return comparison;
      } else {
        // use the ID for comparison if the sort is not stable (ie the values are equal)
        return a.id.localeCompare(b.id);
      }
    });

  };

  switch (sort) {
    case "Date Updated": {
      sortByField("updated");
      sortedVideos.reverse();
      break;
    }
    case "Date Uploaded": {
      sortByField("uploaded");
      sortedVideos.reverse();
      break;
    }
    case "File Size": {
      sortByField("size");
      break;
    }
    case "View Count": {
      sortByField("views");
      break;
    }
    default: {
      sortByField("name");
    }
  }

  if (order === "Descending") sortedVideos.reverse();

  return sortedVideos;
};

