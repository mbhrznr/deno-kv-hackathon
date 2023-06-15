import createDatabase from "ixalan/server/create-database.ts";
import createRoutes from "ixalan/server/create-routes.ts";

import type { Schema } from "app/types/schema.ts";

export type Context = {
  database: Awaited<ReturnType<typeof createDatabase<Schema>>>;
  routes: ReturnType<typeof createRoutes>;
};
