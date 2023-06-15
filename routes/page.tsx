import { setCookie, getCookies } from "deno/http/cookie.ts";

import css from "ixalan/jsx-runtime/css.ts";
import redirect from "ixalan/responses/redirect.ts";

import type {
  ActionFunction,
  LoadFunction,
  PageProps,
} from "ixalan/types/page.ts";

export const load = ((request) => {
  const cookies = getCookies(request.headers);

  if (cookies["dont-show-home"] === "true") {
    throw redirect("/pokemon");
  }

  return {};
}) satisfies LoadFunction;

export const action = (async (request) => {
  const data = await request.formData();
  const confirmation = data.get("confirmation");
  const response = redirect("/pokemon");

  if (confirmation === "on") {
    setCookie(response.headers, { name: "dont-show-home", value: "true" });
    throw response;
  }

  return {};
}) satisfies ActionFunction;

const Page = (() => {
  const styles = css`
    * {
      line-height: 1.4;
    }

    h1 a,
    h2 a,
    h3 a,
    code a {
      text-decoration: none;
    }

    code {
      font-size: 1rem;
    }
  `;

  return (
    <>
      <main>
        <h1>
          <a href="#deno-kv-hackathon">deno kv hackathon!</a>
        </h1>
        <h2>
          <a href="#project-introduction">project introduction</a>
        </h2>
        <p>
          this project has been build during the first official{" "}
          <a
            href="https://deno.com/blog/deno-kv-hackathon"
            rel="noopener"
            target="_blank"
          >
            deno kv hackathon
          </a>
          .
        </p>
        <p>
          it uses a (very experimental) framework named <code>ixalan</code>,
          which i've been working on in my spare time. at it's core
          <code>ixalan</code> only uses <code>deno</code>'s standard library,
          while also providing a file-based <code>router</code>, route{" "}
          <code>overrides</code> and a custom <code>jsx-runtime</code>, which is
          currently only used as a templating engine.
        </p>
        <p>
          for a clear separation <code>ixalan</code> and <code>app</code> have
          their dedicated sections in the overall project structure.
        </p>
        <p>
          even though some existing code has been used, some major rewrites for
          the framework have happened during the hackathon, whereas everything
          from <code>app</code> has been written from scratch.
        </p>

        <h3>
          <a href="#deno-kv">deno kv</a>
        </h3>
        <p>
          <code>deno kv</code> is the project's primary data source. there's a
          thin wrapper around kv with crud operations and a <code>schema</code>{" "}
          is passed to the <code>create database</code> function to enforce
          type-safety. on server startup a lookup is happening to potentially
          seed the database. the underlying data is provided via{" "}
          <a href="https://pokeapi.co/" target="_blank" rel="noopener">
            pokeapi
          </a>
          . for authentication{" "}
          <code>
            <a
              href="https://github.com/denoland/deno_kv_oauth"
              target="_blank"
              rel="noopener"
            >
              deno kv auth
            </a>
          </code>{" "}
          has been chosen, which is the project's only dependency apart from
          deno's excellent standard library.
        </p>

        <h2>
          <a href="#project-idea">project idea</a>
        </h2>
        <p>
          on the project there are two primary routes. there's{" "}
          <code>
            <a href="/pokemon">/pokemon</a>
          </code>{" "}
          and there's{" "}
          <code>
            <a href="/leaderboard">/leaderboard</a>
          </code>
          .
        </p>
        <p>
          <code>
            <a href="/pokemon">/pokemon</a>
          </code>{" "}
          provides a paginates search, which is fed by <code>deno kv</code>.
          each of the results link to a pokemon via it's id. the search is also
          capable of handling pokemon properties, so that queries such as{" "}
          <strong>"type:fire type:flying"</strong> or{" "}
          <strong>"zap type:electric"</strong> are possible.
        </p>

        <p>
          on the individual <code>/pokemon/:id</code> routes, there's a
          minimalistic entry to the individual pokemon. underneath there are
          four buttons: <strong>allstar</strong>, <strong>favorite</strong>,{" "}
          <strong>infamous</strong> and <strong>versatile</strong>. each logged
          in user has the chance participate in the voting!
        </p>

        <p>
          the results can be seen on <code>/leaderboard</code>, where some
          simple filter options and aggregations are available. on the go live
          there's also a hidden feature, which has to be unlocked by the
          community!
        </p>

        <br />
        <br />

        <form method="post">
          <div>
            <input id="confirmation" name="confirmation" type="checkbox" />
            <label htmlFor="confirmation">don't show this page again.</label>
          </div>
          <button type="submit">submit</button>
        </form>
      </main>
      <style>{styles}</style>
    </>
  );
}) satisfies VFC<PageProps<typeof load, typeof action>>;

export default Page;
