export const validation = {
    isAlphabetic(value, pattern) {
        if (pattern.test(value)) return null;

        return 'Provided value should have alphabetic characters only.';
    },
    isNumeric(value, pattern) {
        if (pattern.test(value)) return null;

        return 'Provided value should have numeric characters only.';
    },
    isEmail(value, pattern) {
        if (pattern.test(value)) return null;

        return 'Provided value should be an email address.';
    },
    minLength(value, minValue) {
        if (value.length >= minValue) return null;

        return `Provided value should have minimum length of ${minValue}.`;
    }
};
