import React from "react";

export const useDemoArguments = (noAppointment?: boolean) => {
  const [demoArguments, setDemoArguments] = React.useState<any>({});

  const getDemoArguments = async () => {
    const response = await fetch(
      `/admin/api/templates/arguments/demo${noAppointment ? "?noAppointment=true" : ""}`
    );
    return await response.json();
  };

  React.useEffect(() => {
    getDemoArguments().then((args) => setDemoArguments(args));
  }, []);

  return demoArguments;
};
