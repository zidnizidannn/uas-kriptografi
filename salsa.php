<?php
// Salsa20 stream cipher implementation in PHP

// Salsa20 quarter round function
function salsa20_quarterRound(&$a, &$b, &$c, &$d)
{
    $b ^= ($a + $d) << 7;
    $c ^= ($b + $a) << 9;
    $d ^= ($c + $b) << 13;
    $a ^= ($d + $c) << 18;
}

// Salsa20 doubleRound function
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
function salsa20_hash($input, $k, $n)
{
    $x = array(
        $k[0], $k[1], $k[2], $k[3],
        $k[4], $k[5], $k[6], $k[7],
        $k[8], $k[9], $k[10], $k[11],
        $k[12], $k[13], $k[14], $k[15],
        $n[0], $n[1], $n[2], $n[3],
        $input[0], $input[1], $input[2], $input[3],
        $input[4], $input[5], $input[6], $input[7],
        $input[8], $input[9], $input[10], $input[11],
        $input[12], $input[13], $input[14], $input[15]
    );

    for ($i = 0; $i < 10; $i++) {
        salsa20_doubleRound($x);
    }

    return $x;
}

// Salsa20 encryption function
function salsa20_encrypt($plaintext, $key, $nonce)
{
    $k = array_values(unpack('N*', $key));
    $n = array_values(unpack('N*', $nonce));
    $m = str_split($plaintext, 64);

    $ciphertext = '';
    $counter = 0;

    foreach ($m as $block) {
        $input = array_merge(array($counter), array_values(unpack('N*', str_pad($block, 64, "\0"))));
        $output = salsa20_hash($input, $k, $n);

        $tmp = '';
        foreach ($output as $word) {
            $tmp .= pack('N', $word);
        }

        $ciphertext .= $tmp ^ $block;
        $counter++;
    }

    return $ciphertext;
}

// Salsa20 decryption function
function salsa20_decrypt($ciphertext, $key, $nonce)
{
    return salsa20_encrypt($ciphertext, $key, $nonce);
}

// Handle user input
$key = "ini kunci";
$plaintext = "zidnizidan";
$nonce = 'qwer57uj'; // This should be generated securely

// Pad or hash the key to ensure it's 32 bytes long
if (strlen($key) < 32) {
    $key = str_pad($key, 32, "\0");
} else {
    $key = substr(hash('sha256', $key, true), 0, 32);
}

$ciphertext = salsa20_encrypt($plaintext, $key, $nonce);
$decrypted = salsa20_decrypt($ciphertext, $key, $nonce);

echo "Plaintext: $plaintext<br>";
echo "Ciphertext: " . bin2hex($ciphertext) . "<br>";
echo "Decrypted: $decrypted <br> ini kuncinya: $key";