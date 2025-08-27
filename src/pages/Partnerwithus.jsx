import Navbar from "../components/Navbar";
import PARTNEREHEO from "../components/PartnerHero";
import Donors from "../components/Donors";
import Footer from "../components/Footer";
import { useEffect } from "react";

const Partner = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="">
      <Navbar />
      <PARTNEREHEO />
      <Donors />
      <Footer />
    </div>
  );
};

export default Partner;