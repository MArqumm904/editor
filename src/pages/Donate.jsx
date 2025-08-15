import React from "react";
import Navbar from "../components/Navbar";
import DONATEHEO from "../components/donate_hero";
import Donors from "../components/Donors";
import Footer from "../components/Footer";

const Home = () => {
  return (
    <div className="">
      <Navbar />
      <DONATEHEO />
      <Donors />
      <Footer />
    </div>
  );
};

export default Home;
