import { Entry, Response, Request, Timings } from 'har-format'
import Harmor from './Harmor';

type Replacer<T> = (value: T, harmor: Harmor) => T | null | undefined;

type Keys = keyof ({
  [K in keyof Response as `response.${K}`]: Replacer<Response[K]>
} & {
  [K in keyof Request as `request.${K}`]: Replacer<Request[K]>
} & {
  [K in keyof Timings as `timings.${K}`]: Replacer<Timings[K]>
} & {
  [K in keyof Entry as `${K}`]: Replacer<Entry[K]>
})

