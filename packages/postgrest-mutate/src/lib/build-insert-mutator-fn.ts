import { isPaginationCacheData } from "@supabase-cache-helpers/postgrest-shared";

import { calculateNewCount } from "./calculate-new-count";
import { MutatorFn } from "./types";

export const buildInsertMutatorFn = <Type>(input: Type): MutatorFn<Type> => {
  return (currentData) => {
    // Return early if undefined or null
    if (!currentData) return currentData;

    // if array, it must be infinite response
    if (isPaginationCacheData<Type>(currentData)) {
      const pages = currentData;
      pages[0].unshift(input);
      return pages;
    }

    // else { data, count }
    const { data } = currentData;
    const newCount = calculateNewCount<Type>(currentData, "add");
    if (!Array.isArray(data)) return { data: input, count: newCount };
    const list = data;
    list.unshift(input);
    return { data: list, count: newCount };
  };
};
