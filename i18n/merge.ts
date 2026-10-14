export type DeepPartial<T> = T extends readonly (infer U)[] ? DeepPartial<U>[] : T extends object ? { [K in keyof T]?: DeepPartial<T[K]> } : T;

/** `base` with every value that `over` provides; arrays merge item by item. A partial translation
    therefore falls back to English wherever a string is still missing. */
export function deepMerge<T>(base: T, over: DeepPartial<T> | undefined): T {
  if (over === undefined || over === null) return base;
  if (Array.isArray(base)) {
    const o = over as unknown[];
    return base.map((item, i) => deepMerge(item, o[i] as DeepPartial<typeof item>)) as T;
  }
  if (base && typeof base === 'object') {
    const out = { ...base } as Record<string, unknown>;
    for (const [k, v] of Object.entries(over as object)) out[k] = deepMerge((base as Record<string, unknown>)[k], v as never);
    return out as T;
  }
  return over as T;
}
