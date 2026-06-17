interface ResultCountProps {
  count: number;
  total: number;
}

export function ResultCount({ count, total }: ResultCountProps) {
  return (
    <p role="status" aria-live="polite">
      Showing {count} of {total} tools
    </p>
  );
}
