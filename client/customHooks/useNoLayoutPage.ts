import React from 'react';
import shallow from 'zustand/shallow';
import { useStore } from '../context/storeZustand';

const useNoLayoutPage = (mw = 'xs') => {
  const {
    setContainerMaxWidth, setShowNavbar, setShowTransition,
  } = useStore(
    (store) => ({
      setContainerMaxWidth: store.setContainerMaxWidth,
      setShowNavbar: store.setShowNavbar,
      setShowTransition: store.setShowTransition,
    }),
    shallow,
  );

  React.useEffect(() => {
    setShowTransition(false);
    setShowNavbar(false);
    setContainerMaxWidth(mw);
  }, []);
};

export default useNoLayoutPage;
