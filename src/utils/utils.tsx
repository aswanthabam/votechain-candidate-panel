export const generateRandomKey = (minimum: number, maximum: number) => {
  const characters =
    "abcdefghijklmnopqrstuvwxyz_ABCDEFGHIJKLMNOPQRSTUVWXYZ-0123456789";

  const keyLength =
    Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;

  let randomKey = "";
  for (let i = 0; i < keyLength; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomKey += characters.charAt(randomIndex);
  }

  return randomKey;
};
