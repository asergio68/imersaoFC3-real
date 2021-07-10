export interface Product {
  id: string;
  name: string;
  description: string;
  image_url: string;
  slug: string;
  price: number;
  created_at: string;
}

export interface CreditCard {
  number: string;
  name: string;
  expiration_month: number;
  expiration_year: number;
  cvv: string;
}

export enum OrderStatus {
  Approved = "approved",
  Pending = "pending",
}

export interface OrderItem {
  product: Product;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  credit_card: Omit<CreditCard, "cvv" | "name">;
  items: OrderItem[];
  status: OrderStatus;
}

export const products: Product[] = [
  {
    id: "uuid24l5j24jj2k4jkj",
    name: "produto teste",
    description:
      "uma descrição bem longa. Muito longa mesmo. Enchendo bem a linguiça.",
    price: 50.5,
    image_url: "https://source.unsplash.com/random?product," + Math.random(),
    slug: "produto-teste",
    created_at: "2021-07-07T00:00:00",
  },
  {
    id: "uuid3h15uhiu3h4353j",
    name: "produto teste2",
    description:
      "uma descrição bem longa. Muito longa mesmo. Enchendo bem a linguiça.",
    price: 350.35,
    image_url: "https://source.unsplash.com/random?product," + Math.random(),
    slug: "produto-teste2",
    created_at: "2021-07-07T15:00:00",
  },
];
