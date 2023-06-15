import * as $h0 from "app/proxies/assets/github.ts";
import * as $h1 from "app/proxies/assets/pokemon.ts";

const overrides = {
  "/assets/github/*": { handler: $h0 },
  "/assets/pokemon/*": { handler: $h1 },
} as const;

export type Overrides = typeof overrides;
export default overrides;
