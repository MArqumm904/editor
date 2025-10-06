import React from "react";
import Navbar from "../components/Navbar";
import DonateHERO from "../components/HERO.JSX";
import Donors from "../components/Donors";
import Footer from "../components/Footer";

const Home = () => {
  return (
    <div className="">
      <Navbar />
      <DonateHERO />
      {/* <Donors /> */}
      <Footer />
    </div>
  );
};

export default Home;
