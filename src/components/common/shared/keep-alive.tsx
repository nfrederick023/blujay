import { KeepAlive as _KeepAlive } from "react-activation";
import React, { FC, ReactNode, useEffect, useState } from "react";

export interface KeepAliveProps {
  children: ReactNode;
}

const KeepAlive: FC<KeepAliveProps> = ({ children }) => {
  const [keepAliveChildren, setKeepAliveChildren] = useState(<>{children}</>);

  useEffect(() => {
    setKeepAliveChildren(<_KeepAlive saveScrollPosition="screen">{children}</_KeepAlive>);
  }, []);

  return <>{keepAliveChildren}</>;
};

export default KeepAlive;
