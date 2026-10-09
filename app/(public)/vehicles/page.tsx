import { Suspense } from "react";
import { VehiclesBrowser } from "@/components/listings/vehicles-browser";

export const metadata = { title: "Vehicles for sale and rent | Percy AI" };

export default function VehiclesPage() {
    return (
        <Suspense>
            <VehiclesBrowser />
        </Suspense>
    );
}