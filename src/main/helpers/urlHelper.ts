/**
 * Method to check if a string is a URL.
 * @param text The text to check.
 */
export const checkIfUrl = (text: string) => {
    try {
        new URL(text);
        return true;
    } catch (error) {
        return false;
    }
};
