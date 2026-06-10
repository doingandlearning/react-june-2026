// TODO: define PanelProps
// - title: string
// - children: anything React can render

export function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2>{title}</h2>
      <div>{children}</div>
    </section>
  );
}
