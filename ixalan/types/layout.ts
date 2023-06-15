import type { Context } from "app/types/context.ts";
import type { Awaitable } from "ixalan/types/awaitable.ts";

export type LoadFunction = (
  request: Request,
  context: Context
) => Awaitable<Record<string, unknown>>;

export type LayoutProps<
  L extends LoadFunction | never = never,
  P extends Record<string, unknown> | never = never
> = {
  load: Awaited<ReturnType<L>>;
} & P;
