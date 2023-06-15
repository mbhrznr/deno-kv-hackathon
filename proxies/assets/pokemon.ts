import { Status } from "deno/http/http_status.ts";

import settings from "app/settings.json" assert { type: "json" };
import error from "ixalan/responses/error.ts";

import type { Handler } from "ixalan/types/handler.ts";

const handler = {
  get: async (request) => {
    const { origin } = new URL(request.url);
    const pattern = new URLPattern("/assets/pokemon/:type/:id.png", origin);
    const groups = pattern.exec(request.url)?.pathname.groups;

    if (!groups?.type || !groups?.id) {
      throw error({
        status: Status.BadRequest,
        statusText: "url at `/assets/pokemon/:type/:id.png` is invalid",
      });
    }

    const response = await fetch(
      [
        `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork`,
        groups?.type === `shiny` && `shiny`,
        `${groups.id}.png`,
      ]
        .filter(Boolean)
        .join("/")
    );

    return new Response(response.body, {
      headers: {
        "cache-control": `public, max-age=${settings.cache.age}`,
      },
    });
  },
} satisfies Handler;

export default handler;
