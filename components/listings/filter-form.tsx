"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { formatThousands } from "@/lib/format";

export type FilterField = {
    name: string;
    label: string;
    type: "text" | "number" | "select";
    placeholder?: string;
    options?: { value: string; label: string }[];
    half?: boolean; // takes half the width, so two fit on one row
    thousands?: boolean;
};

type Props = {
    fields: FilterField[];
    values: Record<string, string>;
    onApply: (values: Record<string, string>) => void;
    onReset: () => void;
};

export function FilterForm({ fields, values, onApply, onReset }: Props) {
    // What the user is typing right now. It is applied only when they press Apply.
    const [draft, setDraft] = useState(values);

    function change(name: string, value: string) {
        setDraft((previous) => ({ ...previous, [name]: value }));
    }

    return (
        <form
            onSubmit={(event) => {
                event.preventDefault();
                onApply(draft);
            }}
            className="grid grid-cols-2 gap-4"
        >
            {fields.map((field) => (
                <div
                    key={field.name}
                    className={cn("space-y-1.5", field.half ? "col-span-1" : "col-span-2")}
                >
                    <Label htmlFor={field.name}>{field.label}</Label>

                    {field.type === "select" ? (
                        <select
                            id={field.name}
                            value={draft[field.name] ?? ""}
                            onChange={(event) => change(field.name, event.target.value)}
                            className="h-9 w-full rounded-md border border-input bg-white px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-red-600/20"
                        >
                            {field.options?.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    ) : (
                            <Input
                                id={field.name}
                                type={field.thousands ? "text" : field.type}
                                inputMode={field.thousands ? "numeric" : undefined}
                                min={field.type === "number" && !field.thousands ? 0 : undefined}
                                placeholder={field.placeholder}
                                value={
                                    field.thousands
                                        ? formatThousands(draft[field.name] ?? "")
                                        : (draft[field.name] ?? "")
                                }
                                onChange={(event) =>
                                    change(
                                        field.name,
                                        field.thousands
                                            ? event.target.value.replace(/\D/g, "") // keep digits only
                                            : event.target.value
                                    )
                                }
                            />
                    )}
                </div>
            ))}

            <div className="col-span-2 flex gap-2 pt-2">
                <Button type="submit" className="flex-1">
                    Apply filters
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                        setDraft({});
                        onReset();
                    }}
                >
                    Reset
                </Button>
            </div>
        </form>
    );
}