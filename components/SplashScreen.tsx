import React from 'react';

const SplashScreen: React.FC = () => {
  return (
    <div className="safe-screen relative flex h-full items-center justify-center overflow-hidden bg-[#120c08]">
      <img
        src="https://i.ibb.co/yFTNgGRP/fundo.png"
        alt="Clser splash"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,149,0,0.78),rgba(255,84,64,0.72),rgba(255,36,109,0.84))]"></div>
      <div className="absolute inset-0 bg-black/10"></div>

      <div className="relative z-10 flex flex-col items-center justify-center px-8 text-center animate-fade-in">
        <img
          src="https://i.ibb.co/1jSq1PW/logo-clser-wht.png"
          alt="Clser"
          className="mb-4 h-16 w-auto object-contain drop-shadow-[0_12px_32px_rgba(0,0,0,0.24)]"
        />
        <div className="h-1 w-24 rounded-full bg-white/35"></div>
      </div>
    </div>
  );
};

export default SplashScreen;
