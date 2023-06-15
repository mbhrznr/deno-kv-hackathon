import { Status } from "deno/http/http_status.ts";

import settings from "app/settings.json" assert { type: "json" };
import error from "ixalan/responses/error.ts";

import type { Handler } from "ixalan/types/handler.ts";

const handler = {
  get: async (request) => {
    const { origin } = new URL(request.url);
    const pattern = new URLPattern("/assets/github/:user", origin);
    const groups = pattern.exec(request.url)?.pathname.groups;

    if (!groups?.user) {
      throw error({
        status: Status.BadRequest,
        statusText: "url at `/assets/github/:user` is invalid",
      });
    }

    const response = await fetch(
      [`https://avatars.githubusercontent.com/u`, groups.user]
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
