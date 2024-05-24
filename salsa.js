// Fungsi untuk mengonversi string heksadesimal menjadi array byte
function hexToBytes(hex) {
    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i < hex.length; i += 2) {
        bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
    }
    return bytes;
}

// Fungsi untuk mengonversi array byte menjadi array 32-bit
function bytesToWords(bytes) {
    const words = new Uint32Array(bytes.length / 4);
    for (let i = 0; i < bytes.length; i += 4) {
        words[i / 4] = (bytes[i] << 24) | (bytes[i + 1] << 16) | (bytes[i + 2] << 8) | bytes[i + 3];
    }
    return words;
}

// Fungsi quarter round Salsa20
function salsa20_quarterRound(a, b, c, d) {
    b ^= (a + d) << 7;
    c ^= (b + a) << 9;
    d ^= (c + b) << 13;
    a ^= (d + c) << 18;
    return [a, b, c, d];
}

// Fungsi double round Salsa20
function salsa20_doubleRound(x) {
    [x[0], x[4], x[8], x[12]] = salsa20_quarterRound(x[0], x[4], x[8], x[12]);
    [x[5], x[9], x[13], x[1]] = salsa20_quarterRound(x[5], x[9], x[13], x[1]);
    [x[10], x[14], x[2], x[6]] = salsa20_quarterRound(x[10], x[14], x[2], x[6]);
    [x[15], x[3], x[7], x[11]] = salsa20_quarterRound(x[15], x[3], x[7], x[11]);
    [x[0], x[5], x[10], x[15]] = salsa20_quarterRound(x[0], x[5], x[10], x[15]);
    [x[1], x[6], x[11], x[12]] = salsa20_quarterRound(x[1], x[6], x[11], x[12]);
    [x[2], x[7], x[8], x[13]] = salsa20_quarterRound(x[2], x[7], x[8], x[13]);
    [x[3], x[4], x[9], x[14]] = salsa20_quarterRound(x[3], x[4], x[9], x[14]);
    return x;
}

// Fungsi hash Salsa20
function salsa20_hash(input, k, n) {
    let x = new Uint32Array(k.length + n.length + input.length);
    x.set(k);
    x.set(n, k.length);
    x.set(input, k.length + n.length);

    for (let i = 0; i < 10; i++) {
        x = salsa20_doubleRound(x);
    }
    return x;
}

// Fungsi enkripsi Salsa20
function salsa20_encrypt(plaintext, key, nonce) {
    const k = bytesToWords(key);
    const n = bytesToWords(nonce);
    let ciphertext = '';
    let counter = 0;
    const blocks = plaintext.match(/.{1,64}/g) || [''];
    for (let i = 0; i < blocks.length; i++) {
        const block = blocks[i].padEnd(64, '\0');
        const input = new Uint32Array([counter].concat(block.match(/.{1,4}/g).map(byte => parseInt(byte, 16) || 0)));
        const output = new Uint32Array(salsa20_hash(input, k, n));
        const tmp = new Uint8Array(output.buffer);
        const blockCipher = new Uint8Array(block.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
        for (let j = 0; j < blockCipher.length; j++) {
            ciphertext += String.fromCharCode(blockCipher[j] ^ tmp[j]);
        }
        counter++;
    }
    return ciphertext;
}

// Fungsi dekripsi Salsa20
function salsa20_decrypt(ciphertext, key, nonce) {
    return salsa20_encrypt(ciphertext, key, nonce);
}

// Contoh penggunaan
const key = hexToBytes('696e69206b756e6369'); // 'ini kunci' dalam heksadesimal
const plaintext = 'zidnizidan';
const nonce = hexToBytes('71776572353775'); // 'qwer57uj' dalam heksadesimal

const ciphertext = salsa20_encrypt(plaintext, key, nonce);
const decrypted = salsa20_decrypt(ciphertext, key, nonce);

console.log('Plaintext:', plaintext);
console.log('Ciphertext:', Buffer.from(ciphertext).toString('hex'));
console.log('Decrypted:', decrypted);