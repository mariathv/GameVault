//format html to plain text
export function formatDescription(text) {
    if (!text) {
        return;
    }


    let formattedText = text.replace(/<\/?[^>]+(>|$)/g, "");


    formattedText = formattedText
        .replace(/\s+/g, ' ')
        .replace(/\.(?=[^\s])/g, '. ')
        .replace(/,(?=[^\s])/g, ', ')
        .trim();


    formattedText = formattedText.replace(/overview/i, "");
    return formattedText;
}
