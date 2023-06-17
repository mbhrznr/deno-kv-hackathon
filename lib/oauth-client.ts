import "deno/dotenv/load.ts";
import { createGitHubOAuth2Client } from "deno/x/kv_oauth/mod.ts";

const client = createGitHubOAuth2Client();

export default client;
