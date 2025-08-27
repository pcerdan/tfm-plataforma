export type RegistroTheme = {
  primaryColor: string;
};

export type ExtraField = {
  name: string;
  label: string;
  type: string;
  required: boolean;
};

export type RegistroConfig = {
  theme: RegistroTheme;
  config: {
    showSessionSelector: boolean;
    extraFields: ExtraField[];
  };
};
