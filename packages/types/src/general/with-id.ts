export type Id = {
  id: string;
};

export type WithId<T> = T & Id;
