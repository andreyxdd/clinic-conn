import React from 'react';
import shallow from 'zustand/shallow';
import { useUIStore } from '../context/UIStore';

interface IUseLayout{
  showTransition: boolean;
  showNavbar: boolean;
  containerMaxWidth: string;
}

// by default - no navbar and narrow container
const defaultProps = {
  showTransition: false,
  showNavbar: false,
  containerMaxWidth: 'xl',
};

const useLayout = (
  props: IUseLayout = defaultProps,
) => {
  const {
    showTransition,
    showNavbar,
    containerMaxWidth,
  } = props;
  const {
    setContainerMaxWidth, setShowNavbar, setShowTransition,
  } = useUIStore(
    (store) => ({
      setContainerMaxWidth: store.setContainerMaxWidth,
      setShowNavbar: store.setShowNavbar,
      setShowTransition: store.setShowTransition,
    }),
    shallow,
  );

  React.useEffect(() => {
    setShowTransition(showTransition);
    setShowNavbar(showNavbar);
    setContainerMaxWidth(containerMaxWidth);
  }, []);
};

export default useLayout;
