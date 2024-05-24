const caesar = require('./caesar-cipher');

// Enkripsi
const encrypted = caesar.encrypt('Pesan Rahasia', 3); // Menggeser 3 posisi
console.log(encrypted); // Output: 'Shvdq Udkdvld'

// Dekripsi
const decrypted = caesar.decrypt(encrypted, 3);
console.log(decrypted); // Output: 'Pesan Rahasia'