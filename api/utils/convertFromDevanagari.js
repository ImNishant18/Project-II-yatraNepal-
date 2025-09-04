
export const fromDevanagari = (str) => {
    const devanagariDigits = '०१२३४५६७८९';
    return str.split('').map(char => {
        const index = devanagariDigits.indexOf(char);
        return index !== -1 ? index.toString() : char;
    }).join('');
};