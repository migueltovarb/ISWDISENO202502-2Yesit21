import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

interface FilterGroupProps {
  title: string
  options: { id: string; label: string }[]
  selected: string[]
  onChange: (selected: string[]) => void
}

export function FilterGroup({ title, options, selected, onChange }: FilterGroupProps) {
  const handleToggle = (optionId: string) => {
    if (selected.includes(optionId)) {
      onChange(selected.filter((id) => id !== optionId))
    } else {
      onChange([...selected, optionId])
    }
  }

  return (
    <div className="space-y-3">
      <Label className="text-base font-semibold">{title}</Label>
      <div className="space-y-2">
        {options.map((option) => (
          <div key={option.id} className="flex items-center space-x-2">
            <Checkbox
              id={option.id}
              checked={selected.includes(option.id)}
              onCheckedChange={() => handleToggle(option.id)}
            />
            <label
              htmlFor={option.id}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              {option.label}
            </label>
          </div>
        ))}
      </div>
    </div>
  )
}
