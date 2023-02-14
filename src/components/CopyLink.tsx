import { FC, useEffect, useState } from "react";
import { LinkTypes, Video } from "../utils/types";

import React from "react";
import Tippy from "@tippyjs/react";
import styled from "styled-components";

export const CopyTextContainer = styled.span`
 .favorite {
    width: 100px
 }
 .private {
   width: 80px;
 }
`;

export interface CopyLinkProps {
  updateVideoList?: (video: Video) => void,
  video: Video,
  noText: boolean,
  linkType: LinkTypes
}

const CopyLink: FC<CopyLinkProps> = ({ updateVideoList, video, noText = false, linkType }) => {
  const [linkCopied, setLinkCopied] = useState(false);
  let popupContent = "";
  let hoverContent = "";
  let htmlContent = "";
  let css = "";

  // Hide confirmation message after 1 second
  useEffect(() => {
    const hideMessageTimeout = setTimeout(() => {
      setLinkCopied(false);
    }, 500);

    return (): void => {
      clearTimeout(hideMessageTimeout);
    };
  });

  if (linkType === LinkTypes.publicLink) {
    css = "private";
    popupContent = "Set to Public";
    hoverContent = "Private";
    htmlContent = "Private";

  }

  if (linkType === LinkTypes.privateLink) {
    css = "private";
    popupContent = "Set to Private";
    hoverContent = "Public";
    htmlContent = "Public";
  }

  if (linkType === LinkTypes.copyLink) {
    popupContent = "Link Copied";
    hoverContent = "Copy Link";
    htmlContent = "Copy Link";
  }

  if (linkType === LinkTypes.unfavoriteLink) {
    css = "favorite";
    popupContent = "Removed from Favorites";
    hoverContent = "Favorite";
    htmlContent = "Favorite";
  }

  if (linkType === LinkTypes.favoriteLink) {
    css = "favorite";
    popupContent = "Added to Favorites";
    hoverContent = "Unfavorite";
    htmlContent = "Unfavorite";
  }

  const updateNewVideo = async (newVideo: Video): Promise<void> => {
    if (updateVideoList) {
      const updatedVideo = await updateVideo(newVideo);
      if (updatedVideo.ok) {
        updateVideoList(await updatedVideo.json());
        setLinkCopied(true);
      }
    }
  };

  const onClick = async (): Promise<void> => {
    const videoID = video.id;
    const baseURL = window.location.origin;

    // If we're making a public link, we need to append a single video
    // authentication token
    if (linkType === LinkTypes.publicLink || linkType === LinkTypes.privateLink) {
      video.requireAuth = !video.requireAuth;
      updateNewVideo(video);
    }

    if (linkType === LinkTypes.favoriteLink || linkType === LinkTypes.unfavoriteLink) {
      video.isFavorite = !video.isFavorite;
      updateNewVideo(video);
    }

    if (linkType === LinkTypes.copyLink) {
      try {
        await navigator.clipboard.writeText(baseURL + "/watch/" + videoID);
        setLinkCopied(true);
      } catch (e) {
        alert("Failed to copy link!");
      }
    }

  };

  return (
    <Tippy
      content={popupContent}
      animation="shift-away-subtle"
      arrow={false}
      visible={linkCopied}
    >
      <Tippy
        content={hoverContent}
      >
        <CopyTextContainer >

          <button
            className={(!noText ? css : "") + " button is-small"}
            onClick={(e): void => {
              onClick();
              e.stopPropagation();
            }}
          >

            <span className="icon is-small">
              {linkType === LinkTypes.copyLink && <i className="fas fa-link"></i>}
              {linkType === LinkTypes.privateLink && <i className="fas fa-lock"></i>}
              {linkType === LinkTypes.publicLink && <i className="fas fa-globe"></i>}
              {linkType === LinkTypes.favoriteLink && <i className="fas fa-star"></i>}
              {linkType === LinkTypes.unfavoriteLink && <i className="far fa-star" ></i>}
            </span>
            {!noText && <span >{htmlContent}</span>}
          </button>
        </CopyTextContainer>
      </Tippy>
    </Tippy>
  );
};

const updateVideo = async (video: Video): Promise<Response> => {
  const response = await fetch("/api/videoList", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(video),
  });
  return response;
};

export default CopyLink;