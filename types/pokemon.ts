type Type =
  | "bug"
  | "dark"
  | "dragon"
  | "electric"
  | "fairy"
  | "fighting"
  | "fire"
  | "flying"
  | "ghost"
  | "grass"
  | "ground"
  | "ice"
  | "normal"
  | "poison"
  | "psychic"
  | "rock"
  | "steel"
  | "water";

export type Pokemon = {
  artwork: {
    default: string;
    shiny: string;
  };
  base_experience: number;
  height: number;
  id: number;
  name: string;
  stats: { [key: string]: number };
  types: Type[];
  weight: number;
};
