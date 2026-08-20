export const formatPrice = (cents: number): string =>
  `$${(cents / 100).toFixed(2)}`;

export const cn = (...classes: (string | false | null | undefined)[]): string =>
  classes.filter(Boolean).join(' ');
