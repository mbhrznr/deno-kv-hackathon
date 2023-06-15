import css from "ixalan/jsx-runtime/css.ts";

type Props = {
  status: number;
  statusText?: string;
};

const Error = (({ status, statusText }) => {
  const styles = css`
    main {
      align-self: center;
      flex: unset;
      text-align: center;
    }
  `;

  return (
    <>
      <main>
        <section>
          <h1>{status}</h1>
          {statusText && <p>{statusText}</p>}
        </section>
        <section>
          <img alt="missing no" src="/static/missing-no.png" height={200} />
        </section>
      </main>
      <style>{styles}</style>
    </>
  );
}) satisfies VFC<Props>;

export default Error;
