import getUser from "app/lib/get-user.ts";
import css from "ixalan/jsx-runtime/css.ts";

import type { LoadFunction, PageProps } from "ixalan/types/page.ts";

export const load = (async (request, context) => {
  const user = await getUser(request, context.database);

  return { user };
}) satisfies LoadFunction;

const Page = (({ load: { user } }) => {
  const styles = css`
    main {
      align-self: center;
      flex: unset;
      text-align: center;
    }

    main img {
      border-radius: 50%;
      height: 7.5rem;
      width: 7.5rem;
    }
  `;

  return (
    <>
      <main>
        <section>
          {user ? (
            <>
              <img
                alt={`avatar for github user ${user.login}`}
                src={`/assets/github/${user.id}`}
              />
              <p>
                you're currenlty logged in as: <strong>{user.login}</strong>
              </p>

              <a href="/api/auth/signout">sign out</a>
            </>
          ) : (
            <>
              <p>you aren't logged in at the moment.</p>
              <p>this means you cannot participate in the voting.</p>
              <p>
                to participate,{" "}
                <a href="/api/auth/signin">sign in with github</a>.
              </p>
            </>
          )}
        </section>
      </main>
      <style>{styles}</style>
    </>
  );
}) satisfies VFC<PageProps<typeof load>>;

export default Page;
