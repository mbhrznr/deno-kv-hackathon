import { Status } from "deno/http/http_status.ts";

/** helper fn to handle `redirect` responses */
export default function redirect(location: string, status = Status.Found) {
  return new Response(null, { headers: { location }, status });
}

export type RedirectFunction = typeof redirect;
