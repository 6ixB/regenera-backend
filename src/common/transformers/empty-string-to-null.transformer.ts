import { Transform } from 'class-transformer';

export function TransformEmptyStringToNull() {
  return Transform(({ value }) => (value === '' ? null : value));
}
