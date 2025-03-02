import { ArrowSmallRightIcon } from "@heroicons/react/24/outline";
import { FC } from "react";
import rightImg from "../../images/promo3.png";
import Badge from "../../shared/Badge/Badge";
import ButtonCircle from "../../shared/Button/ButtonCircle";
import Input from "../../shared/Input/Input";
import NcImage from "../../shared/NcImage/NcImage";

export interface SectionSubscribe2Props {
  className?: string;
}

const SectionSubscribe2: FC<SectionSubscribe2Props> = ({ className = "" }) => {
  return (
    <div
      className={`nc-SectionSubscribe2 relative flex flex-col lg:flex-row lg:items-center ${className}`}
      data-nc-id="SectionSubscribe2"
    >
      <div className="flex-shrink-0 mb-10 lg:mb-0 lg:mr-10 lg:w-2/5">
        <h2 className="font-semibold text-4xl md:text-5xl">
          Đừng bỏ lỡ những ưu đãi đặc biệt
        </h2>
        <span className="block mt-5 text-neutral-500 dark:text-neutral-400">
          Đăng ký email để nhận miễn phí vận chuyển & combo tiết kiệm...
        </span>
        <ul className="space-y-4 mt-10">
          <li className="flex items-center space-x-4">
            <Badge name="01" />
            <span className="font-medium text-neutral-700 dark:text-neutral-300">
              Nhận thêm giảm giá
            </span>
          </li>
          <li className="flex items-center space-x-4">
            <Badge color="red" name="02" />
            <span className="font-medium text-neutral-700 dark:text-neutral-300">
              Nhận tạp chí cao cấp
            </span>
          </li>
        </ul>
        <form className="mt-10 relative max-w-sm">
          <Input
            required
            aria-required
            placeholder="Nhập email của bạn"
            type="email"
            rounded="rounded-full"
          />
          <ButtonCircle
            type="submit"
            className="absolute transform top-1/2 -translate-y-1/2 right-1"
          >
            <ArrowSmallRightIcon className="w-6 h-6" />
          </ButtonCircle>
        </form>
      </div>
      <div className="flex-grow">
        <NcImage src={rightImg} />
      </div>
    </div>
  );
};

export default SectionSubscribe2;
