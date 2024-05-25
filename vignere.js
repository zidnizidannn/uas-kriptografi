// Fungsi untuk menghasilkan kunci yang diperpanjang agar sesuai dengan panjang teks
function generateKey(text, key) {
    key = key.split('');
    if (key.length >= text.length) {
        return key.join('');
    } else {
        for (let i = 0; key.length < text.length; i++) {
            key.push(key[i % key.length]);
        }
    }
    return key.join('');
}

// Fungsi untuk mengenkripsi teks menggunakan Vigenère Cipher
function encrypt(text, key) {
    key = generateKey(text, key);
    let encryptedText = '';

    for (let i = 0; i < text.length; i++) {
        // Memeriksa apakah karakter adalah huruf
        if (text[i].match(/[a-z]/i)) {
            let textCode = text.charCodeAt(i);
            let keyCode = key.charCodeAt(i);

            // Menggunakan aturan untuk huruf besar
            if (textCode >= 65 && textCode <= 90) {
                encryptedText += String.fromCharCode(((textCode - 65 + (keyCode - 65)) % 26) + 65);
            }
            // Menggunakan aturan untuk huruf kecil
            else if (textCode >= 97 && textCode <= 122) {
                encryptedText += String.fromCharCode(((textCode - 97 + (keyCode - 97)) % 26) + 97);
            }
        } else {
            encryptedText += text[i];  // Tetap biarkan karakter selain huruf
        }
    }
    return encryptedText;
}

// Fungsi untuk mendekripsi teks menggunakan Vigenère Cipher
function decrypt(text, key) {
    key = generateKey(text, key);
    let decryptedText = '';

    for (let i = 0; i < text.length; i++) {
        // Memeriksa apakah karakter adalah huruf
        if (text[i].match(/[a-z]/i)) {
            let textCode = text.charCodeAt(i);
            let keyCode = key.charCodeAt(i);

            // Menggunakan aturan untuk huruf besar
            if (textCode >= 65 && textCode <= 90) {
                decryptedText += String.fromCharCode(((textCode - 65 - (keyCode - 65) + 26) % 26) + 65);
            }
            // Menggunakan aturan untuk huruf kecil
            else if (textCode >= 97 && textCode <= 122) {
                decryptedText += String.fromCharCode(((textCode - 97 - (keyCode - 97) + 26) % 26) + 97);
            }
        } else {
            decryptedText += text[i];  // Tetap biarkan karakter selain huruf
        }
    }
    return decryptedText;
}

// Contoh penggunaan
let text = "Hello, World!";
let key = "KEY";

let encrypted = encrypt(text, key);
console.log("Encrypted:", encrypted);  // RIJVS, UYVJN!

let decrypted = decrypt(encrypted, key);
console.log("Decrypted:", decrypted);  // Hello, World!