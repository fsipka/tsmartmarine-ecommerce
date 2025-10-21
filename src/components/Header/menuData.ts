import { Menu } from "@/types/Menu";

export const menuData: Menu[] = [
  {
    id: 1,
    title: "Home",
    newTab: false,
    path: "/",
  },
  {
    id: 2,
    title: "Yachts",
    newTab: false,
    path: "/shop-yacht",
    megaMenu: true,
  },
  {
    id: 3,
    title: "Accessories",
    newTab: false,
    path: "/shop-accessory",
    megaMenu: true,
  },
  {
    id: 4,
    title: "Services",
    newTab: false,
    path: "/shop-service",
    megaMenu: true,
  },
  {
    id: 5,
    title: "Spare Parts",
    newTab: false,
    path: "/shop-spare-part",
    megaMenu: true,
  },
  {
    id: 6,
    title: "Contact",
    newTab: false,
    path: "/contact",
  },
];
