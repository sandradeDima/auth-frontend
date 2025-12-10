import { User } from "@/types/user";

export interface UserSearchPagination {
  users?: User[];
  total: number;
  pages: number;
}
