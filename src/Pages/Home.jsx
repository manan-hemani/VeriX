// import React from "react";
import Hero from "../Components/Hero";
import Main from "../Components/Main";
import Workflow from "../Components/Workflow";
import NotChatbot from "../Components/NotChatbot";
import CTA from "../Components/CTA";

const Home = () => {
  return (
    <>
      <div class="bg-grid">
        <Hero />
        <Main />
        <Workflow />
        <NotChatbot />
        <CTA />
      </div>
    </>
  );
};

export default Home;
