import { Markdown } from "@/components/markdown/Markdown";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import React from "react";
import { ServicesSection as ServicesSectionProps } from "./ServicesSection.types";

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  services,
}) => {
  return (
    <section className="flex flex-col gap-20 w-full scroll-m-20" id="services">
      <h3 className="w-full text-4xl text-center appear">Our Services</h3>
      {services.map((service) => (
        <div
          className="flex flex-col md:flex-row md:odd:flex-row-reverse gap-6 appear items-center"
          key={service.name}
        >
          {service.image && (
            <Image
              src={service.image}
              alt={service.alt}
              width={400}
              height={400}
            />
          )}
          {service.video && (
            <video
              src={service.video}
              width={400}
              height={400}
              autoPlay
              loop
              muted
              controls={false}
            />
          )}
          <div className="flex flex-col gap-16 flex-grow  text-center">
            <div className="flex flex-col gap-4">
              <h5 className="text-2xl font-thin">{service.slogan}</h5>
              <h4 className="text-6xl font-header font-semibold">
                {service.name}
              </h4>
            </div>
            <div className="flex flex-col gap-8">
              <div className="font-thin uppercase">
                <Markdown markdown={service.description} />
              </div>
              <div>
                <Button variant="primary" size="lg" asChild>
                  <a href={service.link}>Learn more</a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
};
