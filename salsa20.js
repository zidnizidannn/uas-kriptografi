// Salsa20 stream cipher implementation in JavaScript

// Salsa20 quarter round function
function salsa20_quarterRound(x, a, b, c, d) {
    x[b] ^= ((x[a] + x[d]) << 7) | ((x[a] + x[d]) >>> (32 - 7));
    x[c] ^= ((x[b] + x[a]) << 9) | ((x[b] + x[a]) >>> (32 - 9));
    x[d] ^= ((x[c] + x[b]) << 13) | ((x[c] + x[b]) >>> (32 - 13));
    x[a] ^= ((x[d] + x[c]) << 18) | ((x[d] + x[c]) >>> (32 - 18));
}

// Salsa20 double round function
function salsa20_doubleRound(x) {
    // Column rounds
    salsa20_quarterRound(x, 0, 4, 8, 12);
    salsa20_quarterRound(x, 5, 9, 13, 1);
    salsa20_quarterRound(x, 10, 14, 2, 6);
    salsa20_quarterRound(x, 15, 3, 7, 11);
    // Row rounds
    salsa20_quarterRound(x, 0, 1, 2, 3);
    salsa20_quarterRound(x, 5, 6, 7, 4);
    salsa20_quarterRound(x, 10, 11, 8, 9);
    salsa20_quarterRound(x, 15, 12, 13, 14);
}

// Salsa20 hash function
function salsa20_hash(input, k, n) {
    let x = [
        ...k.slice(0, 16),
        ...n.slice(0, 4),
        ...input.slice(0, 16)
    ];

    for (let i = 0; i < 10; i++) {
        salsa20_doubleRound(x);
    }

    return x;
}

// Salsa20 encryption function
function salsa20_encrypt(plaintext, key, nonce) {
    let k = new Uint32Array(new TextEncoder().encode(key).buffer);
    let n = new Uint32Array(new TextEncoder().encode(nonce).buffer);
    let blocks = [];

    for (let i = 0; i < plaintext.length; i += 64) {
        blocks.push(plaintext.slice(i, i + 64));
    }

    let ciphertext = '';
    let counter = new Uint32Array(1);

    for (let block of blocks) {
        let blockBuffer = new TextEncoder().encode(block);
        let paddedBlockBuffer = new Uint8Array(64);
        paddedBlockBuffer.set(blockBuffer);

        let input = new Uint32Array([...counter, ...new Uint32Array(paddedBlockBuffer.buffer)]);
        let output = salsa20_hash(input, k, n);

        let tmp = '';
        for (let word of output) {
            let wordBytes = new Uint8Array(new Uint32Array([word]).buffer);
            tmp += String.fromCharCode(...wordBytes);
        }

        for (let i = 0; i < blockBuffer.length; i++) {
            ciphertext += String.fromCharCode(tmp.charCodeAt(i) ^ blockBuffer[i]);
        }
        counter[0]++;
    }

    return ciphertext;
}

// Salsa20 decryption function
function salsa20_decrypt(ciphertext, key, nonce) {
    return salsa20_encrypt(ciphertext, key, nonce);
}

// Handle user input
let key = "ini kunci";
let plaintext = "zidnizidan";
let nonce = 'qwer57uj'; // Ini harus dihasilkan secara aman

// Mengatur padding atau hash kunci agar panjangnya 32 byte
if (key.length < 32) {
    key = key.padEnd(32, "\0");
} else {
    key = new TextDecoder().decode(new Uint8Array((new TextEncoder().encode(key)).buffer).slice(0, 32));
}

let ciphertext = salsa20_encrypt(plaintext, key, nonce);
let decrypted = salsa20_decrypt(ciphertext, key, nonce);

console.log("Plaintext: " + plaintext);
console.log("Ciphertext: " + btoa(ciphertext)); // btoa digunakan untuk encoding base64
console.log("Decrypted: " + decrypted);
console.log("Key: " + key);