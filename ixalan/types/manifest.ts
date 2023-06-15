export type ManifestMapHandlerValue = `$h${number}`;
export type ManifestMapPageValue = `$p${number}`;
export type ManifestMapStaticValue = `$s${number}`;

export type ManifestMapKey = string;
export type ManifestMapHandlerRoute = { handler: ManifestMapHandlerValue };
export type ManifestMapPageRoute = { page: ManifestMapPageValue };
export type ManifestMapStaticRoute = { static: ManifestMapStaticValue };
export type ManifestMapValue =
  | ManifestMapHandlerRoute
  | ManifestMapPageRoute
  | ManifestMapStaticRoute;
