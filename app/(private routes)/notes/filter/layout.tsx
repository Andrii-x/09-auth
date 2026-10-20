export default function FilterLayout({
  children,
  sidebar,
}: {
  children: React.ReactNode;
  sidebar: React.ReactNode;
}) {
  return (
    <div className="notesFilterLayout">
      {children}
      {sidebar}
    </div>
  );
}
