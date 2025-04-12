import { ServicesContainer } from "@vivid/services";
import { Card, CardDescription, CardHeader, CardTitle } from "@vivid/ui";
import { notFound } from "next/navigation";
import { InstallForm } from "./form";

export const dynamicParams = true;
export const revalidate = 60;

export default async function Page() {
  const page = await ServicesContainer.PagesService().getPageBySlug("home");
  if (!!page) {
    console.error(`Website is already installed.`);
    notFound();
  }

  return (
    <div className="w-[100vw] min-h-[100vh] flex items-center justify-center">
      <Card className="w-full md:max-w-[80%] xl:max-w-[60%] p-2">
        <CardHeader>
          <CardTitle>Install</CardTitle>
          <CardDescription>Quickly set up your websit</CardDescription>
        </CardHeader>
        <InstallForm />
      </Card>
    </div>
  );
}
