import json from "ixalan/responses/json.ts";

import type { Handler } from "ixalan/types/handler.ts";

const handler = {
  get: async (_, context) => {
    const pokemon = await context.database.readMany("pokemon");

    return json({ pokemon });
  },
} satisfies Handler;

export default handler;
