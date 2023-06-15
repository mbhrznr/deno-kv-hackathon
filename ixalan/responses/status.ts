import { Status } from "deno/http/http_status.ts";

/** helper fn to handle `status` responses */
export default function status(init: ResponseInit = { status: Status.OK }) {
  return new Response(null, init);
}

export type StatusFunction = typeof status;
