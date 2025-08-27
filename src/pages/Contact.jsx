import React,{useEffect} from "react";
import Navbar from "../components/Navbar";
import ContactHero from "../components/ContactHero";
import Donors from "../components/Donors";
import Footer from "../components/Footer";

const Donate = () => {
    useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="">
      <Navbar />
      <ContactHero />
      <Donors />
      <Footer />
    </div>
  );
};

export default Donate;