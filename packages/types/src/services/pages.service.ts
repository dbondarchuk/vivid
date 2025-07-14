import { Query, WithTotal } from "../database";
import { Page, PageListModel, PageUpdateModel } from "../pages";

export interface IPagesService {
  getPage(id: string): Promise<Page | null>;
  getPageBySlug(slug: string): Promise<Page | null>;
  getPages(
    query: Query & {
      publishStatus: boolean[];
      maxPublishDate?: Date;
      tags?: string[];
    }
  ): Promise<WithTotal<PageListModel>>;
  createPage(page: PageUpdateModel): Promise<Page>;
  updatePage(id: string, update: PageUpdateModel): Promise<void>;
  deletePage(id: string): Promise<Page | null>;
  deletePages(ids: string[]): Promise<void>;
  checkUniqueSlug(slug: string, id?: string): Promise<boolean>;
}
