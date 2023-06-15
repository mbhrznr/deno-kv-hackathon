import css from "ixalan/jsx-runtime/css.ts";
import Icon from "app/components/icon/icon.tsx";

const Footer = (() => {
  const styles = css`
    footer {
      align-items: center;
      background: var(--theme-footer);
      bottom: 0;
      display: flex;
      gap: 1rem;
      justify-content: space-between;
      position: sticky;
    }

    footer div {
      display: flex;
      gap: 2rem;
    }

    footer a {
      border-radius: 50%;
    }
  `;

  return (
    <>
      <footer role="contentinfo">
        <p>powered by deno.</p>
        <div>
          <a
            href="https://github.com/denoland"
            rel="noopener"
            target="_blank"
            title="goto denoland's github repository"
          >
            <Icon misc="deno" size="small" />
          </a>
          <a
            href=""
            rel="noopener"
            traget="_blank"
            title="goto this project's github repository"
          >
            <Icon misc="github" size="small" />
          </a>
        </div>
      </footer>
      <style>{styles}</style>
    </>
  );
}) satisfies VFC;

export default Footer;
