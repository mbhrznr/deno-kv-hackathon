import { Status } from "deno/http/http_status.ts";

/** helper fn to handle `error` responses */
export default function error(
  init: ResponseInit = { status: Status.InternalServerError }
) {
  return new Response(null, init);
}

export type ErrorFunction = typeof error;
