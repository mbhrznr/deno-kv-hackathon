import { handleCallback } from "deno/x/kv_oauth/mod.ts";

import client from "app/lib/oauth-client.ts";

import type { GitHubUser, User } from "app/types/user.ts";
import type { Handler } from "ixalan/types/handler.ts";

const handler = {
  get: async (request, context) => {
    const { response, tokens, sessionId } = await handleCallback(
      request,
      client
    );

    const headers = {
      authorization: `token ${tokens.accessToken}`,
    };
    const github = (await (
      await fetch("https://api.github.com/user", { headers })
    ).json()) as GitHubUser;
    const user = {
      id: github.id,
      login: github.login,
      name: github.name,
      url: github.html_url,
    } satisfies User;

    await context.database.create("users", user.id, user);
    await context.database.create("sessions", sessionId, user);

    return response;
  },
} satisfies Handler;

export default handler;
