import { Query, WithTotal } from "../database";
import { Page, PageUpdateModel } from "../pages";

export interface IPagesService {
  getPage(id: string): Promise<Page | null>;
  getPageBySlug(slug: string): Promise<Page | null>;
  getPages(
    query: Query & {
      publishStatus: boolean[];
      maxPublishDate?: Date;
      tags?: string[];
    }
  ): Promise<WithTotal<Page>>;
  createPage(page: PageUpdateModel): Promise<Page>;
  updatePage(id: string, update: PageUpdateModel): Promise<void>;
  deletePage(id: string): Promise<Page | undefined>;
  deletePages(ids: string[]): Promise<void>;
  checkUniqueSlug(slug: string, id?: string): Promise<boolean>;
}
