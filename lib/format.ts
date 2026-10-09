export function formatPrice(price: number) {
    return `Rs. ${price.toLocaleString("en-US")}`;
}

export function formatNumber(value: number) {
    return value.toLocaleString("en-US");
}

export function capitalize(text: string) {
    return text.charAt(0).toUpperCase() + text.slice(1);
}

export function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

export function daysLeft(iso: string) {
    const msPerDay = 1000 * 60 * 60 * 24;
    return Math.max(0, Math.ceil((new Date(iso).getTime() - Date.now()) / msPerDay));
}

// "28000000" becomes "28,000,000"
export function formatThousands(digits: string) {
    return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}