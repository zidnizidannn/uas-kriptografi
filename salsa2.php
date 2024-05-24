<?php
// Salsa20 quarter round function
function salsa20_quarterRound(&$a, &$b, &$c, &$d)
{
    $b ^= (($a + $d) & 0xffffffff) << 7 | (($a + $d) & 0xffffffff) >> (32 - 7);
    $c ^= (($b + $a) & 0xffffffff) << 9 | (($b + $a) & 0xffffffff) >> (32 - 9);
    $d ^= (($c + $b) & 0xffffffff) << 13 | (($c + $b) & 0xffffffff) >> (32 - 13);
    $a ^= (($d + $c) & 0xffffffff) << 18 | (($d + $c) & 0xffffffff) >> (32 - 18);
}

// Salsa20 double round function
function salsa20_doubleRound(&$x)
{
    salsa20_quarterRound($x[0], $x[4], $x[8], $x[12]);
    salsa20_quarterRound($x[5], $x[9], $x[13], $x[1]);
    salsa20_quarterRound($x[10], $x[14], $x[2], $x[6]);
    salsa20_quarterRound($x[15], $x[3], $x[7], $x[11]);

    salsa20_quarterRound($x[0], $x[5], $x[10], $x[15]);
    salsa20_quarterRound($x[1], $x[6], $x[11], $x[12]);
    salsa20_quarterRound($x[2], $x[7], $x[8], $x[13]);
    salsa20_quarterRound($x[3], $x[4], $x[9], $x[14]);
}

// Salsa20 hash function
function salsa20_hash($input)
{
    $x = $input;
    for ($i = 0; $i < 10; $i++) {
        salsa20_doubleRound($x);
    }
    return $x;
}

// Salsa20 block function
function salsa20_block($key, $nonce, $counter)
{
    $constants = [0x61707865, 0x3320646e, 0x79622d32, 0x6b206574]; // "expand 32-byte k"
    $state = array_merge(
        $constants,
        array_values(unpack('V*', $key)),
        [$counter, 0],
        array_values(unpack('V*', $nonce))
    );

    $workingState = salsa20_hash($state);
    for ($i = 0; $i < 16; $i++) {
        $workingState[$i] = ($workingState[$i] + $state[$i]) & 0xffffffff;
    }

    $output = '';
    foreach ($workingState as $word) {
        $output .= pack('V', $word);
    }
    return $output;
}

// Salsa20 encryption function
function salsa20_encrypt($plaintext, $key, $nonce)
{
    $key = str_pad($key, 32, "\0");
    $nonce = str_pad($nonce, 8, "\0");

    $ciphertext = '';
    $blockCount = ceil(strlen($plaintext) / 64);
    for ($counter = 0; $counter < $blockCount; $counter++) {
        $block = salsa20_block($key, $nonce, $counter);
        $chunk = substr($plaintext, $counter * 64, 64);
        $ciphertext .= substr($block, 0, strlen($chunk)) ^ $chunk;
    }
    return $ciphertext;
}

// Salsa20 decryption function
function salsa20_decrypt($ciphertext, $key, $nonce)
{
    return salsa20_encrypt($ciphertext, $key, $nonce);
}

// Handle user input
$key = "kunci";
$plaintext = "zidnizidan";
$nonce = '0985jg61';

// Pad or hash the key to ensure it's 32 bytes long
if (strlen($key) < 32) {
    $keypadded = str_pad($key, 32, "\0");
} else {
    $keypadded = substr(hash('sha256', $key, true), 0, 32);
}

$ciphertext = salsa20_encrypt($plaintext, $keypadded, $nonce);
$decrypted = salsa20_decrypt($ciphertext, $keypadded, $nonce);

echo "Plaintext: $plaintext<br>";
echo "Ciphertext: " . bin2hex($ciphertext) . "<br>";
echo "Decrypted: $decrypted<br> ini kuncinya: " . $key;
