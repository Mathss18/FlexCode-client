import Utf8 from "crypto-js/enc-utf8";
import CryptoJS from "crypto-js";

const CRYPTO_KEY = process.env.REACT_APP_CRYPTOJS_KEY;

export function encrypt(plaintext) {
  var aesString = CryptoJS.AES.encrypt(plaintext.toString(),CRYPTO_KEY).toString(); // Encrypt the plaintext string using AES
  var wordArray = CryptoJS.enc.Utf8.parse(aesString); // Convert the encrypted string to a word array
  var base64 = CryptoJS.enc.Base64.stringify(wordArray); // Convert the word array to a base64 encoded string
  var uriFriendlyBase64 = encodeURIComponent(base64); // Encode the base64 string to make it URI friendly

  return uriFriendlyBase64;
}
export function decrypt(cipher) {
  var base64 = decodeURIComponent(cipher); // Decode the base64 string
  var parsedWordArray = CryptoJS.enc.Base64.parse(base64); // Convert the base64 encoded string to a word array
  var parsedStr = parsedWordArray.toString(CryptoJS.enc.Utf8); // Convert the word array to a UTF-8 encoded string
  var decrypted = CryptoJS.AES.decrypt(parsedStr, CRYPTO_KEY).toString(Utf8); // Decrypt the string using AES

  return decrypted;
}
