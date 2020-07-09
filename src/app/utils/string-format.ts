export function removeNonASCII(input: string): string {
    return input.replace(/^[\u0080-\uffff]/g, "").replace(/[^\x20-\x7E]+/g, "").trim()
}
