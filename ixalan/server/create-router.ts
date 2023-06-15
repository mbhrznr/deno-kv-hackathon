import { Status } from "deno/http/http_status.ts";

/** @todo: this should be moved into dedicated `error.tsx` routes once supported */
import Error from "app/components/error/error.tsx";
/** @todo: this should be moved into dedicated `layout.tsx` routes once supported */
import Layout, { load as layoutLoad } from "app/components/layout/layout.tsx";

import error from "ixalan/responses/error.ts";
import html from "ixalan/responses/html.ts";

import type { Context } from "app/types/context.ts";
import type { Handler } from "ixalan/types/handler.ts";
import type { Method } from "ixalan/types/method.ts";
import type {
  ActionFunction,
  LoadFunction,
  PageProps,
} from "ixalan/types/page.ts";

/**
 * creates `router` which returns a handler for `serve`.
 * the available `routes` are the merged result of `manifest` and `overrides`
 */
export default function createRouter(context: Context) {
  /** descruture `routes` */
  const { routes } = context;

  /** create `urlpattern` for each available route. */
  const patterns: URLPattern[] = Object.keys(routes).map(
    (route: string): URLPattern => new URLPattern({ pathname: route })
  );

  return async function (request: Request) {
    const { origin, pathname } = new URL(request.url);
    const method = request.method.toLowerCase() as Method;

    /** catch `favicon.ico`. */
    if (pathname === "/favicon.ico") {
      return routes["/static/*"].static.default(
        new Request(new URL("/static/xln.svg", origin))
      );
    }

    /** catch `robots.txt`. */
    if (pathname === "/robots.txt") {
      return routes["/static/*"].static.default(
        new Request(new URL("/static/robots.txt", origin))
      );
    }

    /** find the matching route */
    const route: URLPattern | undefined =
      patterns.find((pattern) => pattern.pathname === pathname) ??
      patterns.find((pattern) => pattern.test(request.url));

    if (route) {
      const pathname = route.pathname;

      try {
        /** handle static. */
        if (pathname === "/static/*") {
          return routes["/static/*"].static.default(request);
        }

        /** @ts-ignore cannot dynamically derive route specs */
        const { handler, page } = routes[pathname];

        /** handle handler */
        if (handler?.default) {
          const h = handler?.default as Handler;
          if (h?.[method]) {
            /** handle handler method. */
            return await h[method]!(request, context);
          }

          /** handle non-existent handler method w/ 405. */
          return error({
            headers: {
              allow: Object.keys(h).join(),
            },
            status: Status.MethodNotAllowed,
            statusText: "method not allowed.",
          });
        }

        /** handle page */
        if (page?.default) {
          const pa = page?.action as ActionFunction;
          const pl = page?.load as LoadFunction;
          const p = page?.default as VFC<PageProps<typeof pl, typeof pa>>;

          /** per default only `get` and (potentially) `post` are supported */
          const allow = ["get", !!pa && "post"].filter(Boolean).join();

          switch (method) {
            case "get":
              return html(
                /** @todo: this should be moved into dedicated `layout.tsx` routes once supported */
                Layout({
                  load: await layoutLoad(request, context),
                  children: [p?.({ load: await pl?.(request, context) })],
                })
              );
            case "post":
              return html(
                /** @todo: this should be moved into dedicated `layout.tsx` routes once supported */
                Layout({
                  load: await layoutLoad(request, context),
                  children: [
                    p?.({
                      action: await pa?.(request, context),
                      load: await pl?.(request, context),
                    }),
                  ],
                })
              );
            default:
              return error({
                headers: {
                  allow,
                },
                status: Status.MethodNotAllowed,
                statusText: "method not allowed.",
              });
          }
        }
      } catch (err) {
        if (
          err.status >= 400 &&
          request.headers.get("accept")?.includes("text/html")
        ) {
          /** @todo this should be moved into dedicated `error.tsx` routes once supported */
          /** @todo: this should be moved into dedicated `layout.tsx` routes once supported */
          const p =
            err instanceof Response
              ? { status: err.status, statusText: err?.statusText }
              : {
                  status: err?.status ?? Status.InternalServerError,
                  statusText:
                    err?.message?.toLowerCase ?? "something went wrong.",
                };

          return html(
            /** @todo: this should be moved into dedicated `layout.tsx` routes once supported */
            Layout({
              load: await layoutLoad(request, context),
              children: [Error(p)],
            })
          );
        }

        /** `redirect` gets thrown */
        if (err instanceof Response) {
          return err;
        }

        /** otherwise try to use `error` response */
        return error({
          status: err?.status ?? Status.InternalServerError,
          statusText: err?.message?.toLowerCase ?? "something went wrong.",
        });
      }
    }

    return error({ status: Status.NotFound, statusText: "not found." });
  };
}
