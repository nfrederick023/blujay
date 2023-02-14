/*
 * Index page - shows a list of available videos
 */

import { AuthStatus, LinkTypes, Props, PropsWithAuth, SortTypes, Video } from "../utils/types";
import { FC, MutableRefObject, useEffect, useRef, useState } from "react";
import { NextPageContext, Redirect } from "next";
import { redirectTo401, redirectToLogin } from "../utils/redirects";
import CopyVideoLink, { CopyTextContainer } from "../components/CopyLink";

import { getAuthStatus } from "../backend/auth";
import { getPrivateLibrary, hasUserPassword } from "../backend/config";
import { listVideos } from "../backend/listVideos";
import { toNumber } from "lodash";
import { useCookies } from "react-cookie";
import Container from "../components/Container";
import Pagination from "../components/Pagination";
import React from "react";
import Router from "next/router";
import TimeAgo from "react-timeago";
import debounce from "lodash/debounce";
import prettyBytes from "pretty-bytes";
import styled from "styled-components";

const ClearFilterButton = styled.span`
  cursor: pointer;
  pointer-events: initial !important;
`;

const LinkRow = styled.tr`
  cursor: pointer;

  &:hover {
    background-color: #3273dc;
    color: white;
  }
`;

const RowButtons = styled.div`
  float: right;
  margin: -3px;
  display: flex;
  flex-direction: row;

  * {
    margin-right: 5px;

    &:last-child {
      margin-right: 0px;
    }
  }
`;

const NoVideosPlaceholder = styled.div`
  div {
    min-width: 100%;
    border: 1px solid #dbdbdb;
    text-align: center;
    padding: 50px;
  }

  .is-dark {
    border: 1px solid #363636;
  }
`;

const LinkHeader = styled.th<{ width?: string }>`
  cursor: pointer;
`;

const SmallButton = styled.button`
  width: 30px
`;

interface IndexPageBase extends PropsWithAuth {
  allVideos: Video[];
}

interface IndexPage extends IndexPageBase {
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}

const Index: FC<IndexPage> = ({ authStatus, allVideos, currentPage, setCurrentPage }) => {
  const [filter, setFilter] = useState("");
  const [videos, setVideos] = useState<Video[]>([]);
  const [sort, setSort] = useState(SortTypes.saved);
  const [isAscending, setIsAscending] = useState(true);
  const [isOnlyFavorites, setIsOnlyFavorites] = useState(false);
  const [totalVideoCount, setTotalVideoCount] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [cookies, setCookies] = useCookies(["videosPerPage", "isDarkMode"]);
  const [intialVideoList, setIntialVideoList] = useState(allVideos);
  const filterBox = useRef() as MutableRefObject<HTMLInputElement>;

  // Focus filter box on load
  useEffect(() => {
    updatePage();
  }, [sort, currentPage, filter, isAscending, intialVideoList, cookies, isOnlyFavorites]);

  const updatePage = (): void => {
    const videosPerPage = toNumber(cookies.videosPerPage);
    let sortedVideos;

    // get sorted videos list
    sortedVideos = Object.values(intialVideoList).sort((a, b) => {
      return (a[SortTypes[sort]] as number) - (b[SortTypes[sort]] as number);
    });

    if (isAscending) {
      sortedVideos = sortedVideos.reverse();
    }

    //apply any filters
    if (filter) {
      sortedVideos = sortedVideos.filter((video) => video.name.toLowerCase().includes(filter));
    }

    if (isOnlyFavorites) {
      sortedVideos = sortedVideos.filter(video => video.isFavorite);
    }

    setTotalVideoCount(sortedVideos.length);
    const pageCount = Math.ceil(sortedVideos.length / videosPerPage);

    if (isFinite(pageCount)) {
      setPageCount(pageCount);
    } else {
      setPageCount(1);
    }

    if (currentPage === -1 && pageCount - 1 > 0) {
      setCurrentPage(0);
    }

    if (currentPage === -1 && sortedVideos.length) {
      setCurrentPage(0);
    }

    if (currentPage > pageCount - 1) {
      setCurrentPage(pageCount - 1);
    }

    //apply any pagination
    sortedVideos = sortedVideos.slice(
      currentPage * videosPerPage,
      currentPage * videosPerPage + videosPerPage
    );

    //set pages videos
    setVideos(sortedVideos);
  };

  const changeSort = (newSort: SortTypes): void => {
    if (newSort === sort && isAscending) {
      setIsAscending(false);
    } else {
      setIsAscending(true);
    }

    setSort(newSort);
  };

  const changePage = (pageNumber: number): void => {
    setCurrentPage(pageNumber);
  };

  const debouncedSetFilter = debounce((text) => {
    setFilter(text);
  }, 50);

  const onFilterChange = (searchText: string): void => {
    debouncedSetFilter(searchText);
  };

  const onClearFilterClick = (): void => {
    filterBox.current.value = "";
    setFilter("");
  };

  const handleLinkClick = (videoId: string): void => {
    Router.push(`/watch/${videoId}`);
  };

  const handleChangeVideosPerPage = (newVideosPerPage: number): void => {
    setCookies("videosPerPage", newVideosPerPage < 1 ? 0 : newVideosPerPage, { path: "/", sameSite: "strict", maxAge: 31536000, expires: new Date(new Date().setFullYear(new Date().getFullYear() + 1)) });
  };

  const updateVideoList = (selectedVideo: Video): void => {
    const newVideoList = allVideos.filter((video) => { return video.id !== selectedVideo.id; });
    newVideoList.push(selectedVideo);
    setIntialVideoList(newVideoList);
  };

  return (
    <Container>
      <div className='field'>
        <label className='label'>Search</label>

        <div className='control has-icons-right'>
          <input
            type='text'
            className='input'
            ref={filterBox}
            onChange={(event): void => onFilterChange(event.target.value)}
          />

          <ClearFilterButton
            className='icon is-right'
            onClick={onClearFilterClick}
          >
            <i className='fas fa-times' />
          </ClearFilterButton>
        </div>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={pageCount}
        totalVideos={totalVideoCount}
        showFavoritesButton={true}
        isOnlyFavorites={isOnlyFavorites}
        videosPerPage={toNumber(cookies.videosPerPage)}
        setIsOnlyFavorite={setIsOnlyFavorites}
        onChangePage={(pageNumber): void => changePage(pageNumber)}
        onChangeVideosPerPage={handleChangeVideosPerPage}
        showLabel
      />

      <table
        className='table is-fullwidth is-bordered'
        style={{ marginBottom: 0 }} // Remove bottom margin added by Bulma
      >
        <thead>
          <tr>
            <LinkHeader onClick={(): void => { changeSort(SortTypes.created); }} width='150px'>
              Created
            </LinkHeader>
            <LinkHeader onClick={(): void => { changeSort(SortTypes.saved); }} width='150px'>
              Uploaded
            </LinkHeader>
            <LinkHeader onClick={(): void => { changeSort(SortTypes.size); }} width='100px'>
              Size
            </LinkHeader>
            <LinkHeader onClick={(): void => { changeSort(SortTypes.name); }}>
              Name
            </LinkHeader>
          </tr>
        </thead>

        <tbody>
          {videos.map((video) => (
            <LinkRow
              key={video.fileName}
              onClick={(): void => {
                handleLinkClick(video.id);
              }}
            >
              <td>
                <TimeAgo date={video.created} />
              </td>
              <td>
                <TimeAgo date={video.saved} />
              </td>
              <td>{prettyBytes(video.size)}</td>
              <td>
                {video.name}

                <RowButtons>

                  {authStatus === AuthStatus.authenticated && (
                    // There's no point in showing the "Copy public link"
                    // button if Videoface is not password protected
                    <>
                      {
                        video.requireAuth ?
                          <CopyVideoLink video={video} updateVideoList={updateVideoList} noText={true} linkType={LinkTypes.privateLink} /> :
                          <CopyVideoLink video={video} updateVideoList={updateVideoList} noText={true} linkType={LinkTypes.publicLink} />
                      }
                      {
                        video.isFavorite ?
                          <CopyVideoLink video={video} updateVideoList={updateVideoList} noText={true} linkType={LinkTypes.favoriteLink} /> :
                          <CopyVideoLink video={video} updateVideoList={updateVideoList} noText={true} linkType={LinkTypes.unfavoriteLink} />
                      }
                    </>
                  )}
                  {authStatus === AuthStatus.notAuthenticated && (
                    <>
                      {video.isFavorite && (
                        <SmallButton
                          className={"button is-small"}
                          onClick={(e): void => {
                            e.stopPropagation();
                          }}
                        >
                          <CopyTextContainer> <i className="fas fa-star" ></i></CopyTextContainer>
                        </SmallButton>
                      )}
                    </>
                  )}
                  <CopyVideoLink video={video} noText={true} linkType={LinkTypes.copyLink} />

                </RowButtons>
              </td>
            </LinkRow>
          ))}
        </tbody>
      </table>

      {videos.length === 0 && (
        <NoVideosPlaceholder><div className={cookies.isDarkMode === "true" ? "is-dark" : ""}>No videos Found</div></NoVideosPlaceholder>
      )}

      <Pagination
        showLabel={false}
        currentPage={currentPage}
        totalPages={pageCount}
        showFavoritesButton={false}
        isOnlyFavorites={isOnlyFavorites}
        totalVideos={totalVideoCount}
        videosPerPage={toNumber(cookies.videosPerPage)}
        onChangeVideosPerPage={handleChangeVideosPerPage}
        onChangePage={(newPageNumber): void => setCurrentPage(newPageNumber)}
      />

    </Container>
  );
};

export const getServerSideProps = async (ctx: NextPageContext): Promise<Props<IndexPageBase> | { redirect: Redirect }> => {
  const authStatus = await getAuthStatus(ctx);
  let allVideos = await listVideos();

  if (authStatus === AuthStatus.notAuthenticated) {
    if (getPrivateLibrary())
      if (hasUserPassword()) {
        return redirectToLogin(ctx);
      } else
        return redirectTo401();
    else
      allVideos = allVideos.filter(video => !video.requireAuth);
  }
  return { props: { allVideos, authStatus } };
};

export default Index;
