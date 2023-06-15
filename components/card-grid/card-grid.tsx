const CardGrid = (({ children }) => {
  return <ul className="card-grid">{children}</ul>;
}) satisfies FC;

export default CardGrid;
