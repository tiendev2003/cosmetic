import { FC } from "react";
import { Link } from "react-router";
import PostCardMeta from "../../components/PostCardMeta/PostCardMeta";
import { _getImgRd, _getTitleRd } from "../../contains/fakeData";
import NcImage from "../../shared/NcImage/NcImage";
import { Blog } from "../../types";

export interface Card13Props {
  className?: string;
  blog: Blog;
}

const Card13: FC<Card13Props> = ({ className = "", blog }) => {
  return (
    <div className={`nc-Card13 relative flex ${className} justify-between`} data-nc-id="Card13">
      <div className="flex flex-col h-full py-2">
        <h2 className={`nc-card-title block font-semibold text-base`}>
          <Link
            to={`/bai-viet/${blog?.id}`}
            className="line-clamp-2 capitalize"
            title={"title"}
          >
            { 
              blog.title || _getTitleRd()
            }
          </Link>
        </h2>
        <span className="hidden sm:block my-3 text-slate-500 dark:text-slate-400 ">
          <span className="line-clamp-2" dangerouslySetInnerHTML={{ __html: `${blog.content.substring(0, 200)
          }` }}
          >

          </span>
        </span>
        <span className="mt-4 block sm:hidden text-sm text-slate-500 ">
          {blog.createdDate ?? "2021-09-01"}
        </span>
        <div className="mt-auto hidden sm:block">
          <PostCardMeta  blog={blog}/>
        </div>
      </div>

      <Link
         to={`/bai-viet/${blog?.id}`}
        className={`block relative h-full flex-shrink-0 w-2/5 sm:w-1/3 ml-3 sm:ml-5`}
      >
        <NcImage
          src={blog.image || _getImgRd()}
          containerClassName="absolute inset-0 "
          className="object-cover w-full h-full rounded-xl sm:rounded-3xl"
        />
      </Link>
    </div>
  );
};

export default Card13;
