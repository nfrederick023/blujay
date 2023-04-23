import { PublicConfig } from "../../../utils/types";
import React, { FC } from "react";

const ConfigContext = React.createContext<PublicConfig>({} as PublicConfig);
const { Provider } = ConfigContext;

interface ConfigProviderProps {
  children?: React.ReactNode;
  publicConfig: PublicConfig;
}

const ConfigProvider: FC<ConfigProviderProps> = ({
  children,
  publicConfig,
}: ConfigProviderProps) => {
  return <Provider value={publicConfig}>{children}</Provider>;
};

export { ConfigContext, ConfigProvider };
