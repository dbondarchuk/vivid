import { Markdown } from "@/components/markdown/Markdown";
import { existsSync } from "fs";
import { notFound } from "next/navigation";
import { YamlInclude } from "yaml-js-include";
import { Service } from "./types";

export default async function Page({
  params,
}: {
  params: { service: string };
}) {
  const service = params.service;
  const filePath = `${process.cwd()}/src/app/data/services/${service}.yaml`;

  if (!existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    return notFound();
  }

  const config = await new YamlInclude().loadAsync<Service>(filePath);

  return (
    <div className="container mx-auto flex flex-col gap-20 px-4">
      <section className="w-full appear rounded-lg ">
        <div className="py-[10vmax]  flex flex-col items-center gap-10 text-center">
          <h1 className="font-header font-semibold text-[4rem] md:text-7xl py-10">
            {config.name}
          </h1>
          <Markdown className="uppercase" markdown={config.description} />
        </div>
      </section>
      <div className="flex flex-col gap-16 w-full">
        {config.sections.map((section, index) => (
          <section
            className="flex flex-col md:flex-row gap-10 w-full appear"
            key={section.name}
          >
            <div className="flex flex-col gap-4 md:w-1/3">
              <h3 className="font-header font-normal text-[4rem] md:text-7xl">
                {section.name}
              </h3>
              {section.description && (
                <Markdown
                  className="uppercase"
                  markdown={section.description}
                />
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:w-2/3">
              {section.items.map((item) => (
                <div key={item.name} className="flex flex-col gap-4">
                  <div className="font-normal text-2xl">${item.price}</div>
                  <h4 className="font-bold text-3xl">{item.name}</h4>
                  {item.description && (
                    <Markdown
                      className="uppercase"
                      markdown={item.description}
                    />
                  )}
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
