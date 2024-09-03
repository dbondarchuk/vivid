import { Services } from "@/lib/services";

export const authorize = async (credentials: {
  email: string;
  password: string;
}) => {
  const { name, email } =
    await Services.ConfigurationService().getConfiguration("general");

  if (
    credentials?.email === email &&
    credentials?.password === process.env.AUTH_PASSWORD
  ) {
    return {
      id: "1",
      name: name,
      email: email,
    };
  }

  return null;
};
