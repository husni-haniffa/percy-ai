"use client";

import { fetchVehicles } from "@/lib/browse-api";
import { vehicleFields } from "@/lib/filter-fields";
import { BrowsePage } from "./browse-page";

export function VehiclesBrowser() {
    return (
        <BrowsePage
            title="Vehicles"
            subtitle="Cars, vans, bikes and more from owners across Sri Lanka."
            queryKey="vehicles"
            fields={vehicleFields}
            fetcher={fetchVehicles}
        />
    );
}