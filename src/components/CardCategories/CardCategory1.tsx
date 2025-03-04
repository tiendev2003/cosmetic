import { FC } from "react";
import { NavLink } from "react-router";
import { _getImgRd, _getTagNameRd } from "../../contains/fakeData";
import NcImage from "../../shared/NcImage/NcImage";
import { BlogCategoryCount } from "../../types";

export interface CardCategory1Props {
  className?: string;
  blogCategory: BlogCategoryCount;
}

const CardCategory1: FC<CardCategory1Props> = ({
  className = "",
  blogCategory,
}) => {
  return (
    <NavLink
      to={"#"}
      className={`nc-CardCategory1 flex items-center ${className}`}
      data-nc-id="CardCategory1"
    >
      <NcImage
        containerClassName={`flex-shrink-0 ${"w-12 h-12"
          } rounded-lg mr-4 overflow-hidden`}
        src={_getImgRd()}
      />
      <div>
        <h2
          className={` text-base
             nc-card-title text-neutral-900 dark:text-neutral-100 font-semibold`}
        >
          {blogCategory?.name || _getTagNameRd()}
        </h2>
        <span
          className={`${"text-xs"
            } block mt-[2px] text-neutral-500 dark:text-neutral-400`}
        >
          { `${ blogCategory?.blogCount || 0} Bài viết`}
        </span>
      </div>
    </NavLink>
  );
};

export default CardCategory1;
