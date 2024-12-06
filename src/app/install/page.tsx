import { notFound } from "next/navigation";
import { Services } from "@/lib/services";
import PageContainer from "@/components/admin/layout/page-container";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { InstallForm } from "./form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const dynamicParams = true;
export const revalidate = 60;

export default async function Page() {
  const page = await Services.PagesService().getPageBySlug("home");
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
