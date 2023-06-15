import type { Context } from "app/types/context.ts";
import type { Awaitable } from "ixalan/types/awaitable.ts";

export type ActionFunction = (
  request: Request,
  context: Context
) => Awaitable<Record<string, unknown> | Response>;

export type LoadFunction = (
  request: Request,
  context: Context
) => Awaitable<Record<string, unknown>>;

export type PageProps<
  L extends LoadFunction | never = never,
  A extends ActionFunction | never = never
> = {
  action?: Awaited<ReturnType<A>>;
  load: Awaited<ReturnType<L>>;
};
