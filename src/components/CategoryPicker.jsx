import { getCategoriesForType } from '../utils/categories'

export default function CategoryPicker({ type = 'expense', value, onChange }) {
  const categories = getCategoriesForType(type)

  return (
    <div className="grid grid-cols-4 gap-2">
      {categories.map(cat => (
        <button
          key={cat.id}
          type="button"
          onClick={() => onChange(cat.id)}
          className={`flex flex-col items-center gap-1 p-2 rounded-xl border transition-all
            ${value === cat.id
              ? 'border-indigo-500 bg-indigo-500/20 text-indigo-300'
              : 'border-slate-700 bg-slate-800/60 text-slate-400 hover:border-slate-500'}`}
        >
          <span className="text-xl">{cat.emoji}</span>
          <span className="text-[10px] font-medium leading-tight text-center">{cat.label}</span>
        </button>
      ))}
    </div>
  )
}
