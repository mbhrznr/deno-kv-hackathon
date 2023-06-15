import { Status } from "deno/http/http_status.ts";

import render from "ixalan/jsx-runtime/render.ts";

/** helper fn to handle `html`'s response `body` */
function body<T extends string | JSX.Element>(data: T): BodyInit | undefined {
  switch (typeof data) {
    case "object":
      return render(data as JSX.Element);
    case "string":
      return data as string;
    default:
      return;
  }
}

/** helper fn to handle `html` responses */
export default function html<T extends string | JSX.Element>(
  data: T,
  init: ResponseInit = { status: Status.OK }
): Response {
  const headers = new Headers(init?.headers);

  headers.set("content-type", "text/html; charset=utf-8");

  return new Response(body(data), { ...init, headers });
}

export type HTMLFunction = typeof html;
