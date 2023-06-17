import { getSessionId, signOut } from "deno/x/kv_oauth/mod.ts";

import redirect from "ixalan/responses/redirect.ts";

import type { Handler } from "ixalan/types/handler.ts";

const handler = {
  get: async (request, context) => {
    const session = await getSessionId(request);

    if (session) {
      await context.database.delete("sessions", session);
    }

    const response = redirect("/");

    await signOut(request);

    return response;
  },
} satisfies Handler;

export default handler;
