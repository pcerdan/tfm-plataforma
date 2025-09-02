declare module "registro/RegistroApp" {
  import { FC } from "react";
  import { RegistroConfig } from "../../registro/src/types";
  const RemoteRegistroApp: FC<RegistroConfig>;
  export default RemoteRegistroApp;
}

declare module "registro/styles";
declare module "*.css";

