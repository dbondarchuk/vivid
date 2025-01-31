import { getDemoArguments } from "@/apps/apps.actions";
import React from "react";

export const useDemoArguments = () => {
  const [demoArguments, setDemoArguments] = React.useState<any>({});

  React.useEffect(() => {
    getDemoArguments().then((args) => setDemoArguments(args));
  }, []);

  return demoArguments;
};
