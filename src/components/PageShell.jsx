export default function PageShell({ title, right, children, noPad = false }) {
  return (
    <div className="flex flex-col flex-1 animate-fade-in">
      {/* Header */}
      {title && (
        <header className="flex items-center justify-between px-4 pt-12 pb-4 shrink-0">
          <h1 className="text-xl font-bold text-slate-100">{title}</h1>
          {right && <div>{right}</div>}
        </header>
      )}

      {/* Scrollable content */}
      <div className={`flex-1 overflow-y-auto no-scrollbar ${noPad ? '' : 'px-4 pb-4'}`}
           style={{ paddingBottom: 'calc(5rem + env(safe-area-inset-bottom, 0px))' }}>
        {children}
      </div>
    </div>
  )
}
