import { Status } from "deno/http/http_status.ts";

import settings from "app/settings.json" assert { type: "json" };
import getUser from "app/lib/get-user.ts";
import error from "ixalan/responses/error.ts";
import json from "ixalan/responses/json.ts";

import type { Handler } from "ixalan/types/handler.ts";

function chance(n: number): boolean {
  return Math.floor(Math.random() * n) + 1 === 1;
}

const handler = {
  get: async (request, context) => {
    const { origin } = new URL(request.url);
    const pattern = new URLPattern("{/api}?/pokemon/:pokemon", origin);
    const groups = pattern.exec(request.url)?.pathname.groups;

    if (!groups?.pokemon) {
      throw error({
        status: Status.BadRequest,
        statusText: "url at `/pokemon/:pokemon` invalid",
      });
    }

    if (+groups.pokemon > settings.pokemon.limit) {
      throw error({
        status: Status.NotImplemented,
        statusText: `currently only the first ${settings.pokemon.limit} pokemon are supported!`,
      });
    }

    const user = await getUser(request, context.database);
    const pokemon = await context.database.read("pokemon", +groups.pokemon);
    const votes = await context.database.read("votes", +groups.pokemon);
    const type: "default" | "shiny" = chance(settings.pokemon.shiny)
      ? "shiny"
      : "default";

    if (!pokemon || !votes) {
      throw error({ status: Status.NotFound, statusText: "pokemon not found" });
    }

    if (user && type === "shiny") {
      const shiny = await context.database.read("shiny_encounters", pokemon.id);

      await context.database.update("shiny_encounters", pokemon.id, [
        ...new Set([...(shiny ?? []), user.id]),
      ]);
    }

    return json({ pokemon, type, votes });
  },
} satisfies Handler;

export default handler;
