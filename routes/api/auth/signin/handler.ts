import { signIn } from "deno/x/kv_oauth/mod.ts";

import client from "app/lib/oauth-client.ts";

import type { Handler } from "ixalan/types/handler.ts";

const handler = {
  get: async (request) => {
    return await signIn(request, client);
  },
} satisfies Handler;

export default handler;
