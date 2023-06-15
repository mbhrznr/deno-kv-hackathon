import Logo from "app/components/logo/logo.tsx";
import css from "ixalan/jsx-runtime/css.ts";

type Props = {
  placeholder: string;
  query: string;
};

const styles = css`
  .search {
    position: relative;
  }

  .search svg {
    height: 100%;
    position: absolute;
    top: 0;
    left: 0.5rem;
  }

  .search input[type="search"] {
    font-size: 1.5rem;
    padding-left: 3rem;
  }
`;

const Search = (({ placeholder, query }) => {
  return (
    <>
      <form className="search" method="get">
        <Logo />
        <input
          type="search"
          name="query"
          placeholder={placeholder}
          value={query}
        />
      </form>
      <style>{styles}</style>
    </>
  );
}) satisfies VFC<Props>;

export default Search;
