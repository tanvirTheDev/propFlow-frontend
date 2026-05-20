interface Props {
  isActive: boolean;
  activeLabel: string;
  deactivatedLabel: string;
}

export function UserStatusBadge({ isActive, activeLabel, deactivatedLabel }: Props) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
        isActive
          ? 'bg-green-100 text-green-700'
          : 'bg-red-100 text-red-600'
      }`}
    >
      {isActive ? activeLabel : deactivatedLabel}
    </span>
  );
}
