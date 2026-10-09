"use client";

import { fetchProperties } from "@/lib/browse-api";
import { propertyFields } from "@/lib/filter-fields";
import { BrowsePage } from "./browse-page";

export function PropertiesBrowser() {
    return (
        <BrowsePage
            title="Properties"
            subtitle="Houses, apartments, land and commercial spaces across Sri Lanka."
            queryKey="properties"
            fields={propertyFields}
            fetcher={fetchProperties}
        />
    );
}