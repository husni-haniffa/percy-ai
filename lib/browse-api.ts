import { apiFetch } from "./api";
import type { Listing, Paginated, PropertyListing, VehicleListing } from "@/types/listing";

export type Filters = Record<string, string | undefined>;

export function buildQuery(filters: Filters) {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(filters)) {
        if (value) params.set(key, value);
    }
    return params.toString();
}

export function fetchProperties(filters: Filters) {
    return apiFetch<Paginated<PropertyListing>>(
        `/api/browse/properties?${buildQuery(filters)}`
    );
}

export function fetchVehicles(filters: Filters) {
    return apiFetch<Paginated<VehicleListing>>(
        `/api/browse/vehicles?${buildQuery(filters)}`
    );
}

export type ContactInfo = { name: string; phone: string; email: string };

export function fetchListing(id: string) {
    return apiFetch<Listing>(`/api/browse/${id}`);
}

export function revealContact(id: string) {
    return apiFetch<ContactInfo>(`/api/browse/${id}/contact`, { method: "POST" });
}

export function sendInquiry(id: string) {
    return apiFetch<{ message: string }>(`/api/browse/${id}/inquiry`, { method: "POST" });
}