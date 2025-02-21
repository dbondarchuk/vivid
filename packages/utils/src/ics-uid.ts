export const getIcsEventUid = (id: string, url: string) => {
  const host = new URL(url).host;
  return `${id}@${host}`;
};
