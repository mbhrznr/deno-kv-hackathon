import Bug from "app/components/icon/types/bug.tsx";
import Dark from "app/components/icon/types/dark.tsx";
import Dragon from "app/components/icon/types/dragon.tsx";
import Electric from "app/components/icon/types/electric.tsx";
import Fairy from "app/components/icon/types/fairy.tsx";
import Fighting from "app/components/icon/types/fighting.tsx";
import Fire from "app/components/icon/types/fire.tsx";
import Flying from "app/components/icon/types/flying.tsx";
import Ghost from "app/components/icon/types/ghost.tsx";
import Grass from "app/components/icon/types/grass.tsx";
import Ground from "app/components/icon/types/ground.tsx";
import Ice from "app/components/icon/types/ice.tsx";
import Normal from "app/components/icon/types/normal.tsx";
import Poison from "app/components/icon/types/poison.tsx";
import Psychic from "app/components/icon/types/psychic.tsx";
import Rock from "app/components/icon/types/rock.tsx";
import Steel from "app/components/icon/types/steel.tsx";
import Water from "app/components/icon/types/water.tsx";

import Deno from "app/components/icon/misc/deno.tsx";
import GitHub from "app/components/icon/misc/github.tsx";
import Medal from "app/components/icon/misc/medal.tsx";
import Question from "app/components/icon/misc/question.tsx";
import Shiny from "app/components/icon/misc/shiny.tsx";

import AllStar from "app/components/icon/votes/allstar.tsx";
import Favorite from "app/components/icon/votes/favorite.tsx";
import Infamous from "app/components/icon/votes/infamous.tsx";
import Versatile from "app/components/icon/votes/versatile.tsx";

import type { Schema } from "app/types/schema.ts";

const types = {
  bug: Bug,
  dark: Dark,
  dragon: Dragon,
  electric: Electric,
  fairy: Fairy,
  fighting: Fighting,
  fire: Fire,
  flying: Flying,
  ghost: Ghost,
  grass: Grass,
  ground: Ground,
  ice: Ice,
  normal: Normal,
  poison: Poison,
  psychic: Psychic,
  rock: Rock,
  steel: Steel,
  water: Water,
} as const;

const misc = {
  deno: Deno,
  github: GitHub,
  medal: Medal,
  question: Question,
  shiny: Shiny,
} as const;

const votes = {
  allstar: AllStar,
  favorite: Favorite,
  infamous: Infamous,
  versatile: Versatile,
} as const satisfies {
  [key in keyof Schema["votes"][number]]: () => JSX.Element;
};

type Type = { type: keyof typeof types };
type Misc = { misc: keyof typeof misc };
type Vote = { vote: keyof typeof votes };
type Props = {
  size: "small" | "medium";
} & (Type | Misc | Vote);

function get(props: Props) {
  switch (true) {
    case "type" in props:
      return {
        icon: types[(props as Type).type],
        name: (props as Type).type,
      };

    case "misc" in props:
      return {
        icon: misc[(props as Misc).misc],
        name: (props as Misc).misc,
      };

    case "vote" in props:
      return {
        icon: votes[(props as Vote).vote],
        name: (props as Vote).vote,
      };

    default:
      return {};
  }
}

const Icon = ((props) => {
  const { icon, name } = get(props);

  if (icon) {
    const className = `icon ${name} ${props.size}`;
    return (
      <i className={className} title={name}>
        {icon()}
      </i>
    );
  }

  return <></>;
}) satisfies VFC<Props>;

export default Icon;
