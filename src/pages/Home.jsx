import React from "react";
import Navbar from "../components/Navbar";
import HERO from "../components/HERO.JSX";
import Donors from "../components/Donors";
import Footer from "../components/Footer";

const Home = () => {
  return (
    <div className="">
      <Navbar />
      <HERO />
      <Donors />
      <Footer />
    </div>
  );
};

export default Home;
