export function stringToSlug(str) {
    if (!str) return "";

    str = str.trim().toLowerCase();
    str = str.replace(/[^a-zA-Z0-9\s]/g, "");
    str = str.replace(/\s+/g, "-");
    return str;
}

export const toSlug = (str) => {
    if (!str) return str;

    const lowercasedStr = str.toLowerCase();

    const slug = lowercasedStr
        .replace(/\s+/g, "-")
        .replace(/[^\w\-]+/g, "")
        .replace(/\-\-+/g, "-")
        .trim();

    return slug;
};

export const fromSlug = (slug) => {
    if (!slug) return slug;

    const words = slug.split("-");

    const capitalizedWords = words.map((word) => {
        return word.charAt(0).toUpperCase() + word.slice(1);
    });

    return capitalizedWords.join(" ");
};