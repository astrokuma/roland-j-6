// Progressions are shared in the URL: ?b=12&k=2&s=12.1,12.5,h,r
//   b = chord set shown, k = transpose (KEY), s = steps
//   "12.5" = chord set 12, key button 5 · "h" = HOLD (tie) · "r" = rest
export const MAX_STEPS = 64;

export const encodeSteps = (steps) =>
  steps.map((step) => (step.type === "chord" ? `${step.bank}.${step.key}` : step.type === "hold" ? "h" : "r")).join(",");

export const decodeSteps = (value, bankCount) => {
  if (!value) return [];
  return value
    .split(",")
    .slice(0, MAX_STEPS)
    .map((token) => {
      if (token === "h") return { type: "hold" };
      if (token === "r") return { type: "rest" };
      const [bank, key] = token.split(".").map(Number);
      if (bank >= 1 && bank <= bankCount && key >= 1 && key <= 12) return { type: "chord", bank, key };
      return null;
    })
    .filter(Boolean);
};

export const readUrlState = (bankCount) => {
  const params = new URLSearchParams(window.location.search);
  const bank = Number(params.get("b"));
  const transpose = Number(params.get("k"));
  return {
    bank: bank >= 1 && bank <= bankCount ? bank : null,
    // The URL always carries b; a missing k then means no transpose.
    transpose: params.has("k") ? (Number.isInteger(transpose) && Math.abs(transpose) <= 12 ? transpose : 0) : params.has("b") ? 0 : null,
    steps: params.has("s") ? decodeSteps(params.get("s"), bankCount) : params.has("b") ? [] : null,
  };
};

export const buildShareUrl = ({ bank, transpose, steps }) => {
  const params = new URLSearchParams();
  params.set("b", bank);
  if (transpose) params.set("k", transpose);
  if (steps.length) params.set("s", encodeSteps(steps));
  return `${window.location.origin}${window.location.pathname}?${params.toString().replace(/%2C/g, ",")}`;
};
