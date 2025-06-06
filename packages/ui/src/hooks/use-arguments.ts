import React from "react";

export const useArguments = (
  options: { customerId: string } | { appointmentId: string }
) => {
  const [args, setArguments] = React.useState<any>({});

  const getArguments = async () => {
    const response = await fetch(
      `/admin/api/templates/arguments/?${"customerId" in options ? `customerId=${options.customerId}` : `appointmentId=${options.appointmentId}`}`
    );

    return await response.json();
  };

  React.useEffect(() => {
    getArguments().then((args) => setArguments(args));
  }, []);

  return args;
};
