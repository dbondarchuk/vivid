export const OutlookLogo: React.FC<React.HTMLAttributes<SVGElement>> = (
  props
) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    {...props}
  >
    <rect x="0" y="0" width="11" height="11" fill="#f25022" />
    <rect x="0" y="12" width="11" height="11" fill="#00a4ef" />
    <rect x="12" y="0" width="11" height="11" fill="#7fba00" />
    <rect x="12" y="12" width="11" height="11" fill="#ffb110" />
  </svg>
);
