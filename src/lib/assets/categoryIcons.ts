import {
  Utensils,
  Fuel,
  ShoppingCart,
  House,
  PiggyBank,
  CircleDollarSign
} from "lucide-svelte";

export const categoryIcons: Record<string, any> = {
  food: Utensils,
  fuel: Fuel,
  groceries: ShoppingCart,
  housing: House,
  savings: PiggyBank,
  default: CircleDollarSign
};
