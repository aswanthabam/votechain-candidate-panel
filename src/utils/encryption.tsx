import * as CryptoJS from "crypto-js";

type EncryptedData = string;

export function deriveKey(
  password: string,
  salt: CryptoJS.lib.WordArray
): CryptoJS.lib.WordArray {
  return CryptoJS.PBKDF2(password, salt, {
    keySize: 256 / 32, // 256 bits
    iterations: 100000, // Adjust as needed
    hasher: CryptoJS.algo.SHA256,
  });
}

// export function encrypt(data: string, password: string): EncryptedData {
//   const salt = CryptoJS.lib.WordArray.random(128 / 8);
//   const key = deriveKey(password, salt);
//   const iv = CryptoJS.lib.WordArray.random(128 / 8);
//   const ciphertext = CryptoJS.AES.encrypt(data, key, {
//     iv: iv,
//     mode: CryptoJS.mode.CBC,
//     padding: CryptoJS.pad.Pkcs7,
//   });

//   const saltHex = salt.toString(); // Get hex strings directly
//   const ivHex = iv.toString();
//   const ciphertextHex = ciphertext.toString();

//   // Concatenate hex strings without delimiters
//   const concatenatedHex = saltHex + ivHex + ciphertextHex;
//   return concatenatedHex; // Return the final hex string
// }

export function decrypt(ciphertext: EncryptedData, password: string): string {
  const saltLength = 32; // Salt is 128 bits, represented as 32 hex characters
  const ivLength = 32; // IV is also 128 bits

  const saltHex = ciphertext.slice(0, saltLength); // Extract using lengths
  const ivHex = ciphertext.slice(saltLength, saltLength + ivLength);
  const ciphertextHex = ciphertext.slice(saltLength + ivLength);

  const salt = CryptoJS.enc.Hex.parse(saltHex); // Parse hex strings back to WordArrays
  const iv = CryptoJS.enc.Hex.parse(ivHex);
  const cipherText = CryptoJS.enc.Hex.parse(ciphertextHex);
  console.log("Salt:", salt.toString());
  console.log("IV:", iv.toString());
  console.log("Ciphertext:", cipherText.toString());
  const key = deriveKey(password, salt);
  const cipherParams = CryptoJS.lib.CipherParams.create({
    ciphertext: cipherText,
  });
  console.log("Key:", key.toString());
  const decrypted = CryptoJS.AES.decrypt(cipherParams, key, {
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
    key: key,
    iv: iv,
  });
  return decrypted.toString(CryptoJS.enc.Utf8);
}
