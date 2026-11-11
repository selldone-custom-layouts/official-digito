/* Digito in this language: the shared Kalio base, Digito's own words and its overrides, one chunk. */
import base from "./base/hi";
import own from "./digito.hi";
import { OVERRIDES } from "./digito-overrides";

export default { ...base, ...own, ...OVERRIDES.hi } as Record<string, string>;
