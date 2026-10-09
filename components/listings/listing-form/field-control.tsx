import { FormField } from "@/components/forms/form-field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { ListingField } from "@/lib/listing-fields";
import { formatThousands } from "@/lib/format";
type Props = {
    config: ListingField;
    value: string;
    error?: string;
    onChange: (value: string) => void;
    onBlur: () => void;
};

export function FieldControl({ config, value, error, onChange, onBlur }: Props) {
    return (
        <div className={config.half ? "col-span-2 sm:col-span-1" : "col-span-2"}>
            <FormField
                label={config.label}
                htmlFor={config.name}
                hint={config.hint}
                error={error}
            >
                {config.type === "select" ? (
                    <select
                        id={config.name}
                        value={value}
                        onChange={(event) => onChange(event.target.value)}
                        onBlur={onBlur}
                        aria-invalid={!!error}
                        className="h-9 w-full rounded-md border border-input bg-white px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-red-600/20 aria-invalid:border-red-600"
                    >
                        {config.options?.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                ) : config.type === "textarea" ? (
                    <Textarea
                        id={config.name}
                        rows={6}
                        value={value}
                        placeholder={config.placeholder}
                        onChange={(event) => onChange(event.target.value)}
                        onBlur={onBlur}
                        aria-invalid={!!error}
                    />
                ) : (
                            <Input
                                id={config.name}
                                type={config.thousands ? "text" : config.type}
                                inputMode={
                                    config.thousands ? "numeric" : config.type === "number" ? "decimal" : undefined
                                }
                                step={config.type === "number" && !config.thousands ? "any" : undefined}
                                value={config.thousands ? formatThousands(value) : value}
                                placeholder={config.placeholder}
                                onChange={(event) =>
                                    onChange(
                                        config.thousands
                                            ? event.target.value.replace(/\D/g, "") // keep digits only
                                            : event.target.value
                                    )
                                }
                                onBlur={onBlur}
                                aria-invalid={!!error}
                            />
                )}
            </FormField>
        </div>
    );
}