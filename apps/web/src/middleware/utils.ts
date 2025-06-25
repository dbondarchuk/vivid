export function containsAdminDashboard(value: string) {
  const regex = /^\/admin\/(api|dashboard)/i;
  return regex.test(value);
}
