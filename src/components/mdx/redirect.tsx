import { redirect } from "next/navigation";

export type RedirectProps = {
  url: string;
};

export const Redirect: React.FC<RedirectProps> = ({ url }) => {
  redirect(url);
};
