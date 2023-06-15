import { Status } from "deno/http/http_status.ts";

import settings from "app/settings.json" assert { type: "json" };
import Code from "app/components/code/code.tsx";
import Icon from "app/components/icon/icon.tsx";
import Picture from "app/components/picture/picture.tsx";
import Votes from "app/components/votes/votes.tsx";
import getUser from "app/lib/get-user.ts";
import css from "ixalan/jsx-runtime/css.ts";
import error from "ixalan/responses/error.ts";

import type { Schema } from "app/types/schema.ts";
import type {
  ActionFunction,
  LoadFunction,
  PageProps,
} from "ixalan/types/page.ts";

export const load = (async (request, context) => {
  const response = await context.routes[
    "/api/pokemon/:pokemon"
  ].handler.default.get(request, context);
  const json = await response.json();
  const user = await getUser(request, context.database);
  const encounters = await context.database.read(
    "shiny_encounters",
    json.pokemon.id
  );

  return { ...json, user, shiny: !!encounters?.find((u) => u === user?.id) };
}) satisfies LoadFunction;

export const action = (async (request, context) => {
  const { origin } = new URL(request.url);
  const pattern = new URLPattern("/pokemon/:pokemon", origin);
  const groups = pattern.exec(request.url)?.pathname.groups;

  if (!groups?.pokemon) {
    throw error({
      status: Status.BadRequest,
      statusText: "url at `/pokemon/:pokemon` invalid",
    });
  }

  if (+groups.pokemon > settings.pokemon.limit) {
    throw error({
      status: Status.NotImplemented,
      statusText: `currently only the first ${settings.pokemon.limit} pokemons are supported!`,
    });
  }

  const data = await request.formData();
  const user = await getUser(request, context.database);

  if (!user) {
    throw error({
      status: Status.Unauthorized,
      statusText: "you need to be logged in to vote!",
    });
  }

  const key = data.get("key");
  const votes =
    (await context.database.read("votes", +groups.pokemon)) ??
    ({
      allstar: [],
      infamous: [],
      favorite: [],
      versatile: [],
    } as Schema["votes"][number]);

  if (String(key) in votes) {
    const k = String(key) as keyof Schema["votes"][number];

    await context.database.update("votes", +groups.pokemon, {
      [String(key)]: votes[k].find((u) => u === user.id)
        ? votes[k].filter((u) => u !== user.id)
        : [...votes[k], user.id],
    });
  }

  return { data };
}) satisfies ActionFunction;

const Page = (({ load: { pokemon, shiny, type, user, votes } }) => {
  const { artwork, id, name } = pokemon;
  const {
    allstar = [],
    favorite = [],
    infamous = [],
    versatile = [],
  } = votes ?? {};

  const alt = `official ${shiny ? "shiny" : type} artwork for ${name}`;
  const styles = css`
    main {
      align-self: center;
      text-align: center;
    }

    main picture {
      display: flex;
      justify-content: center;
      position: relative;
      z-index: 1;
    }

    main picture img {
      height: auto;
      width: 100%;
    }

    main section {
      align-items: center;
      display: inline-flex;
      flex-direction: column;
      margin: 0 auto;
      max-width: var(--theme-max-pokemon-width);
      position: relative;
      text-align: center;
      width: 100%;
    }

    main section[aria-label="votes"] {
      flex-direction: row;
      justify-content: center;
      gap: 2rem;
    }

    main section div {
      border: 1px solid var(--theme-border);
      border-radius: 0.5rem;
      margin-top: -25%;
      padding: 25% 7.5vw 2.5vh;
      position: relative;
      width: 100%;
    }

    main section form {
      margin-top: 2rem;
    }

    main code {
      font-size: 2rem;
      display: inline-block;
    }
  `;
  const shinystyles = css`
    main section[aria-label="pokemon"] .shiny {
      left: 0;
      margin: auto;
      padding: 0.25rem;
      position: absolute;
      right: 0;
      top: 2.5rem;
      z-index: 1;
    }
  `;

  return (
    <main>
      <section aria-label="pokemon">
        <Picture
          img={{
            alt,
            height: 475,
            src: artwork[shiny ? "shiny" : type],
            width: 475,
          }}
        />
        <div>
          {shiny && <Icon misc="shiny" size="medium" />}
          <Code code={id} />
          <h1>{name}</h1>
        </div>
      </section>

      <section aria-label="votes">
        <Votes
          allstar={{
            total: allstar.length,
            voted: !!allstar.find((u) => u === user?.id),
          }}
          infamous={{
            total: infamous.length,
            voted: !!infamous.find((u) => u === user?.id),
          }}
          favorite={{
            total: favorite.length,
            voted: !!favorite.find((u) => u === user?.id),
          }}
          versatile={{
            total: versatile.length,
            voted: !!versatile.find((u) => u === user?.id),
          }}
        />
      </section>

      <style>{styles}</style>
      {shiny && <style>{shinystyles}</style>}
    </main>
  );
}) satisfies VFC<PageProps<typeof load, typeof action>>;

export default Page;
