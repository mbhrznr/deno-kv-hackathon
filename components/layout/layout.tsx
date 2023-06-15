import Footer from "app/components/footer/footer.tsx";
import Header from "app/components/header/header.tsx";
import getUser from "app/lib/get-user.ts";

import type { LayoutProps, LoadFunction } from "ixalan/types/layout.ts";

type Props = {
  links?: HTML<"link">[];
  meta?: HTML<"meta">[];
  scripts?: HTML<"script">[];
  styles?: HTML<"style">[];
  title?: string;
};

export const load = (async (request, context) => {
  const { pathname } = new URL(request.url);
  const user = await getUser(request, context.database);

  return { pathname, user };
}) satisfies LoadFunction;

const Layout = (({
  children,
  load: { pathname, user },
  title = "deno kv hackathon",
}) => {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/static/xln.svg" />
        <link rel="stylesheet" href="/static/styles/global.css" />
        <link rel="stylesheet" href="/static/styles/variables.css" />

        <meta name="description" content="ixalan" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        <title>{title}</title>
      </head>

      <body>
        <Header pathname={pathname} user={user} />
        {children}
        <Footer />
      </body>
    </html>
  );
}) satisfies FC<LayoutProps<typeof load, Props>>;

export default Layout;
