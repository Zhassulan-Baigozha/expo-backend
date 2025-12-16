export const parseId = (param: string): number | null => {
  const id = Number(param);
  return Number.isNaN(id) ? null : id;
};

export const safeBigInt = <T extends { id: bigint }>(
  obj: T,
): T & { id: string } => ({ ...obj, id: obj.id.toString() });

export const safeBigIntArray = <T extends { id: bigint }>(
  arr: T[],
): (T & { id: string })[] => arr.map((item) => safeBigInt(item));
