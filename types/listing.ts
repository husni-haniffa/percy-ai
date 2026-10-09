export type Purpose = "sale" | "rent";
export type ListingStatus = "pending" | "approved" | "rejected" | "removed";

type BaseListing = {
    _id: string;
    matchScore?: number;
    title: string;
    description: string;
    purpose: Purpose;
    price: number;
    city: string;
    images: string[];
    status: ListingStatus;
    approvedAt?: string;
    expiresAt?: string;
    createdAt: string;
    updatedAt: string;
    // Only present when the owner loads their own listings
    rejectionReason?: string;
    removalReason?: string;
    views?: number;
    inquiries?: number;
    contactInfoViews?: number;
};

export type PropertyListing = BaseListing & {
    category: "property";
    propertyType: "house" | "apartment" | "land" | "commercial";
    bedrooms?: number;
    bathrooms?: number;
    perches?: number;
};

export type VehicleListing = BaseListing & {
    category: "vehicle";
    vehicleType: "car" | "van" | "suv" | "motorbike" | "three-wheeler" | "lorry";
    brand: string;
    code: string;
    year: number;
    mileage: number;
    transmission: "manual" | "automatic";
    fuel: "petrol" | "diesel" | "hybrid" | "electric";
};

export type Listing = PropertyListing | VehicleListing;

export type Paginated<T> = {
    items: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
};