import Icon from "app/components/icon/icon.tsx";

import type { Schema } from "app/types/schema.ts";

type Props = {
  [key in keyof Schema["votes"][number]]: { total: number; voted: boolean };
};

const Votes = (({ allstar, favorite, infamous, versatile }) => {
  return (
    <>
      {Object.entries({ allstar, favorite, infamous, versatile }).map(
        ([key, { total, voted }]) => (
          <form method="post">
            <input name="key" type="hidden" value={key} />
            <button className="vote" data-voted={voted} type="submit">
              <Icon vote={key as keyof Schema["votes"][number]} size="small" />
            </button>
            <strong>{String(total)}</strong>
          </form>
        )
      )}
    </>
  );
}) satisfies VFC<Props>;

export default Votes;
