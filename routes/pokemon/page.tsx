import Card from "app/components/card/card.tsx";
import CardGrid from "app/components/card-grid/card-grid.tsx";
import Pagination from "app/components/pagination/pagination.tsx";
import Search from "app/components/search/search.tsx";

import type { LoadFunction, PageProps } from "ixalan/types/page.ts";

export const load = (async (request, context) => {
  const query = new URL(request.url).searchParams.get("query");
  const response = await context.routes["/api/search"].handler.default.get(
    request,
    context
  );
  const json = await response.json();

  return { ...json, query };
}) satisfies LoadFunction;

const Page = (({ load: { limit, page, pages, pokemon, query } }) => {
  const queries = [
    "mew",
    "name:saur",
    "stats.hp>=100 stats.attack>=120",
    "type:fire type:flying",
    "weight>=69 type:grass",
    "zap type:electric",
  ];

  return (
    <main>
      <section>
        <h1>pokemon search</h1>

        <Search
          placeholder={queries[Math.floor(Math.random() * queries.length)]}
          query={query ?? ""}
        />

        <CardGrid>
          {pokemon.map((pokemon) => (
            <Card pokemon={pokemon} />
          ))}
        </CardGrid>

        <Pagination
          base="/pokemon"
          limit={limit}
          page={page}
          pages={pages}
          query={query ?? ""}
        />
      </section>
    </main>
  );
}) satisfies VFC<PageProps<typeof load>>;

export default Page;
