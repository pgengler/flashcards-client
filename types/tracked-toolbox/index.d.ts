declare module 'tracked-toolbox' {
  export function localCopy(key: string, defaultValue?: any): any; // eslint-disable-line @typescript-eslint/no-explicit-any
  export function trackedReset(key: string): any; // eslint-disable-line @typescript-eslint/no-explicit-any
  export const cached: MethodDecorator;
  export const dedupeTracked: PropertyDecorator;
}
