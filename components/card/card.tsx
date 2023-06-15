import Code from "app/components/code/code.tsx";
import Picture from "app/components/picture/picture.tsx";

import type { Schema } from "app/types/schema.ts";

type Props = {
  pokemon: Schema["pokemon"][number];
};

const Card = (({ pokemon }) => {
  const { artwork, id, name } = pokemon;
  const alt = `official artwork for ${name}`;

  return (
    <li className="card">
      <a href={`/pokemon/${pokemon.id}`}>
        <Picture
          img={{
            alt,
            src: artwork.default,
          }}
        />
        <div role="contentinfo">
          <h2>
            <br />
            {pokemon.name}
          </h2>
          <Code code={id} />
        </div>
      </a>
    </li>
  );
}) satisfies VFC<Props>;

export default Card;
