import Logo from "app/components/logo/logo.tsx";
import Icon from "app/components/icon/icon.tsx";

import { User } from "app/types/user.ts";

type Props = {
  pathname: string;
  user: User | null;
};

const Header = (({ user, pathname }) => {
  const routes = ["pokemon", "leaderboard"];

  return (
    <header>
      <nav aria-label="main-menu">
        <a aria-current={pathname === "/"} href="/" title="goto home">
          <Logo />
        </a>
        <ul>
          {routes.map((r) => (
            <li>
              <a aria-current={pathname.startsWith(`/${r}`)} href={`/${r}`}>
                {r}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {user ? (
        <a href="/me" title="goto user">
          <img
            alt={`avatar for github user ${user.login}`}
            src={`/assets/github/${user.id}`}
          />
        </a>
      ) : (
        <a href="/api/auth/signin" title="sign in with github">
          <Icon misc="github" size="small" />
        </a>
      )}
    </header>
  );
}) satisfies FC<Props>;

export default Header;
