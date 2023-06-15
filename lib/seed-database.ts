import settings from "app/settings.json" assert { type: "json" };
import createDatabase from "ixalan/server/create-database.ts";

import type { Schema } from "app/types/schema.ts";

/** refers to different resource on `https://pokeapi.co/api/v2/:resource` */
type PokeAPIReference = { name: string; url: string };

/** response type when fetching `https://pokeapi.co/api/v2/pokemon` */
type PokeAPIResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokeAPIReference[];
};

/** response type when fetching `https://pokeapi.co/api/v2/pokemon/:pokemon` */
type PokeAPIPokemonResponse = {
  abilites: {
    ability: PokeAPIReference;
    is_hidden: boolean;
    slot: number;
  }[];
  base_experience: number;
  form: PokeAPIReference[];
  game_indices: { game_index: number; version: PokeAPIReference }[];
  height: number;
  held_items: {
    item: PokeAPIReference;
    version_details: { rarity: number; verison: PokeAPIReference };
  }[];
  id: number;
  is_default: boolean;
  location_area_encounters: string;
  moves: {
    move: PokeAPIReference;
    version_group_details: {
      level_learned_at: number;
      move_learn_method: PokeAPIReference;
    }[];
  }[];
  name: string;
  order: number;
  past_types: {
    generation: PokeAPIReference;
    types: { slot: number; type: PokeAPIReference }[];
  }[];
  species: PokeAPIReference;
  sprites: {
    back_default: string;
    back_female: string | null;
    back_shiny: string;
    back_shiny_female: string | null;
    front_default: string;
    front_female: string | null;
    front_shiny: string;
    front_shiny_female: string | null;
    other: {
      dream_world: {
        front_default: string;
        front_female: string | null;
      };
      home: {
        front_default: string;
        front_female: string | null;
        front_shiny: string;
        front_shiny_female: string | null;
      };
      "official-artwork": {
        front_default: string;
        front_shiny: string;
      };
    };
  };
  stats: { base_stat: number; effort: number; stat: PokeAPIReference }[];
  types: { slot: number; type: PokeAPIReference }[];
  weight: number;
};

export default async function seed(
  database: Awaited<ReturnType<typeof createDatabase<Schema>>>
) {
  /** if `pokemon` is fully populated exit early */
  if ((await database.readMany("pokemon")).length === settings.pokemon.limit) {
    return;
  }

  /** get all of the generation 1 `pokemon` */
  const response = (await (
    await fetch(
      `https://pokeapi.co/api/v2/pokemon?limit=${settings.pokemon.limit}`
    )
  ).json()) as PokeAPIResponse;

  /** iterate over each entry and fetch the inidividual `pokemon` by `id` */
  for await (const [index, { url }] of response.results.entries()) {
    console.log(
      `preparing ${index + 1} of ${response.results.length} pokemon...`
    );
    const pokemon = (await (await fetch(url)).json()) as PokeAPIPokemonResponse;

    /** transform each `pokemon` to satisfy the given `schema` */
    await database.create("pokemon", pokemon.id, {
      artwork: {
        default: `/assets/pokemon/default/${pokemon.id}.png`,
        shiny: `/assets/pokemon/shiny/${pokemon.id}.png`,
      },
      base_experience: pokemon.base_experience,
      height: pokemon.height,
      id: pokemon.id,
      name: pokemon.name,
      stats: pokemon.stats.reduce((acc, { base_stat, stat }) => {
        acc[stat.name] = base_stat;

        return acc;
      }, {} as Schema["pokemon"][number]["stats"]),
      types: pokemon.types.map(
        ({ type }) => type.name
      ) as Schema["pokemon"][number]["types"],
      weight: pokemon.weight,
    });

    /** populate empty `votes_per_pokemon` for each `pokemon` */
    await database.create("votes_per_pokemon", pokemon.id, {
      allstar: [],
      favorite: [],
      infamous: [],
      versatile: [],
    });
  }

  ["allstar", "infamous", "favorite", "versatile"];

  await database.create("votes", "allstar", []);
}
