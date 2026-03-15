export default function isStrongPassword(pw, emailLocalPart = "") {
    if (!pw || pw.length < 12) return { valid: false, message: "Password must be at least 12 characters" };
    if (/\s/.test(pw)) return { valid: false, message: "Password must not contain spaces" };
    if (emailLocalPart && pw.toLowerCase().includes(emailLocalPart.toLowerCase())) {
    return { valid: false, message: "Password should not contain your email" };
    }

    const checks = {
    upper: /[A-Z]/.test(pw),
    lower: /[a-z]/.test(pw),
    digit: /\d/.test(pw),
    special: /[!@#$%^&*()\[\]{};:'",.<>/?\\|`~_\-+=]/.test(pw)
    };
    if (!checks.upper) return { valid: false, message: "Password must include Upper case letters" };
    if (!checks.lower) return { valid: false, message: "Password must include Lower case letters" };
    if (!checks.digit) return { valid: false, message: "Password must include digits" };
    if (!checks.special) return { valid: false, message: "Password must include special characters" };

    return { valid: true };
}
