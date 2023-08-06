export function convertToCelsuis(kelvin: number): number {
  return kelvin - 273.15;
}

export function sortBy(isAscending: boolean, sortType: string, array: any[]) {
  if (isAscending)
    return array.sort((a, b) =>
      a[sortType] > b[sortType] ? 1 : a[sortType] < b[sortType] ? -1 : 0
    );
  else
    return array.sort((a, b) =>
      a[sortType] < b[sortType] ? 1 : a[sortType] > b[sortType] ? -1 : 0
    );
}
