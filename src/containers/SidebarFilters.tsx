import debounce from "lodash/debounce";
import Slider from "rc-slider";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBrands } from "../features/brand/brandSlice";
import { fetchCategories } from "../features/category/categorySlice";
import { filterProducts } from "../features/product/productSlice";
import Radio from "../shared/Radio/Radio";
import { AppDispatch, RootState } from "../store";
import { Brand, Category } from "../types";

const DATA_sortOrderRadios = [
  { name: "Z-A", id: "z-a" },
  { name: "A-Z", id: "a-z" },
  { name: "Newest", id: "Newest" },
  { name: "Price Low - High", id: "Price-low-high" },
  { name: "Price High - Low", id: "Price-high-low" },
];

const PRICE_RANGE = [10000, 1000000];

const SidebarFilters = () => {
  const [rangePrices, setRangePrices] = useState([100, 10000000]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [sortOrderStates, setSortOrderStates] = useState<string>("");
  const [categorySearch, setCategorySearch] = useState("");
  const [brandSearch, setBrandSearch] = useState("");
  const dispatch: AppDispatch = useDispatch();

  const { categories } = useSelector((state: RootState) => state.categories);
  const { brands } = useSelector((state: RootState) => state.brands);

  useEffect(() => {
    dispatch(fetchCategories({ page: 1, search: "", size: 100 }));
    dispatch(fetchBrands({ page: 1, search: "", size: 100 }));
  }, [dispatch]);

  const handleFilterChange = () => {
    let sortBy: string | undefined = undefined;
    let sortDirection: "asc" | "desc" | undefined = undefined;

    switch (sortOrderStates) {
      case "a-z":
        sortBy = "name";
        sortDirection = "asc";
        break;
      case "z-a":
        sortBy = "name";
        sortDirection = "desc";
        break;
      case "Newest":
        sortBy = "createdAt";
        sortDirection = "desc";
        break;
      case "Price-low-high":
        sortBy = "price";
        sortDirection = "asc";
        break;
      case "Price-high-low":
        sortBy = "price";
        sortDirection = "desc";
        break;
      default:
        break;
    }

    dispatch(
      filterProducts({
        page: 1,
        search: "",
        size: 10,
        minPrice: rangePrices[0],
        maxPrice: rangePrices[1],
        categoryId: selectedCategory ? parseInt(selectedCategory) : undefined,
        brandId: selectedBrand ? parseInt(selectedBrand) : undefined,
        sortBy,
        sortDirection,
      })
    );
  };

  const debouncedHandleFilterChange = useCallback(
    debounce(handleFilterChange, 300),
    [rangePrices, selectedCategory, selectedBrand, sortOrderStates, dispatch]
  );

  useEffect(() => {
    debouncedHandleFilterChange();
    return () => {
      debouncedHandleFilterChange.cancel();
    };
  }, [rangePrices, debouncedHandleFilterChange]);

  useEffect(() => {
    handleFilterChange();
  }, [selectedCategory, selectedBrand, sortOrderStates]);

  const handleChangeCategory = (id: string) => {
    // Nếu id đã được chọn thì bỏ chọn (set về null), nếu không thì chọn id mới
    setSelectedCategory(id === selectedCategory ? null : id);
  };

  const handleChangeBrand = (id: string) => {
    // Nếu id đã được chọn thì bỏ chọn (set về null), nếu không thì chọn id mới
    setSelectedBrand(id === selectedBrand ? null : id);
  };

  const filteredCategories = categories?.filter((item: Category) =>
    item.name.toLowerCase().includes(categorySearch.toLowerCase())
  );

  const filteredBrands = brands?.filter((item: Brand) =>
    item.name.toLowerCase().includes(brandSearch.toLowerCase())
  );

  const renderTabsCategories = () => (
    <div className="relative flex flex-col pb-8 space-y-4">
      <h3 className="font-semibold mb-2.5">Danh mục</h3>
      <input
        type="text"
        placeholder="Tìm kiếm danh mục..."
        value={categorySearch}
        onChange={(e) => setCategorySearch(e.target.value)}
        className="mb-4 p-2 border border-neutral-200 rounded"
      />
      <div className="max-h-60 overflow-y-auto space-y-2 px-1">
        {filteredCategories?.map((item: Category, index: number) => (
          <div key={index} className="">
            <Radio
              id={item.id.toString()}
              name="category"
              label={item.name}
              checked={selectedCategory === item.id.toString()}
              sizeClassName="w-5 h-5"
              onChange={() => handleChangeCategory(item.id.toString())}
              className="!text-sm"
            />
          </div>
        ))}
      </div>
    </div>
  );

  const renderTabsBrand = () => (
    <div className="relative flex flex-col py-8 space-y-4">
      <h3 className="font-semibold mb-2.5">Thương hiệu</h3>
      <input
        type="text"
        placeholder="Tìm kiếm thương hiệu..."
        value={brandSearch}
        onChange={(e) => setBrandSearch(e.target.value)}
        className="mb-4 p-2 border border-neutral-200 rounded"
      />
      <div className="max-h-60 overflow-y-auto space-y-2 px-1">
        {filteredBrands?.map((item: Brand, index: number) => (
          <div key={index} className="">
            <Radio
              id={item.id.toString()}
              name="brand"
              label={item.name}
              checked={selectedBrand === item.id.toString()}
              sizeClassName="w-5 h-5"
              onChange={() => handleChangeBrand(item.id.toString())}
              className="!text-sm"
            />
          </div>
        ))}
      </div>
    </div>
  );

  const renderTabsPriceRage = () => (
    <div className="relative flex flex-col py-8 space-y-5 pr-3">
      <div className="space-y-5">
        <span className="font-semibold">Lọc theo giá</span>
        <Slider
          range
          min={PRICE_RANGE[0]}
          max={PRICE_RANGE[1]}
          step={10000}
          value={[rangePrices[0], rangePrices[1]]}
          allowCross={false}
          onChange={(_input: number | number[]) =>
            setRangePrices(_input as number[])
          }
        />
      </div>
      <div className="flex justify-between space-x-5">
        <div>
          <label
            htmlFor="minPrice"
            className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
          >
            Từ
          </label>
          <div className="mt-1 relative rounded-md">
            <span className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-neutral-500 sm:text-sm">
              đ
            </span>
            <input
              type="text"
              name="minPrice"
              disabled
              id="minPrice"
              className="block w-32 pr-10 pl-4 sm:text-sm border-neutral-200 dark:border-neutral-700 rounded-full bg-transparent"
              value={rangePrices[0]}
            />
          </div>
        </div>
        <div>
          <label
            htmlFor="maxPrice"
            className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
          >
            Đến
          </label>
          <div className="mt-1 relative rounded-md">
            <span className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-neutral-500 sm:text-sm">
             đ
            </span>
            <input
              type="text"
              disabled
              name="maxPrice"
              id="maxPrice"
              className="block w-32 pr-10 pl-4 sm:text-sm border-neutral-200 dark:border-neutral-700 rounded-full bg-transparent"
              value={rangePrices[1]}
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderTabsSortOrder = () => (
    <div className="relative flex flex-col py-8 space-y-4">
      <h3 className="font-semibold mb-2.5">Lọc theo</h3>
      {DATA_sortOrderRadios.map((item) => (
        <Radio
          id={item.id}
          key={item.id}
          name="radioNameSort"
          label={item.name}
          checked={sortOrderStates === item.id}
          sizeClassName="w-5 h-5"
          onChange={setSortOrderStates}
          className="!text-sm"
        />
      ))}
    </div>
  );
  const handleClearFilters = () => {
    setSelectedCategory(null);
    setSelectedBrand(null);
    setRangePrices([PRICE_RANGE[0], PRICE_RANGE[1]]);
    setSortOrderStates("");
    setCategorySearch("");
    setBrandSearch("");
  };


  return (
    <div className="divide-y divide-slate-200 dark:divide-slate-700">
      <button
        onClick={handleClearFilters}
        className="mb-4 text-blue-500 hover:underline"
      >
        Xóa tất cả bộ lọc
      </button>
      {renderTabsCategories()}
      {renderTabsBrand()}
      {renderTabsPriceRage()}
      {renderTabsSortOrder()}
    </div>
  );
};

export default SidebarFilters;