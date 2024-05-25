// Fungsi untuk mengenkripsi teks menggunakan Caesar Cipher
function encrypt(text, shift) {
    return text.split('').map(char => {
        // Memeriksa apakah karakter adalah huruf
        if (char.match(/[a-z]/i)) {
            let code = char.charCodeAt(0);

            // Menggunakan aturan untuk huruf besar
            if (code >= 65 && code <= 90) {
                return String.fromCharCode(((code - 65 + shift) % 26) + 65);
            }

            // Menggunakan aturan untuk huruf kecil
            if (code >= 97 && code <= 122) {
                return String.fromCharCode(((code - 97 + shift) % 26) + 97);
            }
        }

        // Jika bukan huruf, biarkan tetap
        return char;
    }).join('');
}

// Fungsi untuk mendekripsi teks menggunakan Caesar Cipher
function decrypt(text, shift) {
    return encrypt(text, -shift);
}

// Contoh penggunaan
let text = "Hello, World!";
let shift = 3;

let encrypted = encrypt(text, shift);
console.log("Encrypted:", encrypted);  // Khoor, Zruog!

let decrypted = decrypt(encrypted, shift);
console.log("Decrypted:", decrypted);  // Hello, World!
