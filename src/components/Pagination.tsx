import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";

import Popup from "reactjs-popup";
import React from "react";
import range from "lodash/range";
import styled from "styled-components";

const PaginationBar = styled.div`
  margin: 10px 0px;
  margin-bottom: 10px;
  border-radius: 2px;

  .is-current{
    background-color: #3273dc !important;
  }
`;

const SubmenuButton = styled.div`
  cursor: pointer;
  box-sizing: border-box;
  padding: 3px 5px;
  opacity: 0.5;
`;

const ClickableTag = styled.span`
  cursor: pointer;
`;

export interface PaginationProps {
  totalPages: number,
  currentPage: number,
  videosPerPage: number,
  showFavoritesButton: boolean,
  isOnlyFavorites?: boolean,
  totalVideos: number,
  showLabel: boolean,
  onChangePage: (newPageNumber: number) => void,
  setIsOnlyFavorite?: Dispatch<SetStateAction<boolean>>,
  onChangeVideosPerPage: (newVideosPerPage: number) => void
}

const Pagination: FC<PaginationProps> = ({ totalPages, currentPage, showFavoritesButton, isOnlyFavorites, videosPerPage, setIsOnlyFavorite, onChangePage, onChangeVideosPerPage, showLabel }) => {

  const [videosPerPageDisplay, setvideosPerPageDisplay] = useState(videosPerPage);
  let showAsModal = false;

  useEffect(() => {
    if (!videosPerPage) {
      setvideosPerPageDisplay(0);
    } else {
      setvideosPerPageDisplay(videosPerPage);
    }
    showAsModal = window.innerWidth < 768;
  }, [videosPerPage]);

  const onFirstPage = currentPage === 0;
  const onLastPage = currentPage === totalPages - 1;

  const changeVideosPerPage = (newNumber: number): void => {
    onChangeVideosPerPage && onChangeVideosPerPage(newNumber);
  };

  return (
    <div className="field">
      {showLabel && <label className="label">Page</label>}

      <PaginationBar>
        <nav className="pagination is-small">
          <ul className="pagination-list">
            {range(0, totalPages).map((i) => (
              <li key={i}>
                <a
                  className={
                    "pagination-link" + (currentPage === i ? " is-current" : "")
                  }
                  onTouchStart={(): void => {
                    if (i !== currentPage) {
                      onChangePage(i);
                    }
                  }}
                  onMouseDown={(e): void => {
                    e.preventDefault(); // Prevents grabbing focus

                    if (i !== currentPage) {
                      onChangePage(i);
                    }
                  }}
                >
                  {i + 1}
                </a>
              </li>
            ))}

            <li suppressHydrationWarning={true} /*eslint-disable-next-line no-undef*/>
              {process.browser && <Popup // deprecated but I can't be bothered to fix this
                trigger={
                  <SubmenuButton >
                    <span className="icon">
                      <i className="fas fa-cog"></i>
                    </span>
                  </SubmenuButton>
                }
                overlayStyle={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
                // On screens narrower than 768, show the settings popup as a
                // modal rather than a dropdown menu
                modal={showAsModal}
                repositionOnResize
                keepTooltipInside="body"
              >

                <div className="dropdown-content">
                  <div className="dropdown-item">Videos per page:</div>
                  <div className="dropdown-item">
                    <input
                      className="input is-small"
                      type="number"
                      value={videosPerPageDisplay}
                      onChange={(event): void =>
                        changeVideosPerPage(Number(event.target.value))
                      }
                    />
                  </div>
                  <div className="dropdown-item">
                    <div className="tags" style={{ flexWrap: "nowrap" }}>
                      <ClickableTag
                        className="tag is-info"
                        onClick={(): void => changeVideosPerPage(20)}
                      >
                        20
                      </ClickableTag>
                      <ClickableTag
                        className="tag is-info"
                        onClick={(): void => changeVideosPerPage(40)}
                      >
                        40
                      </ClickableTag>
                      <ClickableTag
                        className="tag is-primary"
                        onClick={(): void => changeVideosPerPage(80)}
                      >
                        80
                      </ClickableTag>
                      <ClickableTag
                        className="tag is-warning"
                        onClick={(): void => changeVideosPerPage(150)}
                      >
                        150
                      </ClickableTag>
                      <ClickableTag
                        className="tag is-danger"
                        onClick={(): void => changeVideosPerPage(300)}
                      >
                        300
                      </ClickableTag>
                    </div>
                  </div>
                </div>
              </Popup>}
            </li>
          </ul>

          {showFavoritesButton ?
            <a
              className={isOnlyFavorites ? "pagination-previous pagination-link is-current is-current" : "pagination-previous"}
              onClick={(): void => { if (setIsOnlyFavorite !== undefined) setIsOnlyFavorite(!isOnlyFavorites); }}
              style={{ order: 3, padding: "5px 60px" }}
            >
              {
                isOnlyFavorites ?
                  <span className="icon">
                    Only Show Favorites
                  </span>
                  :
                  <span className="icon">
                    Only Show Favorites
                  </span>
              }

            </a>
            :
            <></>}
          <a
            className="pagination-previous"
            onClick={(): void => {
              if (onFirstPage) return;
              onChangePage(currentPage - 1);
            }}
            style={{ order: 3, padding: "5px 3px" }}
          >
            <span className="icon">
              <i className="fas fa-caret-left"></i>
            </span>
          </a>

          <a
            className="pagination-next"
            onClick={(): void => {
              if (onLastPage) return;

              onChangePage(currentPage + 1);
            }}
            style={{ order: 3, padding: "5px 3px" }}
          >
            <span className="icon">
              <i className="fas fa-caret-right"></i>
            </span>
          </a>
        </nav>
      </PaginationBar>
    </div >
  );
};

export default Pagination;