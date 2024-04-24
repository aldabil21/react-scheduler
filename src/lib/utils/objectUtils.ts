/**
 *  Allow for traversing multiple levels of an object when getting a value
 *
 * @example To get "Hello World" from this object, use resolveObjectPath({ a: { b: { c: 'Hello World }}}, 'a.b.c')
 *
 * @param object The object the path will traverse
 * @param path The path to the property value you want to get
 * @param defaultValue (optional) default vlaue if not found
 * @returns
 */
export const resolveObjectPath = (object: any, path: string, defaultValue?: string): any =>
  path.split(".").reduce((o, p) => (o ? o[p] : defaultValue ?? null), object);
