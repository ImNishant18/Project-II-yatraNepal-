import React from "react";

import Footer from "../../components/footer/Footer";
import Header from "../../components/header/Header";
import Navbar from "../../components/navbar/Navbar";
import ImageSlider from "../../components/AllHome/image-slider/image-slider";
import HotelsInformation from "../../components/AllHome/HotelsInformation/HotelsInformation";
import TravelBanner from "../../components/AllHome/Banner/banner";
import TouristGuideBanner from "../../components/AllHome/TouristGuideBanner/TouristGuideBanner";
import PlaceBanner from "../../components/AllHome/PlaceBanner/PlaceBanner";
import Weekend from "../../components/AllHome/weekend/weekend";
import ExchangeCentersApp from "../../components/AllHome/Money-exchange/moneyexchange";

const Home = () => {
  return (
    <div>
      <Navbar />
      <Header />
      <ImageSlider />
      <PlaceBanner />
      <TravelBanner />
      <HotelsInformation />
      <ExchangeCentersApp />
      <TouristGuideBanner />
      <Weekend />
      <Footer />
    </div>
  );
};

export default Home;
