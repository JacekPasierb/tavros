type Variant = {
    size: string;
    sku: string;
    stock: number;
  };

export interface Product  {
    _id: string;
    title: string;
    price: number;
    currency?: string;
    images?: string[];
    variants?: Variant[];
    slug?: string;
  };