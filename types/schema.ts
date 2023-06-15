import type { Pokemon } from "app/types/pokemon.ts";
import type { User } from "app/types/user.ts";

export type Schema = {
  pokemon: {
    [key: Pokemon["id"]]: Pokemon;
  };
  sessions: {
    [key: string]: User;
  };
  shiny_encounters: {
    [key: Pokemon["id"]]: User["id"][];
  };
  users: {
    [key: User["id"]]: User;
  };
  votes: {
    [key: Pokemon["id"]]: {
      allstar: User["id"][];
      infamous: User["id"][];
      favorite: User["id"][];
      versatile: User["id"][];
    };
  };
};
