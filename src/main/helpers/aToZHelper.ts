export class AToZHelper {
    public static generateAlphabetObject(): object {
        // create the object for the possible alphabet options
        const alphabetOptions = {};

        for (let i = 0; i < 26; i++) {
            const letter = String.fromCharCode(65 + i);
            alphabetOptions[letter] = {};
        }

        return alphabetOptions;
    }
}
