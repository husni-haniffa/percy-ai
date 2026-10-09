import { cn } from "@/lib/utils";

export type TabOption<T extends string> = {
    value: T;
    label: string;
    count?: number;
};

export function StatusTabs<T extends string>({
    options,
    value,
    onChange,
}: {
    options: TabOption<T>[];
    value: T;
    onChange: (value: T) => void;
}) {
    return (
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0" role="tablist">
            {options.map((option) => {
                const selected = option.value === value;

                return (
                    <button
                        key={option.value}
                        type="button"
                        role="tab"
                        aria-selected={selected}
                        onClick={() => onChange(option.value)}
                        className={cn(
                            "flex shrink-0 items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-medium transition",
                            selected
                                ? "border-black bg-black text-white"
                                : "bg-white text-neutral-700 hover:border-neutral-400"
                        )}
                    >
                        {option.label}
                        {option.count !== undefined && (
                            <span
                                className={cn(
                                    "rounded-full px-1.5 text-xs",
                                    selected ? "bg-white/20" : "bg-neutral-100 text-neutral-600"
                                )}
                            >
                                {option.count}
                            </span>
                        )}
                    </button>
                );
            })}
        </div>
    );
}