import React, { createContext, useContext, useState, ReactNode } from "react";

type RegistroTheme = {
  primaryColor: string;
};

type ExtraField = {
  name: string;
  label: string;
  type: string;
  required: boolean;
};

type RegistroConfig = {
  theme?: RegistroTheme;
  config?: {
    showSessionSelector: boolean;
    extraFields: ExtraField[];
  };
};

type RegistroConfigContextType = {
  config: RegistroConfig | null;
  setConfig: (config: RegistroConfig) => void;
};

const RegistroConfigContext = createContext<RegistroConfigContextType | undefined>(undefined);

export const useRegistroConfig = () => {
  const context = useContext(RegistroConfigContext);
  if (!context) {
    throw new Error("useRegistroConfig debe usarse dentro de un RegistroConfigProvider");
  }
  return context;
};

type RegistroConfigProviderProps = {
  children: ReactNode;
};

export const RegistroConfigProvider = ({ children }: RegistroConfigProviderProps) => {
  const [config, setConfig] = useState<RegistroConfig | null>(null);

  return (
    <RegistroConfigContext.Provider value={{ config, setConfig }}>
      {children}
    </RegistroConfigContext.Provider>
  );
};
