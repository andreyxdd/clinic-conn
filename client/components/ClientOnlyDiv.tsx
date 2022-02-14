import React, { useEffect, useState } from 'react';

export interface IClientOnlyDiv {
  children: any;
  style?: React.CSSProperties;
}

const ClientOnlyDiv: React.FC<IClientOnlyDiv> = ({ children, style, ...delegated }) => {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
    return () => { setHasMounted(false); };
  }, []);

  if (!hasMounted) {
    return null;
  }

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <div style={style} {...delegated}>
      {children}
    </div>
  );
};
export default ClientOnlyDiv;
