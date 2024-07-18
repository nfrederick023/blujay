import { DropDownOption, Video } from "@client/utils/types";
import { VideoContext } from "@client/components/common/contexts/video-context";
import DropDownTextField from "@client/components/common/shared/drop-down-text-field";
import Popup from "@client/components/common/shared/popup";
import React, { FC, useContext, useState } from "react";
import RemovableOption from "@client/components/common/shared/removable-option";
import styled from "styled-components";

const PopupContent = styled.div`
  height: 500px;
  width: 700px;
  max-width: 75vw;
  max-height: 75vh;
  display: flex;
  flex-direction: column;
`;

const CategoriesText = styled.div`
  margin-bottom: 5px;
`;

const Divider = styled.div`
  border-top: 1px solid ${(p): string => p.theme.textContrastLight};
  margin: 10px 0px 10px 0px;
`;

const CategoryOptions = styled.div`
  display: flex;
  flex-wrap: wrap;
  overflow-y: auto;
  padding-right: 5px;
`;

interface CategoryPopupProps {
  togglePopup: () => void;
  selectedVideo: Video;
}

const CategoryPopup: FC<CategoryPopupProps> = ({ selectedVideo, togglePopup }) => {
  const [categories, setCategories] = useState(selectedVideo.categories);
  const [newCategory, setNewCategory] = useState("");
  const { videos, updateVideo } = useContext(VideoContext);

  const addCategory = (categoryToAdd: string): void => {
    setCategories([...new Set([...categories, categoryToAdd])]);
  };

  const allCategories = [...new Set(videos.flatMap((video) => video.categories))];

  const dropDownOptions: DropDownOption[] = allCategories.map((category) => ({
    text: category,
    action: (): void => {
      addCategory(category);
    },
  }));

  const removeCategory = (categoryToRemove: string): void => {
    setCategories(categories.filter((category) => category !== categoryToRemove));
  };

  const onEnter = (): void => {
    addCategory(newCategory);
    resetNewCategory();
  };

  const onNewCategoryChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setNewCategory(e.currentTarget.value);
  };

  const resetNewCategory = (): void => {
    setNewCategory("");
  };

  const onClosePopup = (): void => {
    const updatedVideo = { ...selectedVideo, categories };
    updateVideo(updatedVideo);
    togglePopup();
  };

  return (
    <Popup closePopup={onClosePopup}>
      <PopupContent>
        <CategoriesText>Categories:</CategoriesText>
        <DropDownTextField
          options={dropDownOptions}
          onEnter={onEnter}
          onChange={onNewCategoryChange}
          value={newCategory}
        />
        <Divider />
        <CategoryOptions>
          {categories.map((category, i) => (
            <RemovableOption
              key={i}
              optionText={category}
              onRemove={(): void => {
                removeCategory(category);
              }}
            />
          ))}
        </CategoryOptions>
      </PopupContent>
    </Popup>
  );
};

export default CategoryPopup;
