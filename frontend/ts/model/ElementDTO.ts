export type ElementDTO = {
  elementType: 'point' | 'line',
  parents: unknown[],
  attributes?: Record<string, unknown>,
}
