import { Toaster } from "react-hot-toast";
import { useSelector } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router";
import AccountBilling from "../containers/AccountPage/AccountBilling";
import AccountOrder from "../containers/AccountPage/AccountOrder";
import AccountOrderDetail from "../containers/AccountPage/AccountOrderDetail";
import AccountPage from "../containers/AccountPage/AccountPage";
import AccountPass from "../containers/AccountPage/AccountPass";
import AccountSavelists from "../containers/AccountPage/AccountSavelists";
import AddBlog from "../containers/Admin/Blog/AddBlog";
import ListBlog from "../containers/Admin/Blog/ListBlog";
import AddBlogCategory from "../containers/Admin/BlogCategory/AddBlogCategory";
import ListBlogCategory from "../containers/Admin/BlogCategory/ListBlogCategory";
import AddBrand from "../containers/Admin/Brand/AddBrand";
import ListBrand from "../containers/Admin/Brand/ListBrand";
import AddCategories from "../containers/Admin/Categories/AddCategories";
import ListCategories from "../containers/Admin/Categories/ListCategories";
import DashboardPage from "../containers/Admin/Dashboard/DashboardPage";
import AddDiscount from "../containers/Admin/Discount/AddDiscount";
import ListDiscount from "../containers/Admin/Discount/ListDiscount";
import DetailOrder from "../containers/Admin/Order/DetailOrder";
import ListOrder from "../containers/Admin/Order/ListOrder";
import AddProduct from "../containers/Admin/Products/AddProduct";
import ListProduct from "../containers/Admin/Products/ListProduct";
import ListUser from "../containers/Admin/Users/ListUser";
import BlogPage from "../containers/BlogPage/BlogPage";
import BlogSingle from "../containers/BlogPage/BlogSingle";
import Page404 from "../containers/Page404/Page404";
import PageAbout from "../containers/PageAbout/PageAbout";
import CheckoutPage from "../containers/PageCheckout/CheckoutPage";
import PageCollection2 from "../containers/PageCollection2";
import PageContact from "../containers/PageContact/PageContact";
import PageFaq from "../containers/PageFaq/PageFaq";
import PageHome from "../containers/PageHome/PageHome";
import PageLogin from "../containers/PageLogin/PageLogin";
import PageSearch from "../containers/PageSearch";
import PageSignUp from "../containers/PageSignUp/PageSignUp";
import CartPage from "../containers/ProductDetailPage/CartPage";
import ProductDetailPage from "../containers/ProductDetailPage/ProductDetailPage";
import ProductDetailPage2 from "../containers/ProductDetailPage/ProductDetailPage2";
import SiteHeader from "../containers/SiteHeader";
import AdminLayout from "../layout/AdminLayout";
import Footer from "../shared/Footer/Footer";
import { RootState } from "../store";
import ScrollToTop from "./ScrollToTop";
import { Page } from "./types";

export const pages: Page[] = [
  { path: "/", component: PageHome },
  { path: "/cua-hang1/:id", component: ProductDetailPage },
  { path: "/cua-hang/:id", component: ProductDetailPage2 },
  { path: "/cua-hang", component: PageCollection2 },
  { path: "/page-search", component: PageSearch },
  { path: "/bai-viet", component: BlogPage },
  { path: "/bai-viet/:id", component: BlogSingle },
  { path: "/cau-hoi-thuong-gap", component: PageFaq },
  { path: "/thong-tin-ve-chung-toi", component: PageAbout },
  { path: "/lien-he", component: PageContact },

];
export const privatePages: Page[] = [
  { path: "/account", component: AccountPage },
  { path: "/account-savelists", component: AccountSavelists },
  { path: "/account-change-password", component: AccountPass },
  { path: "/account-address", component: AccountBilling },
  { path: "/account-my-order", component: AccountOrder },
  { path: "/account-my-order/:id", component: AccountOrderDetail },
  { path: "/checkout", component: CheckoutPage },
  { path: "/cart", component: CartPage },
]

export const adminPages: Page[] = [
  {
    path: "/admin",
    component: DashboardPage,

  },
  {
    path: '/admin/brand',
    component: ListBrand
  },
  {
    path: '/admin/brand/add',
    component: AddBrand
  },
  {
    path: '/admin/brand/edit/:id',
    component: AddBrand
  },
  {
    path: "/admin/products",
    component: ListProduct,
  },
  {
    path: "/admin/products/add",
    component: AddProduct,
  },
  {
    path: "/admin/products/edit/:id",
    component: AddProduct,
  },
  {
    path: "/admin/categories",
    component: ListCategories,
  },
  {
    path: "/admin/categories/add",
    component: AddCategories,
  },
  {
    path: "/admin/categories/edit/:id",
    component: AddCategories,
  },
  {
    path: "/admin/discounts",
    component: ListDiscount,
  },
  {
    path: "/admin/discounts/add",
    component: AddDiscount,
  },
  {
    path: "/admin/discounts/edit/:id",
    component: AddDiscount,
  },
  {
    path: "/admin/orders",
    component: ListOrder,
  },
  {
    path: "/admin/orders/edit/:id",
    component: DetailOrder,
  },
  {
    path: "/admin/users",
    component: ListUser,
  },
  {
    path: "/admin/blog",
    component: ListBlog
  },
  {
    path: "/admin/blog/add",
    component: AddBlog
  },
  {
    path: "/admin/blog/edit/:id",
    component: AddBlog
  },
  {
    path: "/admin/blog-categories",
    component: ListBlogCategory,
  },
  {
    path: "/admin/blog-categories/add",
    component: AddBlogCategory,
  },
  {
    path: "/admin/blog-categories/edit/:id",
    component: AddBlogCategory,
  },
]

const MyRoutes = () => {
  const { userInfo } = useSelector((state: RootState) => state.auth);
  return (
    <BrowserRouter>
      <Toaster />
      <ScrollToTop />
      <Routes>

        {pages.map(({ component: Component, path }, index) => {
          return <Route key={index} element={<>
            <SiteHeader />
            <Component /> <Footer />
          </>} path={path} />;
        })}

        {
          userInfo && userInfo.role !== null &&
          privatePages.map(({ component: Component, path }, index) => {
            return <Route key={index} element={<>
              <SiteHeader />
              <Component /> <Footer />
            </>} path={path} />;
          })}
        <Route path="/" element={<AdminLayout />}>
          {
            userInfo && userInfo.role === "ADMIN" &&
            adminPages.map(({ component: Component, path }, index) => {
              return <Route key={index} element={<>
                <Component />
              </>} path={path} />;
            })
          }
        </Route>


        <Route path="/signup" element={<>
          <SiteHeader />
          <PageSignUp /> <Footer />
        </>} />
        <Route path="/login" element={<>
          <SiteHeader />
          <PageLogin /> <Footer />
        </>} />
        <Route path="*" element={<>
          <SiteHeader />
          <Page404 /> <Footer />
        </>} />
      </Routes>


    </BrowserRouter>
  );
};

export default MyRoutes;
