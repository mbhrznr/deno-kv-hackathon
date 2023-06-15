/** jsx children factory. */
function c(
  children: (JSX.Element | (() => JSX.Element) | undefined)[]
): JSX.Element[] {
  return children
    .flat()
    .filter(Boolean)
    .map((child) => {
      if (typeof child === "function") {
        return child();
      }

      if (typeof child === "object") {
        return child;
      }

      return {
        tag: "text",
        props: {
          children: [],
          nodeValue: child,
        },
      };
    });
}

/** jsx hyperscript factory. */
function h(
  tag: JSX.Element["tag"],
  props: JSX.Element["props"] | null,
  ...children: JSX.Element[]
): JSX.Element {
  if (typeof tag === "function") {
    return tag({ ...props, children: c(children) as JSX.Element[] });
  }

  return {
    tag,
    props: { ...props, children: c(children) },
  };
}

/** jsx factory. */
export function jsx(
  tag: JSX.Element["tag"],
  { children = [], ...props }: JSX.Element["props"],
  key?: string
) {
  return h(
    tag,
    { ...props, key },
    ...c(Array.isArray(children) ? children : [children])
  );
}

/** jsxs factory. */
export function jsxs(
  tag: JSX.Element["tag"],
  { children = [], ...props }: JSX.Element["props"],
  key?: string
) {
  return h(
    tag,
    { ...props, key },
    ...c(Array.isArray(children) ? children : [children])
  );
}

export const Fragment = "fragment";
