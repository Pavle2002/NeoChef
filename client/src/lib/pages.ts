import {
  Home,
  Refrigerator,
  Settings,
  Star,
  TrendingUp,
  User,
  Search,
} from "lucide-react";

export const PAGES = [
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
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
  {
    title: "Profile",
    url: "/profile",
    icon: Settings,
  },
] as const;
