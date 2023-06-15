/** enrich props with (optional) children. */
type PropsWithChildren<P = Record<never, never>> = {
  children?: JSX.Element[];
} & P;

/** function components w/ (optional) children. */
type FC<P = Record<never, never>> = (
  props: PropsWithChildren<P>
) => JSX.Element;

/** void function components w/o children. */
type VFC<P = Record<never, never>> = (props: P) => JSX.Element;

/** get keys of passed object/map */
type GetKeys<U> = U extends Record<infer K, unknown> ? K : never;

/** transform union to intersection */
type UnionToIntersection<U extends Record<never, never>> = {
  [K in GetKeys<U>]: U extends Record<K, infer T> ? T : never;
};

/** generic mapped `html` type */
type HTML<T extends keyof HTMLElementTagNameMap> = Partial<
  HTMLElementTagNameMap[T]
>;

/** generic mapped `svg` type */
type SVG<T extends keyof SVGElementTagNameMap> = Partial<
  SVGElementTagNameMap[T] | { [key: string]: string | number | boolean }
>;

/** jsx namespace. */
declare namespace JSX {
  type Element = {
    props: {
      children?: JSX.Element[];
      [key: string]: unknown;
    };
    tag: FC | VFC | string;
  };

  type IntrinsicElements = UnionToIntersection<
    | { [H in keyof HTMLElementTagNameMap]: HTML<H> }
    | { [S in keyof SVGElementTagNameMap]: SVG<S> }
  >;

  type Node = JSX.Element | JSX.Element[];
}
