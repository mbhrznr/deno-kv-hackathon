/** void html elments */
const voidset = new Set([
  "area",
  "base",
  "br",
  "col",
  "embed",
  "hr",
  "img",
  "input",
  "link",
  "meta",
  "param",
  "source",
  "track",
  "wbr",
]);

function traverse(jsx: JSX.Element): string {
  const { tag } = jsx;
  const { children = [], ...props } = jsx.props;
  const attributes = Object.entries(props)
    .filter(([_, value]) => value != null)
    .map(([key, value]) => {
      switch (true) {
        case key === "className":
          return `class="${value}"`;
        case key === "htmlFor":
          return `for="${value}"`;
        case /^on/.test(key):
          console.warn(`currently handler such as "${key}" aren't supported.`);
          return ``;
        default:
          return `${key}="${value}"`;
      }
    })
    .filter(Boolean)
    .join(" ");

  switch (tag) {
    case "html":
      return `<!DOCTYPE html><html ${attributes}>${children
        .map((child) => traverse(child))
        .join("")}</html>`;
    case "fragment":
      return `${children.map((child) => traverse(child)).join("")}`;
    case "text":
      return props.nodeValue as string;
    default:
      if (voidset.has(tag as string)) {
        return `<${tag} ${attributes} />`;
      }
      return `<${tag} ${attributes}>${children
        .map((child) => traverse(child))
        .join("")}</${tag}>`;
  }
}

export default function render(jsx: JSX.Element): string {
  return traverse(jsx);
}
