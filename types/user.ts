export type Plan = {
    _id: string;
    name: string;
    durationDays: number;
    maxListings: number;
};

export type AppUser = {
    _id: string;
    name: string;
    email: string;
    phone: string;
    createdAt: string;
};

export type Subscription = {
    _id: string;
    plan: Plan;
    startedAt: string;
    expiresAt: string;
};

export type MeResponse =
    | { onboarded: false }
    | { onboarded: true; user: AppUser; subscription: Subscription | null };