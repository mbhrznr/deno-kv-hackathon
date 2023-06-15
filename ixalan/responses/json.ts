import { Status } from "deno/http/http_status.ts";

interface TypedResponse<T> extends Response {
  json(): Promise<T>;
}

/** helper fn to handle `json` responses */
export default function json<T>(
  data: T,
  init: ResponseInit = { status: Status.OK }
): TypedResponse<T> {
  const headers = new Headers(init?.headers);

  if (!headers.has("content-type")) {
    headers.set("content-type", "application/json; charset=utf-8");
  }

  return new Response(JSON.stringify(data), { ...init, headers });
}

export type JSONFunction = typeof json;
