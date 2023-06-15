import Icon from "app/components/icon/icon.tsx";
import css from "ixalan/jsx-runtime/css.ts";

type Props = {
  rows: { name: string; link: string; score: number }[];
};

const Table = (({ rows }) => {
  const styles = css`
    .ribbon {
      width: 105%;
      height: 5.5rem;
      background-color: #444;
      position: absolute;
      left: -2.5%;
      box-shadow: var(--theme-shadow);
    }

    .ribbon::before {
      content: "";
      height: 1.5rem;
      width: 1.5rem;
      bottom: -0.8rem;
      left: 0.35rem;
      transform: rotate(45deg);
      background-color: #444;
      position: absolute;
      z-index: -1;
    }

    .ribbon::after {
      content: "";
      height: 1.5rem;
      width: 1.5rem;
      bottom: -0.8rem;
      right: 0.35rem;
      transform: rotate(45deg);
      background-color: #444;
      position: absolute;
      z-index: -1;
    }

    table {
      background: white;
      border-collapse: collapse;
      border-radius: 0.25rem;
      box-shadow: var(--theme-shadow);
      font-weight: 400;
      table-layout: fixed;
      width: 100%;
    }

    table a {
      color: inherit;
      text-decoration: none;
    }

    table tr {
      color: #444;
      font-size: 1.4rem;
      height: 5.5rem;
      padding: 1rem 2rem;
      position: relative;
    }

    table tr:nth-child(odd) {
      background-color: #f9f9f9;
    }

    table tr:nth-child(1) {
      background-color: transparent;
      color: #fff;
    }

    table td {
      font-size: 1.4rem;
      padding: 1rem 1rem;
    }

    table td .icon.medium {
      border-radius: 50%;
      background-color: white;
      height: auto;
      overflow: hidden;
      padding: 0.25rem;
    }

    table .score {
      align-items: center;
      display: flex;
      gap: 2rem;
      justify-content: flex-end;
      height: 5.5rem;
    }
  `;

  return rows.length ? (
    <>
      <div className="ribbon" />
      <table>
        {rows.map(({ name, link, score }, index) => {
          return (
            <tr>
              <td className="rank">{index + 1}</td>
              <td className="name">
                <a href={link}>{name}</a>
              </td>
              <td className="score">
                {String(score)}
                {index === 0 && <Icon misc="medal" size="medium" />}
              </td>
            </tr>
          );
        })}
      </table>
      <style>{styles}</style>
    </>
  ) : (
    <></>
  );
}) satisfies FC<Props>;

export default Table;
