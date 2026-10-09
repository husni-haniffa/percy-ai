export type ListingField = {
    name: string;
    label: string;
    type: "text" | "number" | "select" | "textarea";
    placeholder?: string;
    hint?: string;
    options?: { value: string; label: string }[];
    half?: boolean;
    thousands?: boolean;
    validate: (value: string) => string | undefined;
};

// ---- Check functions: each returns an error message, or nothing if the value is fine ----

const text = (label: string, min: number, max: number) => (value: string) => {
    const length = value.trim().length;
    if (length === 0) return `${label} is required`;
    if (length < min) return `${label} must be at least ${min} characters`;
    if (length > max) return `${label} must be at most ${max} characters`;
};

const choose = (label: string) => (value: string) =>
    value ? undefined : `Please choose ${label}`;

const positiveNumber = (label: string) => (value: string) => {
    if (value.trim() === "") return `${label} is required`;
    const number = Number(value);
    if (Number.isNaN(number) || number <= 0) return `${label} must be greater than 0`;
};

const zeroOrMore = (label: string) => (value: string) => {
    if (value.trim() === "") return `${label} is required`;
    const number = Number(value);
    if (Number.isNaN(number) || number < 0) return `${label} must be 0 or more`;
};

const optionalWholeNumber = (label: string) => (value: string) => {
    if (value.trim() === "") return undefined;
    const number = Number(value);
    if (!Number.isInteger(number) || number < 0) {
        return `${label} must be a whole number, 0 or more`;
    }
};

const optionalPositive = (label: string) => (value: string) => {
    if (value.trim() === "") return undefined;
    return Number(value) > 0 ? undefined : `${label} must be greater than 0`;
};

const year = (value: string) => {
    if (value.trim() === "") return "Year is required";
    const number = Number(value);
    const latest = new Date().getFullYear() + 1;
    if (!Number.isInteger(number) || number < 1950 || number > latest) {
        return `Year must be between 1950 and ${latest}`;
    }
};

// ---- The fields ----

const choice = (items: [string, string][]) => [
    { value: "", label: "Choose..." },
    ...items.map(([value, label]) => ({ value, label })),
];

export const commonFields: ListingField[] = [
    {
        name: "title",
        label: "Title",
        type: "text",
        placeholder: "e.g. 3 bedroom house near Negombo",
        validate: text("Title", 3, 100),
    },
    {
        name: "purpose",
        label: "Sale or rent",
        type: "select",
        half: true,
        options: choice([
            ["sale", "For sale"],
            ["rent", "For rent"],
        ]),
        validate: choose("sale or rent"),
    },
    {
        name: "price",
        label: "Price (Rs.)",
        type: "number",
        half: true,
        thousands: true,  
        placeholder: "e.g. 28000000",
        validate: positiveNumber("Price"),
    },
    {
        name: "city",
        label: "City",
        type: "text",
        placeholder: "e.g. Negombo",
        validate: text("City", 2, 50),
    },
    {
        name: "description",
        label: "Description",
        type: "textarea",
        hint: "Describe what makes it special. Between 10 and 2000 characters.",
        validate: text("Description", 10, 2000),
    },
];

export const propertyFields: ListingField[] = [
    {
        name: "propertyType",
        label: "Property type",
        type: "select",
        half: true,
        options: choice([
            ["house", "House"],
            ["apartment", "Apartment"],
            ["land", "Land"],
            ["commercial", "Commercial"],
        ]),
        validate: choose("a property type"),
    },
    {
        name: "bedrooms",
        label: "Bedrooms (optional)",
        type: "number",
        half: true,
        validate: optionalWholeNumber("Bedrooms"),
    },
    {
        name: "bathrooms",
        label: "Bathrooms (optional)",
        type: "number",
        half: true,
        validate: optionalWholeNumber("Bathrooms"),
    },
    {
        name: "perches",
        label: "Land size in perches (optional)",
        type: "number",
        half: true,
        validate: optionalPositive("Land size"),
    },
];

export const vehicleFields: ListingField[] = [
    {
        name: "vehicleType",
        label: "Vehicle type",
        type: "select",
        half: true,
        options: choice([
            ["car", "Car"],
            ["van", "Van"],
            ["suv", "SUV"],
            ["motorbike", "Motorbike"],
            ["three-wheeler", "Three-wheeler"],
            ["lorry", "Lorry"],
        ]),
        validate: choose("a vehicle type"),
    },
    {
        name: "brand",
        label: "Brand",
        type: "text",
        half: true,
        placeholder: "e.g. Toyota",
        validate: text("Brand", 1, 50),
    },
    {
        name: "code",
        label: "Model",
        type: "text",
        half: true,
        placeholder: "e.g. Aqua",
        validate: text("Model", 1, 50),
    },
    {
        name: "year",
        label: "Year",
        type: "number",
        half: true,
        placeholder: "e.g. 2016",
        validate: year,
    },
    {
        name: "mileage",
        label: "Mileage (km)",
        type: "number",
        half: true,
        thousands: true,  
        validate: zeroOrMore("Mileage"),
    },
    {
        name: "transmission",
        label: "Gearbox",
        type: "select",
        half: true,
        options: choice([
            ["manual", "Manual"],
            ["automatic", "Automatic"],
        ]),
        validate: choose("a gearbox type"),
    },
    {
        name: "fuel",
        label: "Fuel",
        type: "select",
        half: true,
        options: choice([
            ["petrol", "Petrol"],
            ["diesel", "Diesel"],
            ["hybrid", "Hybrid"],
            ["electric", "Electric"],
        ]),
        validate: choose("a fuel type"),
    },
];