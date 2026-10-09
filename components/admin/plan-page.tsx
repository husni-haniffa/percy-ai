"use client";

import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CalendarDays, Info, ListChecks } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Container } from "@/components/layout/container";
import { FormField, getErrorMessage } from "@/components/forms/form-field";
import { useAdminPlans, type AdminPlan } from "@/lib/use-admin";
import { useApi } from "@/lib/use-api";

const whole = (label: string, max: number) => (value: string) => {
    if (value.trim() === "") return `${label} is required`;
    const number = Number(value);
    if (!Number.isInteger(number) || number < 1) {
        return `${label} must be a whole number, 1 or more`;
    }
    if (number > max) return `${label} can be at most ${max}`;
};

const fields = [
    {
        name: "durationDays" as const,
        label: "Plan length (days)",
        short: "Plan length",
        hint: "Only affects people who join after you save.",
        max: 3650,
    },
    {
        name: "maxListings" as const,
        label: "Listings allowed",
        short: "Listing limit",
        hint: "Applies to everyone on this plan straight away.",
        max: 1000,
    },
];

function EditPlanForm({ plan, onClose }: { plan: AdminPlan; onClose: () => void }) {
    const api = useApi();
    const queryClient = useQueryClient();

    const save = useMutation({
        mutationFn: (values: { durationDays: number; maxListings: number }) =>
            api(`/api/plans/${plan._id}`, { method: "PATCH", body: JSON.stringify(values) }),
        onSuccess: async () => {
            toast.success(`${plan.name} plan updated`);
            await Promise.all(
                ["admin", "can-create", "me"].map((key) =>
                    queryClient.invalidateQueries({ queryKey: [key] })
                )
            );
            onClose();
        },
        onError: (error) => toast.error(error.message),
    });

    const form = useForm({
        defaultValues: {
            durationDays: String(plan.durationDays),
            maxListings: String(plan.maxListings),
        },
        onSubmit: ({ value }) =>
            save.mutate({
                durationDays: Number(value.durationDays),
                maxListings: Number(value.maxListings),
            }),
    });

    return (
        <form
            onSubmit={(event) => {
                event.preventDefault();
                event.stopPropagation();
                form.handleSubmit();
            }}
            className="space-y-5"
        >
            {fields.map((config) => (
                <form.Field
                    key={config.name}
                    name={config.name}
                    validators={{ onChange: ({ value }) => whole(config.short, config.max)(value) }}
                >
                    {(field) => {
                        const error = field.state.meta.isTouched
                            ? getErrorMessage(field.state.meta.errors)
                            : undefined;

                        return (
                            <FormField
                                label={config.label}
                                htmlFor={config.name}
                                hint={config.hint}
                                error={error}
                            >
                                <Input
                                    id={config.name}
                                    type="number"
                                    min={1}
                                    value={field.state.value}
                                    onChange={(event) => field.handleChange(event.target.value)}
                                    onBlur={field.handleBlur}
                                    aria-invalid={!!error}
                                />
                            </FormField>
                        );
                    }}
                </form.Field>
            ))}

            <DialogFooter>
                <Button type="button" variant="outline" onClick={onClose} disabled={save.isPending}>
                    Cancel
                </Button>
                <Button type="submit" disabled={save.isPending}>
                    {save.isPending ? "Saving..." : "Save changes"}
                </Button>
            </DialogFooter>
        </form>
    );
}

export function PlansPage() {
    const { data, isPending, error, refetch } = useAdminPlans();
    const [editing, setEditing] = useState<AdminPlan | null>(null);

    return (
        <Container className="space-y-6 py-10">
            <div>
                <h1 className="text-3xl font-bold text-red-700 sm:text-4xl">Plans</h1>
                <p className="mt-1 text-neutral-600">
                    Every new user starts on the default plan. Paid plans come later.
                </p>
            </div>

            <div className="flex gap-3 rounded-xl border bg-white p-4 text-sm text-neutral-700">
                <Info className="mt-0.5 size-4 shrink-0 text-neutral-500" />
                <p>
                    Changing a plan&apos;s <strong>length</strong> only affects people who join
                    afterwards. Changing the <strong>listing limit</strong> applies to everyone on
                    that plan straight away.
                </p>
            </div>

            {isPending ? (
                <div className="grid gap-5 md:grid-cols-2">
                    <Skeleton className="h-48 w-full rounded-xl" />
                </div>
            ) : error ? (
                <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-red-800">
                    <p>{error.message}</p>
                    <Button className="mt-4" onClick={() => refetch()}>
                        Try again
                    </Button>
                </div>
            ) : (
                <div className="grid gap-5 md:grid-cols-2">
                    {data.map((plan) => (
                        <div key={plan._id} className="space-y-5 rounded-xl border bg-white p-6">
                            <div className="flex items-center justify-between gap-3">
                                <h2 className="text-2xl font-bold">{plan.name}</h2>
                                {plan.isDefault && (
                                    <Badge className="bg-green-100 text-green-800">Default for new users</Badge>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="rounded-lg bg-neutral-50 p-4">
                                    <CalendarDays className="size-5 text-red-700" />
                                    <p className="mt-2 text-2xl font-bold">{plan.durationDays}</p>
                                    <p className="text-xs text-neutral-500">days of access</p>
                                </div>
                                <div className="rounded-lg bg-neutral-50 p-4">
                                    <ListChecks className="size-5 text-red-700" />
                                    <p className="mt-2 text-2xl font-bold">{plan.maxListings}</p>
                                    <p className="text-xs text-neutral-500">listings allowed</p>
                                </div>
                            </div>

                            <Button variant="outline" onClick={() => setEditing(plan)}>
                                Edit plan
                            </Button>
                        </div>
                    ))}
                </div>
            )}

            <Dialog open={!!editing} onOpenChange={(open) => !open && setEditing(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit {editing?.name} plan</DialogTitle>
                        <DialogDescription>
                            Set how long the plan lasts and how many listings it allows.
                        </DialogDescription>
                    </DialogHeader>
                    {editing && (
                        <EditPlanForm key={editing._id} plan={editing} onClose={() => setEditing(null)} />
                    )}
                </DialogContent>
            </Dialog>
        </Container>
    );
}