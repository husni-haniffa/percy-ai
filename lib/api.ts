const API_URL = process.env.NEXT_PUBLIC_API_URL;

export class ApiError extends Error {
    status: number;

    constructor(message: string, status: number) {
        super(message);
        this.status = status;
    }
}

type Options = RequestInit & { token?: string | null };

export async function apiFetch<T>(path: string, options: Options = {}): Promise<T> {
    const { token, ...rest } = options;

    const headers = new Headers(rest.headers);
    if (rest.body) headers.set("Content-Type", "application/json");
    if (token) headers.set("Authorization", `Bearer ${token}`);

    const response = await fetch(`${API_URL}${path}`, { ...rest, headers });
    const data = await response.json().catch(() => null);

    if (!response.ok) {
        throw new ApiError(data?.message ?? "Something went wrong", response.status);
    }
    return data as T;
}