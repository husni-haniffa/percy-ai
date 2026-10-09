"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getErrorMessage } from "@/components/forms/form-field";
import {
    commonFields,
    propertyFields,
    vehicleFields,
    type ListingField,
} from "@/lib/listing-fields";
import {
    buildPayload,
    emptyValues,
    valuesFromListing,
    type Category,
} from "@/lib/listing-form";
import { useApi } from "@/lib/use-api";
import { capitalize } from "@/lib/format";
import type { Listing } from "@/types/listing";
import { CategoryPicker } from "./category-picker";
import { FieldControl } from "./field-control";
import { ImageUploader, type ImageItem } from "./image-uploader";
import { Info } from "lucide-react";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <section className="space-y-5 rounded-xl border bg-white p-6">
            <h2 className="text-xl font-bold">{title}</h2>
            {children}
        </section>
    );
}

export function ListingForm({
    mode,
    listing,
}: {
    mode: "create" | "edit";
    listing?: Listing;
}) {
    const router = useRouter();
    const queryClient = useQueryClient();
    const api = useApi();
    const { userId } = useAuth();

    const [category, setCategory] = useState<Category>(listing?.category ?? "property");
    const [triedSubmit, setTriedSubmit] = useState(false);
    const [items, setItems] = useState<ImageItem[]>(() =>
        listing
            ? listing.images.map((url) => ({ id: url, status: "existing" as const, url }))
            : []
    );

    const uploading = items.some((item) => item.status === "uploading");
    const failed = items.some((item) => item.status === "error");
    const usableImages = items.filter(
        (item) => item.status === "ready" || item.status === "existing"
    );
    const imageError =
        triedSubmit && usableImages.length === 0 ? "Add at least one photo" : undefined;

    const save = useMutation({
        mutationFn: (payload: object) =>
            mode === "create"
                ? api<Listing>("/api/listings", { method: "POST", body: JSON.stringify(payload) })
                : api<Listing>(`/api/listings/${listing?._id}`, {
                    method: "PATCH",
                    body: JSON.stringify(payload),
                }),
        onSuccess: async () => {
            toast.success(
                mode === "create"
                    ? "Listing submitted for review"
                    : "Changes saved. Your listing is back in review."
            );
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: ["my-listings", userId] }),
                queryClient.invalidateQueries({ queryKey: ["can-create", userId] }),
                queryClient.invalidateQueries({ queryKey: ["browse"] }),
                queryClient.invalidateQueries({ queryKey: ["listing"] }),
            ]);
            router.push("/dashboard");
        },
        onError: (error) => toast.error(error.message),
    });

    function submit(values: Record<string, string>) {
        if (uploading) {
            toast.error("Please wait for your photos to finish uploading");
            return;
        }
        if (failed) {
            toast.error("Remove the photos that failed to upload, or add them again");
            return;
        }

        // Existing photos go as their URL, new ones as their key
        const images = items.flatMap((item) =>
            item.status === "existing" ? [item.url] : item.status === "ready" ? [item.key] : []
        );
        if (images.length === 0) return; // the "Add at least one photo" message is already showing

        save.mutate(buildPayload(category, values, images));
    }

    const form = useForm({
        defaultValues: listing ? valuesFromListing(listing) : emptyValues,
        onSubmit: ({ value }) => submit(value),
    });

    function renderField(field: ListingField) {
        return (
            <form.Field
                key={field.name}
                name={field.name}
                validators={{ onChange: ({ value }) => field.validate(value) }}
            >
                {(state) => (
                    <FieldControl
                        config={field}
                        value={state.state.value}
                        error={
                            state.state.meta.isTouched
                                ? getErrorMessage(state.state.meta.errors)
                                : undefined
                        }
                        onChange={state.handleChange}
                        onBlur={state.handleBlur}
                    />
                )}
            </form.Field>
        );
    }

    const detailFields = category === "property" ? propertyFields : vehicleFields;

    return (
        <form
            onSubmit={(event) => {
                event.preventDefault();
                event.stopPropagation();
                setTriedSubmit(true);
                form.handleSubmit();
            }}
            className="space-y-6"
        >
            {mode === "create" ? (
                <Section title="What are you listing?">
                    <CategoryPicker value={category} onChange={setCategory} />
                </Section>
            ) : (
                <div className="flex items-center gap-2 text-sm text-neutral-600">
                    Category: <Badge variant="outline">{capitalize(category)}</Badge>
                    <span className="text-xs">(can&apos;t be changed)</span>
                </div>
            )}

            <Section title="Basic information">
                <div className="grid grid-cols-2 gap-5">{commonFields.map(renderField)}</div>
            </Section>

            <Section title={category === "property" ? "Property details" : "Vehicle details"}>
                <div className="grid grid-cols-2 gap-5">{detailFields.map(renderField)}</div>
            </Section>

            <Section title="Photos">
                <ImageUploader items={items} setItems={setItems} />
                {imageError && <p className="text-sm text-red-700">{imageError}</p>}
            </Section>
            <div className="flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                <Info className="mt-0.5 size-4 shrink-0" />
                <p>
                    Your name, phone number and email are shown to anyone who taps &ldquo;Show
                    contact details&rdquo; on this listing. Only post if you are happy with that.
                </p>
            </div>
            <div className="space-y-3">
                <Button
                    type="submit"
                    size="lg"
                    className="w-full sm:w-auto"
                    disabled={save.isPending || uploading}
                >
                    {save.isPending
                        ? "Saving..."
                        : mode === "create"
                            ? "Submit for review"
                            : "Save changes"}
                </Button>
                <p className="text-sm text-neutral-500">
                    {mode === "create"
                        ? "An admin reviews every listing before it goes live."
                        : "Saving sends your listing back for review. It stays hidden until it is approved again."}
                </p>
            </div>
        </form>
    );
}