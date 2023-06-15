import type { User } from "app/types/user.ts";

export type Votes = {
  favorite: User["id"][];
};
