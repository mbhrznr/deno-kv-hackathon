import { serveDir } from "deno/http/file_server.ts";

import settings from "app/settings.json" assert { type: "json" };

/** helper fn to handle `static` responses */
export default function (request: Request) {
  return serveDir(request, {
    fsRoot: "static",
    headers: [`cache-control: public, max-age=${settings.cache.age}`],
    quiet: true,
    urlRoot: "static",
  });
}
