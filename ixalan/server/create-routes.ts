import type { Manifest } from "app/server/manifest.ts";
import type { Overrides } from "app/server/overrides.ts";

export default function createRoutes(manifest: Manifest, overrides: Overrides) {
  return { ...manifest, ...overrides };
}
