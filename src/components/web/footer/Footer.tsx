import { icons } from "lucide-react";
import { SocialIcons } from "../socialIcons/SocialIcons";
import { Icon } from "../../ui/icon";
import { Link } from "../../ui/link";
import { Services } from "@/lib/services";
import { cn } from "@/lib/utils";

export const Footer: React.FC = async () => {
  const configurationService = Services.ConfigurationService();
  const { phone, email, address, name, mapsUrl } =
    await configurationService.getConfiguration("general");

  const { links } = await configurationService.getConfiguration("footer");
  const { instagram, facebook } = await configurationService.getConfiguration(
    "social"
  );

  const getLink = () => {
    return links.map((item) => {
      switch (item.type) {
        case "icon":
          return (
            <a
              href={item.url}
              className={cn("no-underline", item.className)}
              key={item.url}
            >
              <Icon
                name={item.icon as keyof typeof icons}
                className="w-6 h-6"
                aria-label={item.label}
              />
            </a>
          );

        case "button":
          return (
            <Link
              button
              variant={item.variant}
              size={item.size}
              font={item.font}
              fontSize={item.fontSize}
              fontWeight={item.fontWeight}
              key={item.url}
              href={item.url}
              className={cn(
                "inline-flex gap-1 items-center bg-gray-100 border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base",
                item.className
              )}
            >
              {item.prefixIcon && (
                <Icon
                  name={item.prefixIcon as keyof typeof icons}
                  className="w-6 h-6"
                  aria-label={item.label}
                />
              )}
              {item.label}
              {item.suffixIcon && (
                <Icon
                  name={item.suffixIcon as keyof typeof icons}
                  className="w-6 h-6"
                  aria-label={item.label}
                />
              )}
            </Link>
          );

        case "link":
        default:
          return (
            <Link
              variant={item.variant}
              size={item.size}
              key={item.url}
              font={item.font}
              fontSize={item.fontSize}
              fontWeight={item.fontWeight}
              className={cn(
                "text-black underline hover:text-gray-800 transition-all inline-flex gap-1 items-center",
                item.className
              )}
              href={item.url}
            >
              {item.prefixIcon && (
                <Icon
                  name={item.prefixIcon as keyof typeof icons}
                  className="w-6 h-6"
                  aria-label={item.label}
                />
              )}
              {item.label}
              {item.suffixIcon && (
                <Icon
                  name={item.suffixIcon as keyof typeof icons}
                  className="w-6 h-6"
                  aria-label={item.label}
                />
              )}
            </Link>
          );
      }
    });
  };
  return (
    <footer className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col gap-10">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="flex flex-col gap-10 flex-grow">
              <h3 className="font-header text-4xl font-normal">Contact us</h3>
              <div className="flex flex-col gap-4 w-full">
                <div className="flex flex-col gap-4 w-full">
                  <div>
                    <h2 className="font-header font-semibold tracking-widest text-sm uppercase">
                      Phone
                    </h2>
                    <p className="mt-1 font-thin">
                      <Link href={`tel:${phone}`}>{phone}</Link>
                    </p>
                  </div>
                  <div>
                    <h2 className="font-header font-semibold tracking-widest text-sm uppercase">
                      Email
                    </h2>
                    <p className="mt-1 font-thin">
                      <Link href={`mailto:${email}`}>{email}</Link>
                    </p>
                  </div>
                  {address && (
                    <div>
                      <h2 className="font-header font-semibold tracking-widest text-sm uppercase">
                        Address
                      </h2>
                      <p className="mt-1 font-thin">
                        <Link
                          href={`https://www.google.com/maps/place/${encodeURIComponent(
                            address
                          )}`}
                        >
                          {address}
                        </Link>
                      </p>
                    </div>
                  )}
                  {mapsUrl && (
                    <div className="relative bg-gray-100 h-52 overflow-hidden rounded-lg">
                      <iframe
                        sandbox="allow-scripts"
                        className="absolute inset-0 grayscale contrast opacity-40"
                        width="100%"
                        height="100%"
                        title="map"
                        scrolling="no"
                        src={mapsUrl}
                      ></iframe>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <nav className="flex-grow flex flex-col gap-8 text-lg md:items-end justify-center">
              {getLink()}
            </nav>
          </div>
          <div className="text-sm md:items-center flex flex-col gap-2 ">
            <div>
              &copy; {new Date().getFullYear()} {name}
            </div>
            <SocialIcons icons={{ instagram, facebook }} />
          </div>
        </div>
      </div>
    </footer>
  );
};
