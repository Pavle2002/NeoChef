const parseArray = (val: unknown): string[] | undefined => {
  if (Array.isArray(val)) {
    return val;
  }
  if (val !== undefined) {
    return [String(val)];
  }
  return undefined;
};

const parseNumber = (val: unknown): number | undefined => {
  const num = Number(val);
  return isNaN(num) ? undefined : num;
};

export const queryParamsParser = {
  parseArray,
  parseNumber,
};
