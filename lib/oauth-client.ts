import "deno/dotenv/load.ts";
import { createClient } from "deno/x/kv_oauth/mod.ts";

const client = createClient("github");

export default client;
