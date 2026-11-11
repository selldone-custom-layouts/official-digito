/* Digito in this language: the shared Kalio base, Digito's own words and its overrides, one chunk. */
import base from "./base/da";
import own from "./digito.da";
import { OVERRIDES } from "./digito-overrides";

export default { ...base, ...own, ...OVERRIDES.da } as Record<string, string>;
