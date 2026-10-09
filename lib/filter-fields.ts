import { FilterField } from "@/components/listings/filter-form";


const purposeField: FilterField = {
    name: "purpose",
    label: "Looking for",
    type: "select",
    options: [
        { value: "", label: "Buy or rent" },
        { value: "sale", label: "For sale" },
        { value: "rent", label: "For rent" },
    ],
};

const cityField: FilterField = {
    name: "city",
    label: "City",
    type: "text",
    placeholder: "e.g. Negombo",
};

const priceFields: FilterField[] = [
    { name: "minPrice", label: "Min price (Rs.)", type: "number", half: true, thousands: true },
    { name: "maxPrice", label: "Max price (Rs.)", type: "number", half: true, thousands: true },
];

export const propertyFields: FilterField[] = [
    purposeField,
    cityField,
    {
        name: "propertyType",
        label: "Property type",
        type: "select",
        options: [
            { value: "", label: "Any type" },
            { value: "house", label: "House" },
            { value: "apartment", label: "Apartment" },
            { value: "land", label: "Land" },
            { value: "commercial", label: "Commercial" },
        ],
    },
    {
        name: "minBedrooms",
        label: "Bedrooms",
        type: "select",
        options: [
            { value: "", label: "Any" },
            { value: "1", label: "1+" },
            { value: "2", label: "2+" },
            { value: "3", label: "3+" },
            { value: "4", label: "4+" },
            { value: "5", label: "5+" },
        ],
    },
    ...priceFields,
];

export const vehicleFields: FilterField[] = [
    purposeField,
    cityField,
    {
        name: "vehicleType",
        label: "Vehicle type",
        type: "select",
        options: [
            { value: "", label: "Any type" },
            { value: "car", label: "Car" },
            { value: "van", label: "Van" },
            { value: "suv", label: "SUV" },
            { value: "motorbike", label: "Motorbike" },
            { value: "three-wheeler", label: "Three-wheeler" },
            { value: "lorry", label: "Lorry" },
        ],
    },
    { name: "brand", label: "Brand", type: "text", placeholder: "e.g. Toyota" },
    {
        name: "fuel",
        label: "Fuel",
        type: "select",
        half: true,
        options: [
            { value: "", label: "Any" },
            { value: "petrol", label: "Petrol" },
            { value: "diesel", label: "Diesel" },
            { value: "hybrid", label: "Hybrid" },
            { value: "electric", label: "Electric" },
        ],
    },
    {
        name: "transmission",
        label: "Gearbox",
        type: "select",
        half: true,
        options: [
            { value: "", label: "Any" },
            { value: "manual", label: "Manual" },
            { value: "automatic", label: "Automatic" },
        ],
    },
    { name: "minYear", label: "Year from", type: "number", half: true },
    { name: "maxMileage", label: "Max km", type: "number", half: true, thousands: true },
    ...priceFields,
];