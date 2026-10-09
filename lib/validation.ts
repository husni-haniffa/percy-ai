import { type } from "arktype";

export function isValidSriLankanPhone(input: string) {
    const cleaned = input.replace(/[\s-]/g, "");
    return /^07\d{8}$/.test(cleaned) || /^\+947\d{8}$/.test(cleaned);
}

export const phoneSchema = type("string").narrow(
    (value, ctx) =>
        isValidSriLankanPhone(value) ||
        ctx.mustBe("a valid Sri Lankan mobile number, like 0771234567")
);