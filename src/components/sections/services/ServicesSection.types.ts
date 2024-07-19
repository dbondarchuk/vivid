export interface ServicesSectionService {
  name: string;
  slogan: string;
  description: string;
  link: string;
  alt: string;
  image?: string;
  video?: string;
}

export type ServicesSection = {
  services: ServicesSectionService[];
};
