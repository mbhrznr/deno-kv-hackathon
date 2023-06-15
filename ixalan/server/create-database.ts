type SchemaConfig = {
  [key: string]: Record<`${number}`, unknown>;
};

export default async function createDatabase<T extends SchemaConfig>() {
  const db = await Deno.openKv();

  return {
    async create<S extends keyof T, I extends keyof T[S]>(
      schema: S,
      id: I,
      value: T[S][I]
    ) {
      await db.set([schema as string, id as string], value);
    },
    async delete<S extends keyof T, I extends keyof T[S]>(schema: S, id: I) {
      await db.delete([schema as string, id as string]);
    },
    async deleteMany<S extends keyof T>(schema: S) {
      const entries = db.list({ prefix: [schema as string] });

      for await (const entry of entries) {
        await db.delete(entry.key);
      }
    },
    async read<S extends keyof T, I extends keyof T[S]>(schema: S, id: I) {
      return (await db.get<T[S][I]>([schema as string, id as string]))?.value;
    },
    async readMany<S extends keyof T, I extends keyof T[S]>(schema: S) {
      const entries = db.list<T[S][I]>({ prefix: [schema as string] });
      const list: T[S][I][] = [];

      for await (const entry of entries) {
        list.push(entry.value as T[S][I]);
      }

      return list.filter(Boolean);
    },
    async update<S extends keyof T, I extends keyof T[S]>(
      schema: S,
      id: I,
      value: Partial<T[S][I]>
    ) {
      const entry = (await db.get<T[S][I]>([schema as string, id as string]))
        ?.value;

      if (Array.isArray(value)) {
        await db.set([schema as string, id as string], value);
      } else {
        await db.set([schema as string, id as string], {
          ...(entry ?? {}),
          ...value,
        });
      }
    },
  };
}
