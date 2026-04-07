import { LucideIcon } from "lucide-react";

export type Route = {
     title: string;
     items: {
          title: string;
          url: string;
          icon?: LucideIcon;
     }[];
};