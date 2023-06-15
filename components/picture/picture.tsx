type Props = {
  img?: HTML<"img">;
  picture?: HTML<"picture">;
  sources?: HTML<"source">[];
};

const Picture = (({ img = {}, picture = {}, sources = [] }) => {
  return (
    <picture {...picture}>
      {sources.map((s) => (
        <source {...s} />
      ))}
      <img {...img} />
    </picture>
  );
}) satisfies VFC<Props>;

export default Picture;
