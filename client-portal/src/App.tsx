import React, { useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { ClientAppProvider } from './context/ClientAppContext';
import { SplashScreen } from './components/SplashScreen';
import { PublicWebsite } from './views/PublicWebsite';

const ClientPortalContent: React.FC = () => {
  const [showSplash, setShowSplash] = useState<boolean>(true);

  if (showSplash) {
    return (
      <AnimatePresence>
        <SplashScreen onComplete={() => setShowSplash(false)} />
      </AnimatePresence>
    );
  }

  return <PublicWebsite />;
};

export default function App() {
  return (
    <ClientAppProvider>
      <ClientPortalContent />
    </ClientAppProvider>
  );
}

