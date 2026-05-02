export default function EmptyState({ icon = '📭', title = 'Nothing here yet', subtitle }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center px-6 animate-fade-in">
      <span className="text-5xl mb-4">{icon}</span>
      <p className="text-slate-300 font-medium text-base">{title}</p>
      {subtitle && <p className="text-slate-500 text-sm mt-1">{subtitle}</p>}
    </div>
  )
}
