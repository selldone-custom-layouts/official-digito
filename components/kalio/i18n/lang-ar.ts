/* Digito in this language: the shared Kalio base, Digito's own words and its overrides, one chunk. */
import base from "./base/ar";
import own from "./digito.ar";
import { OVERRIDES } from "./digito-overrides";

export default { ...base, ...own, ...OVERRIDES.ar } as Record<string, string>;
