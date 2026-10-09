import type { Listing } from "@/types/listing";

export type Category = "property" | "vehicle";

export const emptyValues: Record<string, string> = {
    title: "",
    description: "",
    purpose: "",
    price: "",
    city: "",
    propertyType: "",
    bedrooms: "",
    bathrooms: "",
    perches: "",
    vehicleType: "",
    brand: "",
    code: "",
    year: "",
    mileage: "",
    transmission: "",
    fuel: "",
};

// Fills the form from an existing listing (edit mode). Numbers become text.
export function valuesFromListing(listing: Listing) {
    const values = { ...emptyValues };
    for (const [key, value] of Object.entries(listing)) {
        if (key in values && value !== undefined && value !== null) {
            values[key] = String(value);
        }
    }
    return values;
}

const optionalNumber = (value: string) =>
    value.trim() === "" ? undefined : Number(value);

// Turns form text into the JSON the backend validates
export function buildPayload(
    category: Category,
    values: Record<string, string>,
    images: string[]
) {
    const base = {
        category,
        title: values.title.trim(),
        description: values.description.trim(),
        purpose: values.purpose,
        price: Number(values.price),
        city: values.city.trim(),
        images,
    };

    if (category === "property") {
        return {
            ...base,
            propertyType: values.propertyType,
            bedrooms: optionalNumber(values.bedrooms),
            bathrooms: optionalNumber(values.bathrooms),
            perches: optionalNumber(values.perches),
        };
    }

    return {
        ...base,
        vehicleType: values.vehicleType,
        brand: values.brand.trim(),
        code: values.code.trim(),
        year: Number(values.year),
        mileage: Number(values.mileage),
        transmission: values.transmission,
        fuel: values.fuel,
    };
}