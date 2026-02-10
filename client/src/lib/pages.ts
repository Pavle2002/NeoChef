import {
  Home,
  Refrigerator,
  Star,
  TrendingUp,
  User,
  Search,
  Crown,
} from "lucide-react";

export const PAGES = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Crown,
  },
  {
    title: "Home",
    url: "/home",
    icon: Home,
  },
  {
    title: "Search",
    url: "/search",
    icon: Search,
  },
  {
    title: "Trending",
    url: "/trending",
    icon: TrendingUp,
  },
  {
    title: "Fridge",
    url: "/fridge",
    icon: Refrigerator,
  },
  {
    title: "Preferences",
    url: "/preferences",
    icon: User,
  },
  {
    title: "Favorites",
    url: "/favorites",
    icon: Star,
  },
] as const;
