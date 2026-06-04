const CHARACTERS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

/** Creates a 6-character randomized short code (legacy serializer behavior). */
export function generateShortCode(length = 6): string {
  let result = "";
  for (let i = 0; i < length; i++) {
    result += CHARACTERS.charAt(
      Math.floor(Math.random() * CHARACTERS.length)
    );
  }
  return result;
}
