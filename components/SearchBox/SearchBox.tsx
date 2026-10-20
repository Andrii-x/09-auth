type SearchBoxProps = {
  value: string;
  onChange: (value: string) => void;
};

export default function SearchBox({ value, onChange }: SearchBoxProps) {
  return (
    <label>
      Search notes
      <input
        aria-label="Search notes"
        type="search"
        value={value}
        onChange={(event) => onChange(event.currentTarget.value)}
      />
    </label>
  );
}
