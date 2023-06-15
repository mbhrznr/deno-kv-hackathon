# deno kv hackathon

## project introduction

this project has been build during the first official [deno kv hackathon](https://deno.com/blog/deno-kv-hackathon).

it uses a (very experimental) framework named `ixalan`,
which i've been working on in my spare time. at it's core
`ixalan` only uses `deno`'s standard library,
while also providing a file-based `router`, route
`overrides` and a custom `jsx-runtime`, which is
currently only used as a templating engine.

for a clear separation `ixalan` and `app` have
their dedicated sections in the overall project structure.

even though some existing code has been used, some major rewrites for
the framework have happened during the hackathon, whereas everything
from `app` has been written from scratch.

### deno kv

`deno kv` is the project's primary data source. there's a
thin wrapper around kv with crud operations and a `schema` is
passed to the `create database` function to enforce
type-safety. on server startup a lookup is happening to potentially
seed the database. the underlying data is provided via
[pokeapi](https://pokeapi.co/). for authentication [deno kv auth](https://github.com/denoland/deno_kv_oauth) has been chosen, which is the project's only dependency apart from deno's excellent standard library.

## project idea

on the project there are two primary routes. there's [`/pokemon`](/pokemon)and there's [`/leaderboard`](/leaderboard).

[`/pokemon`](/pokemon) provides a paginates search, which is fed by `deno kv`. each of the results link to a pokemon via it's `id`. the search is also
capable of handling pokemon properties, so that queries such as
**"type:fire type:flying"** or **"zap type:electric"** are possible.

on the individual`/pokemon/:id` routes, there's a
minimalistic entry to the individual pokemon. underneath there are
four buttons: **allstar**, **favorite**,
**infamous** and **versatile**. each logged in user has the chance participate in the voting!

the results can be seen on `/leaderboard`, where some
simple filter options and aggregations are available. on the go live
there's also a hidden feature, which has to be unlocked by the
community!

## development

the project can be started locally via `deno task dev`.

as `github` is used as an oauth provider an application need to be registered. this can be done [here](https://github.com/settings/applications/new). the callback url should point to `/api/auth/callback`.

also the following environment variables need to be set:
```sh
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...
```

## deployment

can be run on [deno deploy](https://deno.com/deploy) once `deno kv` is enabled.