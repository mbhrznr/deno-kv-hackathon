import settings from "app/settings.json" assert { type: "json" };

type Props = {
  base: string;
  limit: number;
  page: number;
  pages: number;
  query: string;
};

function range(array: number[], current: number, range: number): number[] {
  const index = array.indexOf(current);
  const start = Math.max(0, index - range);
  const end = Math.min(array.length - 1, index + range);

  return array.slice(start, end + 1);
}

const Pagination = (({ base, limit, page, pages, query }) => {
  const params = (page: number) =>
    [
      query && `query=${query}`,
      limit && `limit=${limit}`,
      page && `page=${page}`,
    ]
      .filter(Boolean)
      .join("&");

  const links = range(
    Array.from({ length: pages }).map((_, index) => index + 1),
    page,
    settings.paginiation.links
  );

  return (
    <nav role="navigation" aria-label="pagination">
      <ul>
        {links.map((value) => (
          <li>
            <a
              aria-current={value === page}
              aria-label={`go to page ${value}`}
              href={`${base}?${params(value)}`}
            >
              {value}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}) satisfies VFC<Props>;

export default Pagination;
