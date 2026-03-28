import React from 'react';
import Hero from '../Components/Hero';
import Services from '../Components/Services';
import Tariffs from '../Components/Tariffs';
import HomeMarqueeBand from '../Components/HomeMarqueeBand';
import ChatWidget from '../Components/ChatWidget';
import HomeConsentModal from '../Components/HomeConsentModal';

const Page = () => {
  return (
    <div>
      <HomeConsentModal />
      <Hero />
      <Services />
      <Tariffs />
      <HomeMarqueeBand />
      <ChatWidget />
    </div>
  );
};

export default Page;
