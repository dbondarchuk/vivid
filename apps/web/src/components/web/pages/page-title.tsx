import { getPageData } from "@vivid/utils";

export const PageTitle: React.FC = () => <>{getPageData().page.title}</>;
