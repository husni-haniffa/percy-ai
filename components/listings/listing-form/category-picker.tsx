import { Building2, Car, type LucideIcon } from "lucide-react";
import type { Category } from "@/lib/listing-form";
import { cn } from "@/lib/utils";

const options: { value: Category; label: string; hint: string; icon: LucideIcon }[] = [
    { value: "property", label: "Property", hint: "House, apartment, land", icon: Building2 },
    { value: "vehicle", label: "Vehicle", hint: "Car, van, bike", icon: Car },
];

export function CategoryPicker({
    value,
    onChange,
}: {
    value: Category;
    onChange: (value: Category) => void;
}) {
    return (
        <div className="grid grid-cols-2 gap-3">
            {options.map(({ value: option, label, hint, icon: Icon }) => {
                const selected = value === option;
                return (
                    <button
                        key={option}
                        type="button"
                        aria-pressed={selected}
                        onClick={() => onChange(option)}
                        className={cn(
                            "flex items-center gap-3 rounded-xl border-2 p-4 text-left transition",
                            selected
                                ? "border-red-700 bg-red-50"
                                : "border-neutral-200 hover:border-neutral-400"
                        )}
                    >
                        <Icon className={cn("size-6", selected ? "text-red-700" : "text-neutral-500")} />
                        <div>
                            <p className="font-semibold">{label}</p>
                            <p className="text-xs text-neutral-500">{hint}</p>
                        </div>
                    </button>
                );
            })}
        </div>
    );
}