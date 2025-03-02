import { Toaster } from "react-hot-toast";
import { BrowserRouter, Route, Routes } from "react-router";
import AccountBilling from "../containers/AccountPage/AccountBilling";
import AccountOrder from "../containers/AccountPage/AccountOrder";
import AccountPage from "../containers/AccountPage/AccountPage";
import AccountPass from "../containers/AccountPage/AccountPass";
import AccountSavelists from "../containers/AccountPage/AccountSavelists";
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
import Footer from "../shared/Footer/Footer";
import ScrollToTop from "./ScrollToTop";
import { Page } from "./types";

export const pages: Page[] = [
  { path: "/", component: PageHome },
  { path: "/product-detail", component: ProductDetailPage },
  { path: "/product-detail-2", component: ProductDetailPage2 },
  { path: "/cua-hang", component: PageCollection2 },
  { path: "/page-search", component: PageSearch },

  { path: "/bai-viet", component: BlogPage },
  { path: "/blog-single", component: BlogSingle },
  { path: "/cau-hoi-thuong-gap", component: PageFaq },
  { path: "/thong-tin-ve-chung-toi", component: PageAbout },
  { path: "/lien-he", component: PageContact },

];
export const privatePages: Page[] = [
  { path: "/account", component: AccountPage },
  { path: "/account-savelists", component: AccountSavelists },
  { path: "/account-change-password", component: AccountPass },
  { path: "/account-billing", component: AccountBilling },
  { path: "/account-my-order", component: AccountOrder },
  { path: "/checkout", component: CheckoutPage },
  { path: "/cart", component: CartPage },


]

const MyRoutes = () => {
  return (
    <BrowserRouter>
      <Toaster />
      <ScrollToTop />
      <SiteHeader />
      <Routes>
        {pages.map(({ component: Component, path }, index) => {
          return <Route key={index} element={<Component />} path={path} />;
        })}
        {privatePages.map(({ component: Component, path }, index) => {
          return <Route key={index} element={<Component />} path={path} />;
        })}

        <Route path="/signup" element={<PageSignUp />} />
        <Route path="/login" element={<PageLogin />} />
        <Route path="*" element={<Page404 />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
};

export default MyRoutes;
