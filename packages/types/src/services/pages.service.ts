import { Query, WithTotal } from "../database";
import { Page, PageCreate, PageUpdate } from "../pages";

export interface IPagesService {
  getPage(_id: string): Promise<Page | null>;
  getPageBySlug(slug: string): Promise<Page | null>;
  getPages(
    query: Query & {
      publishStatus: boolean[];
      maxPublishDate?: Date;
      tags?: string[];
    }
  ): Promise<WithTotal<Page>>;
  createPage(page: PageCreate): Promise<Page>;
  updatePage(id: string, update: PageUpdate): Promise<void>;
  deletePage(id: string): Promise<Page | undefined>;
  deletePages(ids: string[]): Promise<void>;
  checkUniqueSlug(slug: string, _id?: string): Promise<boolean>;
}
