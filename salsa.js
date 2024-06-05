// Fungsi quarter round Salsa20
function salsa20_quarterRound(a, b, c, d) {
    b ^= ((a + d) & 0xffffffff) << 7 | ((a + d) & 0xffffffff) >>> (32 - 7);
    c ^= ((b + a) & 0xffffffff) << 9 | ((b + a) & 0xffffffff) >>> (32 - 9);
    d ^= ((c + b) & 0xffffffff) << 13 | ((c + b) & 0xffffffff) >>> (32 - 13);
    a ^= ((d + c) & 0xffffffff) << 18 | ((d + c) & 0xffffffff) >>> (32 - 18);
}

// Fungsi double round Salsa20
function salsa20_doubleRound(x) {
    salsa20_quarterRound(x[0], x[4], x[8], x[12]);
    salsa20_quarterRound(x[5], x[9], x[13], x[1]);
    salsa20_quarterRound(x[10], x[14], x[2], x[6]);
    salsa20_quarterRound(x[15], x[3], x[7], x[11]);
    salsa20_quarterRound(x[0], x[5], x[10], x[15]);
    salsa20_quarterRound(x[1], x[6], x[11], x[12]);
    salsa20_quarterRound(x[2], x[7], x[8], x[13]);
    salsa20_quarterRound(x[3], x[4], x[9], x[14]);
}

// Salsa20 hash function
function salsa20_hash(input) {
    const x = [...input];
    for (let i = 0; i < 10; i++) {
        salsa20_doubleRound(x);
    }
    return x;
}

// Salsa20 block function
function salsa20_block(key, nonce, counter) {
    const constants = [0x61707865, 0x3320646e, 0x79622d32, 0x6b206574]; // "expand 32-byte k"
    const state = [
        ...constants,
        ...Array.from(new Uint32Array(key.buffer)),
        counter,
        0,
        ...Array.from(new Uint32Array(nonce.buffer)),
    ];
    const workingState = salsa20_hash(state);
    for (let i = 0; i < 16; i++) {
        workingState[i] = (workingState[i] + state[i]) & 0xffffffff;
    }
    const output = new Uint8Array(64);
    for (let i = 0; i < 16; i++) {
        output.set(new Uint8Array((new Uint32Array([workingState[i]])).buffer), i * 4);
    }
    return output;
}

// Salsa20 encryption function
function salsa20_encrypt(plaintext, key, nonce) {
    const paddedKey = new Uint8Array(32);
    paddedKey.set(new TextEncoder().encode(key));
    const paddedNonce = new Uint8Array(8);
    paddedNonce.set(new TextEncoder().encode(nonce));
    let ciphertext = new Uint8Array();
    const blockCount = Math.ceil(plaintext.length / 64);
    for (let counter = 0; counter < blockCount; counter++) {
        const block = salsa20_block(paddedKey, paddedNonce, counter);
        const chunk = new TextEncoder().encode(plaintext.slice(counter * 64, (counter + 1) * 64));
        const encryptedChunk = new Uint8Array(chunk.length);
        for (let i = 0; i < chunk.length; i++) {
            encryptedChunk[i] = chunk[i] ^ block[i];
        }
        ciphertext = new Uint8Array([...ciphertext, ...encryptedChunk]);
    }
    return ciphertext;
}

// Salsa20 decryption function
function salsa20_decrypt(ciphertext, key, nonce) {
    const paddedKey = new Uint8Array(32);
    paddedKey.set(new TextEncoder().encode(key));
    const paddedNonce = new Uint8Array(8);
    paddedNonce.set(new TextEncoder().encode(nonce));
    let plaintext = new Uint8Array();
    const blockCount = Math.ceil(ciphertext.length / 64);
    for (let counter = 0; counter < blockCount; counter++) {
        const block = salsa20_block(paddedKey, paddedNonce, counter);
        const chunk = ciphertext.slice(counter * 64, (counter + 1) * 64);
        const decryptedChunk = new Uint8Array(chunk.length);
        for (let i = 0; i < chunk.length; i++) {
            decryptedChunk[i] = chunk[i] ^ block[i];
        }
        plaintext = new Uint8Array([...plaintext, ...decryptedChunk]);
    }
    return new TextDecoder().decode(plaintext);
}

function uint8ArrayToHex(uint8Array) {
    return Array.from(uint8Array, byte => byte.toString(16).padStart(2, '0')).join('');
}

// Fungsi untuk mengonversi string hex menjadi Uint8Array
function hexToUint8Array(hexString) {
    const length = hexString.length;
    const uint8Array = new Uint8Array(length / 2);
    for (let i = 0; i < length; i += 2) {
        uint8Array[i / 2] = parseInt(hexString.substr(i, 2), 16);
    }
    return uint8Array;
}
