export function containsAdminDashboard(value: string) {
  const regex = /^\/admin\/(api|dashboard)/i;
  return regex.test(value);
}

export function containsAdminPath(value: string) {
  return /^\/admin\//i.test(value) || /^\/admin$/i.test(value);
}
