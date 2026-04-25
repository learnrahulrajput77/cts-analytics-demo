interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div
      className="min-h-screen bg-slate-50"
      style={{ paddingLeft: 'var(--sidebar-width)' }}
    >
      <main className="p-6 max-w-screen-2xl">
        {children}
      </main>
    </div>
  );
}
