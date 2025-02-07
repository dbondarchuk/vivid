import React from "react";
import { getDemoArguments } from "../apps.actions";

export const useDemoArguments = () => {
  const [demoArguments, setDemoArguments] = React.useState<any>({});

  React.useEffect(() => {
    getDemoArguments().then((args) => setDemoArguments(args));
  }, []);

  return demoArguments;
};
