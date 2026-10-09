"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth, useUser } from "@clerk/nextjs";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FormField, getErrorMessage } from "@/components/forms/form-field";
import { ApiError } from "@/lib/api";
import { useApi } from "@/lib/use-api";
import { useMe } from "@/lib/use-me";
import { phoneSchema } from "@/lib/validation";
import Link from "next/link";

export function OnboardingForm() {
    const router = useRouter();
    const queryClient = useQueryClient();
    const api = useApi();
    const { userId } = useAuth();
    const { user } = useUser();
    const { data: me } = useMe();

    // Someone who is already set up has no business here
    useEffect(() => {
        if (me?.onboarded) router.replace("/dashboard");
    }, [me, router]);

    // Refresh "who am I" first, otherwise the dashboard would still think we are new
    async function finish() {
        await queryClient.invalidateQueries({ queryKey: ["me", userId] });
        router.replace("/dashboard");
    }

    const save = useMutation({
        mutationFn: (phone: string) =>
            api("/api/users/onboard", {
                method: "POST",
                body: JSON.stringify({ phone, acceptedTerms: true }),
            }),
        onSuccess: async () => {
            toast.success("Welcome to Percy AI!");
            await finish();
        },
        onError: async (error) => {
            // 409 means this account is already registered: just carry on
            if (error instanceof ApiError && error.status === 409) {
                await finish();
                return;
            }
            toast.error(error.message);
        },
    });

    const form = useForm({
        defaultValues: { phone: "", accepted: false },
        onSubmit: ({ value }) => save.mutate(value.phone),
    });

    return (
        <Card className="w-full max-w-md">
            <CardHeader className="text-center">
                <CardTitle className="text-2xl text-red-700">One last step</CardTitle>
                <CardDescription>
                    Buyers will use your phone number to contact you about your listings.
                </CardDescription>
            </CardHeader>

            <CardContent>
                <form
                    onSubmit={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        form.handleSubmit();
                    }}
                    className="space-y-5"
                >
                    <FormField label="Name" htmlFor="name" hint="Taken from your account">
                        <Input id="name" value={user?.fullName ?? ""} disabled readOnly />
                    </FormField>

                    <FormField label="Email" htmlFor="email" hint="Taken from your account">
                        <Input
                            id="email"
                            value={user?.primaryEmailAddress?.emailAddress ?? ""}
                            disabled
                            readOnly
                        />
                    </FormField>

                    <form.Field name="phone" validators={{ onChange: phoneSchema }}>
                        {(field) => {
                            const error = field.state.meta.isTouched
                                ? getErrorMessage(field.state.meta.errors)
                                : undefined;

                            return (
                                <FormField
                                    label="Phone number"
                                    htmlFor="phone"
                                    hint="Sri Lankan mobile number, for example 077 123 4567"
                                    error={error}
                                >
                                    <Input
                                        id="phone"
                                        type="tel"
                                        inputMode="tel"
                                        autoComplete="tel"
                                        placeholder="077 123 4567"
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(event) => field.handleChange(event.target.value)}
                                        aria-invalid={!!error}
                                    />
                                </FormField>
                            );
                        }}
                    </form.Field>
                    <p className="rounded-lg bg-neutral-50 p-3 text-xs text-neutral-600">
                        Your name, phone number and email are shown to anyone who taps &ldquo;Show
                        contact details&rdquo; on your listings.
                    </p>

                    <form.Field
                        name="accepted"
                        validators={{
                            onChange: ({ value }) =>
                                value ? undefined : "Please accept the Terms and Privacy Policy to continue",
                        }}
                    >
                        {(field) => {
                            const error = field.state.meta.isTouched
                                ? getErrorMessage(field.state.meta.errors)
                                : undefined;

                            return (
                                <div className="space-y-1.5">
                                    <label className="flex items-start gap-3 text-sm text-neutral-700">
                                        <input
                                            type="checkbox"
                                            checked={field.state.value}
                                            onChange={(event) => field.handleChange(event.target.checked)}
                                            onBlur={field.handleBlur}
                                            className="mt-1 size-4 accent-red-700"
                                        />
                                        <span>
                                            I am 18 or older and I agree to the{" "}
                                            <Link
                                                href="/terms"
                                                target="_blank"
                                                className="font-medium text-red-700 underline"
                                            >
                                                Terms of Service
                                            </Link>{" "}
                                            and{" "}
                                            <Link
                                                href="/privacy"
                                                target="_blank"
                                                className="font-medium text-red-700 underline"
                                            >
                                                Privacy Policy
                                            </Link>
                                            .
                                        </span>
                                    </label>
                                    {error && <p className="text-sm text-red-700">{error}</p>}
                                </div>
                            );
                        }}
                    </form.Field>

                    <Button type="submit" size="lg" className="w-full" disabled={save.isPending}>
                        {save.isPending ? "Saving..." : "Continue"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}