import Glide from "@glidejs/glide";
import { FC, useEffect, useId, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import Heading from "../components/Heading/Heading";
import { Product } from "../data/data";
import { fetchNewArrivalsProducts, fetchTopSellingProducts } from "../features/product/productSlice";
import { AppDispatch, RootState } from "../store";
import ProductCard from "./ProductCard";

export interface SectionSliderProductCardProps {
  className?: string;
  itemClassName?: string;
  heading?: string;
  headingFontClassName?: string;
  headingClassName?: string;
  subHeading?: string;
  data?: Product[];
}

const SectionSliderProductCard: FC<SectionSliderProductCardProps> = ({
  className = "",
  itemClassName = "",
  headingFontClassName,
  headingClassName,
  heading,
  subHeading = "REY backpacks & bags",
}) => {
  const sliderRef = useRef(null);
  const id = useId();
  const UNIQUE_CLASS = "glidejs" + id.replace(/:/g, "_");

  const dispatch: AppDispatch = useDispatch();
  const { productTopSelling, productArrivals } = useSelector((state: RootState) => state.products)
  useEffect(() => {
    dispatch(fetchTopSellingProducts());
  

  }, [dispatch,]);
  useEffect(() => {
    dispatch(fetchNewArrivalsProducts());
  }, [dispatch,]);
 
  useEffect(() => {
    if (!sliderRef.current) {
      return () => { };
    }

    // @ts-ignore
    const OPTIONS: Glide.Options = {
      perView: 4,
      gap: 32,
      bound: true,
      breakpoints: {
        1280: {
          perView: 4 - 1,
        },
        1024: {
          gap: 20,
          perView: 4 - 1,
        },
        768: {
          gap: 20,
          perView: 4 - 2,
        },
        640: {
          gap: 20,
          perView: 1.5,
        },
        500: {
          gap: 20,
          perView: 1.3,
        },
      },
    };

    let slider = new Glide(`.${UNIQUE_CLASS}`, OPTIONS);
    slider.mount();
    return () => {
      slider.destroy();
    };
  }, [sliderRef, UNIQUE_CLASS]);


  return (
    <div className={`nc-SectionSliderProductCard ${className}`}>
      <div className={`${UNIQUE_CLASS} flow-root`} ref={sliderRef}>
        <Heading
          className={headingClassName}
          fontClass={headingFontClassName}
          rightDescText={subHeading}
          hasNextPrev
        >
          {heading || `New Arrivals`}
        </Heading>
        <div className="glide__track" data-glide-el="track">
          <ul className="glide__slides">
            {
              !heading ? productTopSelling 
                .map((item, index) => (
                  <li key={index} className={`glide__slide ${itemClassName}`}>
                    <ProductCard product={item} />
                  </li>
                )) : productArrivals  
                  .map((item, index) => (
                    <li key={index} className={`glide__slide ${itemClassName}`}>
                      <ProductCard product={item} />
                    </li>
                  ))
            }
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SectionSliderProductCard;
