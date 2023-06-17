import { getSessionId } from "deno/x/kv_oauth/mod.ts";

import createDatabase from "ixalan/server/create-database.ts";

import type { Schema } from "app/types/schema.ts";

export default async function getUser(
  request: Request,
  database: Awaited<ReturnType<typeof createDatabase<Schema>>>
) {
  const session = await getSessionId(request);

  if (session) {
    const user = await database.read("sessions", session);
    return user;
  }

  return null;
}
