import Icon from "app/components/icon/icon.tsx";
import Table from "app/components/table/table.tsx";
import css from "ixalan/jsx-runtime/css.ts";

import type { Pokemon } from "app/types/pokemon.ts";
import type { Schema } from "app/types/schema.ts";
import type { LoadFunction, PageProps } from "ixalan/types/page.ts";

function count<T>(array: T[][]): { id: T; value: number }[] {
  const occurrences = new Map<T, number>();

  for (const row of array) {
    for (const e of row) {
      if (occurrences.has(e)) {
        occurrences.set(e, occurrences.get(e)! + 1);
      } else {
        occurrences.set(e, 1);
      }
    }
  }

  return [...occurrences]
    .map(([key, value]) => ({ id: key, value }))
    .sort((a, b) => b.value - a.value);
}

const keys: (keyof Schema["votes_per_pokemon"][number])[] = [
  "allstar",
  "favorite",
  "infamous",
  "versatile",
];

export const load = (async (request, context) => {
  const params = new URL(request.url).searchParams;
  const division: "pokemon" | "users" = (params.get("division") ||
    "pokemon") as "pokemon" | "users";

  switch (division) {
    case "users": {
      const encounters = await context.database.readMany("shiny_encounters");

      if (!encounters?.length) {
        return {
          unlocked: false,
          division,
          users: [],
        };
      }

      const users = await context.database.readMany("users");

      return {
        unlocked: true,
        division,
        users: users
          .map((u) => ({
            ...u,
            score: encounters
              .filter(Boolean)
              .filter((e) => e.length)
              .reduce((acc, val) => {
                if (val.includes(u.id)) {
                  return (acc += 1);
                }
                return acc;
              }, 0),
          }))
          .sort((a, b) => b.score - a.score)
          .slice(0, 9)
          .map((u) => ({
            score: u.score,
            name: u.login,
            link: u.url,
          })),
      };
    }
    case "pokemon":
    default: {
      const key = params?.get("votes");
      const output: { link: string; name: string; score: number }[] = [];

      if (!key) {
        const votes = await context.database.readMany("votes");
        const values = count(votes).splice(0, 10);

        for await (const { id, value } of values) {
          const pokemon = await context.database.read("pokemon", id);

          output.push({
            score: value,
            name: pokemon?.name!,
            link: `/pokemon/${id}`,
          });
        }

        return {
          unlocked: true,
          division,
          votes: key,
          pokemon: output,
        };
      }

      const votes = await context.database.read(
        "votes",
        key as keyof Schema["votes"]
      );
      const values = count([votes ?? []]).splice(0, 10);

      for await (const { id, value } of values) {
        const pokemon = await context.database.read("pokemon", id);

        output.push({
          score: value,
          name: pokemon?.name!,
          link: `/pokemon/${id}`,
        });
      }

      return {
        unlocked: true,
        division,
        pokemon: output,
      };
    }
  }
}) satisfies LoadFunction;

const Page = (({ load: { division, pokemon, unlocked, users, votes } }) => {
  const styles = css`
    main {
      align-self: center;
      text-align: center;
    }

    main section {
      align-items: center;
      display: inline-flex;
      flex-direction: column;
      margin: 0 auto 2rem;
      max-width: var(--theme-max-leaderboard-width);
      position: relative;
      text-align: center;
      width: 100%;
    }

    main section[aria-label="selection"] button {
      width: 7rem;
    }

    main section[aria-label="selection"],
    main section[aria-label="filter"] form > div {
      display: flex;
      flex-direction: row;
      gap: 2rem;
      justify-content: center;
      margin-bottom: 1rem;
    }
    main section[aria-label="filter"] form > div > div {
      height: 3rem;
      position: relative;
      width: 3rem;
    }

    main section[aria-label="filter"] form input[type="radio"] {
      appearance: none;
      border-radius: 50%;
      height: 3rem;
      left: 0;
      margin: 0;
      position: absolute;
      width: 3rem;
    }

    main section[aria-label="filter"] form label {
      align-items: center;
      display: flex;
      height: 3rem;
      justify-content: center;
      position: relative;
      width: 3rem;
    }
  `;

  return (
    <>
      <main>
        <h1>leaderboard</h1>

        <section aria-label="selection">
          <form method="get">
            <input type="hidden" name="division" value="pokemon" />
            <button type="submit">pokemon</button>
          </form>
          <form method="get">
            <input type="hidden" name="division" value="users" />
            <button>users</button>
          </form>
        </section>

        {unlocked && division === "pokemon" && (
          <section aria-label="filter">
            <form method="get">
              <div>
                {keys.map((v) => {
                  const props: HTML<"input"> = {
                    id: v,
                    name: "votes",
                    type: "radio",
                    value: v,
                  };

                  if (votes === v) {
                    props.checked = true;
                  }

                  return (
                    <div>
                      <input {...props} />
                      <label htmlFor={v}>
                        <Icon vote={v} size="small" />
                      </label>
                    </div>
                  );
                })}
              </div>
              <input type="hidden" name="division" value={division} />
              <button type="submit">apply filters</button>
            </form>
          </section>
        )}

        {unlocked && division === "users" && (
          <section aria-label="congratulations">
            <h2>congratulations on unlocking the users division!</h2>
            <Icon misc="shiny" size="medium" />
          </section>
        )}

        {unlocked ? (
          <section aria-label="division">
            <Table rows={division === "users" ? users ?? [] : pokemon ?? []} />
          </section>
        ) : (
          <section aria-label="locked-feature">
            <Icon misc="question" size="medium" />
            <h1>huh, this feature is still locked?!</h1>
            <p>
              once the first user unveils the secret this division will be
              opened.
            </p>
          </section>
        )}
      </main>
      <style>{styles}</style>
    </>
  );
}) satisfies VFC<PageProps<typeof load>>;

export default Page;
