export interface Service {
  name: string;
  description: string;
  sections: Section[];
}

export interface Section {
  name: string;
  items: Item[];
  description?: string;
}

export interface Item {
  name: string;
  price: number;
  duration: number;
  description?: string;
}
