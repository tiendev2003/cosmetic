import { FC } from "react";
import ProductCard from "../components/ProductCard";
import SectionPromo1 from "../components/SectionPromo1";
import SectionSliderCollections from "../components/SectionSliderLargeProduct";
import { PRODUCTS } from "../data/data";
import SidebarFilters from "./SidebarFilters";

export interface PageCollection2Props {
  className?: string;
}

const PageCollection2: FC<PageCollection2Props> = ({ className = "" }) => {
  return (
    <div
      className={`nc-PageCollection2 ${className}`}
      data-nc-id="PageCollection2"
    >
      <title>Category || fashionFactory Ecommerce Template</title>

      <div className="container py-16 lg:pb-28 lg:pt-20 space-y-16 sm:space-y-20 lg:space-y-28">
        <div className="space-y-10 lg:space-y-14">

          <main>
            {/* LOOP ITEMS */}
            <div className="flex flex-col lg:flex-row">
              <div className="lg:w-1/3 xl:w-1/4 pr-4">
                <SidebarFilters />
              </div>
              <div className="flex-shrink-0 mb-10 lg:mb-0 lg:mx-4 border-t lg:border-t-0"></div>
              <div className="flex-1 ">
                <div className="flex-1 grid sm:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-10 ">
                  {PRODUCTS.map((item, index) => (
                    <ProductCard data={item} key={index} />
                  ))}
                </div>
              </div>
            </div>
          </main>
        </div>

        {/* === SECTION 5 === */}
        <hr className="border-slate-200 dark:border-slate-700" />

        <SectionSliderCollections />
        <hr className="border-slate-200 dark:border-slate-700" />

        {/* SUBCRIBES */}
        <SectionPromo1 />
      </div>
    </div>
  );
};

export default PageCollection2;
