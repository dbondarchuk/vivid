import { getPageData } from "@/lib/pageDataCache";

export const PageTitle: React.FC = () => <>{getPageData().page.title}</>;
