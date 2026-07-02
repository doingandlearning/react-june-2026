import { TextField } from "@mui/material";

interface FilterBarProps {
  query: string;
  onQueryChange: (value: string) => void;
  showDeprecated: boolean;
  onShowDeprecatedChange: (value: boolean) => void;
}

// Task 3 (module-13 lab.md): filter input -> TextField. `label` replaces
// both the separate <label> element and the old aria-label — TextField
// renders a properly associated label itself. The "Show deprecated"
// checkbox is left as a native input; swapping it for MUI's Switch is
// Extension A in the lab, not Core.
export function FilterBar({
  query,
  onQueryChange,
  showDeprecated,
  onShowDeprecatedChange,
}: FilterBarProps) {
  return (
    <div>
      <TextField
        label="Filter tools"
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        variant="outlined"
        size="small"
        fullWidth
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
