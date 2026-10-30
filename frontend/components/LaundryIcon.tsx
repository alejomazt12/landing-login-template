import type { LaundryIconName } from "@/data/laundry";

type Props = {
  name: LaundryIconName | "check";
  className?: string;
};

const paths: Record<Props["name"], React.ReactNode> = {
  basket: (
    <>
      <path d="M3.5 10h17l-1.6 9a1.5 1.5 0 0 1-1.5 1.2H6.6A1.5 1.5 0 0 1 5.1 19L3.5 10Z" />
      <path d="M8 10l4-6 4 6M9 14v3M15 14v3M12 14v3" />
    </>
  ),
  hanger: (
    <>
      <path d="M10 6a2 2 0 1 1 2 2v1.5" />
      <path d="M12 9.5 3.6 15.3A1.5 1.5 0 0 0 4.5 18h15a1.5 1.5 0 0 0 .9-2.7L12 9.5Z" />
    </>
  ),
  iron: (
    <>
      <path d="M3 17.5l2.6-6.6A2.5 2.5 0 0 1 7.9 9.3H15a5 5 0 0 1 5 5v3.2H3Z" />
      <path d="M10 9.3V6.5h6.5M7 14h.01M10.5 14h.01M14 14h.01" />
    </>
  ),
  blanket: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="3" />
      <path d="M3 10.5h18M8 15h8" />
    </>
  ),
  sparkle: (
    <>
      <path d="M11 3.5l1.7 4.3 4.3 1.7-4.3 1.7L11 15.5l-1.7-4.3L5 9.5l4.3-1.7L11 3.5Z" />
      <path d="M18 14.5l.8 1.9 1.9.8-1.9.8-.8 1.9-.8-1.9-1.9-.8 1.9-.8.8-1.9Z" />
    </>
  ),
  sneaker: (
    <>
      <path d="M3 17.5V9l4.5-2.5L10.5 10H14l4.2 2.1A4.5 4.5 0 0 1 21 16.2v1.3H3Z" />
      <path d="M3 14h18M9 10.5l1.5-1.5M11 12l1.5-1.5" />
    </>
  ),
  check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
};

/** Line icons for the laundry site. Decorative: the text next to them carries the meaning. */
export default function LaundryIcon({ name, className = "size-6" }: Props) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {paths[name]}
    </svg>
  );
}
