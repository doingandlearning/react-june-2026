interface FilterBarProps {
  query: string;
  onQueryChange: (value: string) => void;
  showDeprecated: boolean;
  onShowDeprecatedChange: (value: boolean) => void;
}

export function FilterBar({
  query,
  onQueryChange,
  showDeprecated,
  onShowDeprecatedChange,
}: FilterBarProps) {
  return (
    <div>
      <label htmlFor="filter">Filter tools</label>
      <input
        id="filter"
        type="text"
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        placeholder="Filter tools…"
        aria-label="Filter tools"
      />
      <label>
        <input
          type="checkbox"
          checked={showDeprecated}
          onChange={(e) => onShowDeprecatedChange(e.target.checked)}
        />
        {" "}Show deprecated
      </label>
    </div>
  );
}
