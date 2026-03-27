import React from 'react';
import Hero from '../Components/Hero';
import Services from '../Components/Services';
import Tariffs from '../Components/Tariffs';
import ChatWidget from '../Components/ChatWidget';
import HomeConsentModal from '../Components/HomeConsentModal';

const Page = () => {
  return (
    <div>
      <HomeConsentModal />
      <Hero />
      <Services />
      <Tariffs />
      <ChatWidget />
    </div>
  );
};

export default Page;
