import settings from "app/settings.json" assert { type: "json" };
import json from "ixalan/responses/json.ts";

import type { Schema } from "app/types/schema.ts";
import type { Handler } from "ixalan/types/handler.ts";

function nested(pokemon: Schema["pokemon"][number], property: string) {
  return (
    // @ts-ignore: this is fine. only a property of a pokemon gets back.
    property
      .split(".")
      .reduce(
        (p, c) => p?.[c as keyof typeof pokemon] as keyof typeof pokemon,
        pokemon
      )
  );
}

function paginate(
  pokemon: Schema["pokemon"][number][],
  page: number,
  limit: number
) {
  const offset = limit * (page - 1);
  const pages = Math.ceil(pokemon.length / limit);
  const paginated = pokemon.slice(offset, page * limit);

  return {
    limit,
    page,
    pages,
    pokemon: paginated,
    previous: page - 1 ? page - 1 : null,
    next: pages > page ? page + 1 : null,
    total: pokemon.length,
  };
}

function filter(
  pokemon: Schema["pokemon"][number][],
  filters: { property: string; operator: string; value: string }[]
) {
  return pokemon.filter((p) => {
    return filters.every(({ operator, property, value }) => {
      switch (true) {
        case property === "id" && (operator === ":" || operator === "="):
          return p.id === +value;
        case property === "name" && operator === ":":
          return p.name.includes(value);
        case property === "type" && operator === ":":
          return p.types.includes(
            value as Schema["pokemon"][number]["types"][number]
          );
        case operator === ":":
          return nested(p, property) === value;
        case operator === ">":
          return +nested(p, property) > +value;
        case operator === "<":
          return +nested(p, property) < +value;
        case operator === ">=":
          return +nested(p, property) >= +value;
        case operator === "<=":
          return +nested(p, property) <= +value;
        case operator === "=":
          return nested(p, property) === value;
        default:
          return false;
      }
    });
  });
}

const handler = {
  get: async (request, context) => {
    const params = new URL(request.url).searchParams;
    const limit = params.get("limit");
    const page = params.get("page");
    const query = params.get("query");
    const pokemon = await context.database.readMany("pokemon");

    if (!query) {
      return json(
        paginate(pokemon, +(page ?? 1), +(limit ?? settings.paginiation.limit))
      );
    }

    const regex =
      /((?<property>(\w|\.)+)(?<operator>[><=:]+)(?<value>\w+)|(?<name>\w+))/g;
    const matches = [...query.matchAll(regex)];
    const filters = matches.reduce((acc, val) => {
      if (!val.groups) {
        return acc;
      }

      const { name, operator, property, value } = val.groups;

      if (name != null) {
        acc.push({ property: "name", operator: ":", value: val.groups.name });
      }

      if (operator != null && property != null && value != null) {
        acc.push({ property, operator, value });
      }

      return acc;
    }, [] as { property: string; operator: string; value: string }[]);

    return json(
      paginate(
        filter(pokemon, filters),
        +(page ?? 1),
        +(limit ?? settings.paginiation.limit)
      )
    );
  },
} satisfies Handler;

export default handler;
