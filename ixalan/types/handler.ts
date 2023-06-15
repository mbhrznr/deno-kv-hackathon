import type { Context } from "app/types/context.ts";
import type { Awaitable } from "ixalan/types/awaitable.ts";
import type { Method } from "ixalan/types/method.ts";

export type RouteFunction = (
  request: Request,
  context: Context
) => Awaitable<Response>;

export type Handler = {
  [key in Method]?: RouteFunction;
};
