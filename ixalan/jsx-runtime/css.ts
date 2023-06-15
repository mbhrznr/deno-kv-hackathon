export default function css(
  strings: TemplateStringsArray,
  ...values: unknown[]
) {
  const css = strings.reduce((acc, string, index) => {
    const value = values[index] ?? "";
    return acc + string + value;
  }, "");

  return css;
}
