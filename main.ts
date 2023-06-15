import { serve } from "deno/http/server.ts";

import seed from "app/lib/seed-database.ts";

import overrides from "app/server/overrides.ts";

import createDatabase from "ixalan/server/create-database.ts";
import createManifest from "ixalan/server/create-manifest.ts";
import createRouter from "ixalan/server/create-router.ts";
import createRoutes from "ixalan/server/create-routes.ts";

import type { Schema } from "app/types/schema.ts";

const port = 8080;

/** create the server `context` */
const database = await createDatabase<Schema>();
const manifest = await createManifest();
const routes = createRoutes(manifest, overrides);

/** seed the database if needed */
await seed(database);

/** create the `router` */
const router = createRouter({ database, routes });

/** serve any incoming requests */
await serve(router, { port });
