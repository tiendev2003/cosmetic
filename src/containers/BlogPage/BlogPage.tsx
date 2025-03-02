import React from "react";
import BgGlassmorphism from "../../components/BgGlassmorphism/BgGlassmorphism";
import SectionPromo3 from "../../components/SectionPromo3";
import SectionAds from "./SectionAds";
import SectionLatestPosts from "./SectionLatestPosts";
import SectionMagazine5 from "./SectionMagazine5";

// DEMO DATA

const BlogPage: React.FC = () => {
  return (
    <div className="nc-BlogPage overflow-hidden relative">

      <title>Blog || fashionFactory React Template</title>


      {/* ======== BG GLASS ======== */}
      <BgGlassmorphism />
      {/* ======== ALL SECTIONS ======== */}
      <div className="container relative">
        {/* === SECTION 1 === */}
        <div className="pt-12 pb-16 lg:pb-28">
          <SectionMagazine5 />
        </div>

        {/* === SECTION 1 === */}
        <SectionAds />

        {/* === SECTION 8 === */}
        <SectionLatestPosts className="py-16 lg:py-28" />

        {/* === SECTION 1 === */}
        <SectionPromo3 className="pb-16 lg:pb-28" />
      </div>
    </div>
  );
};

export default BlogPage;
