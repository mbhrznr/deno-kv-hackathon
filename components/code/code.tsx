import settings from "app/settings.json" assert { type: "json" };

type Props = {
  code: number | string;
};

const Code = (({ code }) => {
  return (
    <code>
      #{code.toString().padStart(String(settings.pokemon.limit).length, "0")}
    </code>
  );
}) satisfies VFC<Props>;

export default Code;
