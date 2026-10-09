import { Suspense } from "react";
import { PropertiesBrowser } from "@/components/listings/properties-browser";

export const metadata = { title: "Properties for sale and rent | Percy AI" };

export default function PropertiesPage() {
    return (
        <Suspense>
            <PropertiesBrowser />
        </Suspense>
    );
}