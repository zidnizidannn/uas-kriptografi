import random

def caesarString(plaintext, key):
    alphabet = "abcdefghijklmnopqrstuvwxyz"
    
    ciphertext = ""
    kpos = alphabet.find(key)
    
    while len(key) < len(plaintext):
        key += random.choice(alphabet)
    
    for char in plaintext:
        pos = (alphabet.find(char) + kpos) % 26
        ciphertext += alphabet[pos]
        
    return ciphertext, key

def decryptCaesarString(ciphertext, key):
    alphabet = "abcdefghijklmnopqrstuvwxyz"
    
    plaintext = ""
    kpos = alphabet.find(key)
    
    ciphertext = ciphertext.lower()
    
    for char in ciphertext:
        pos = (alphabet.find(char) - kpos) % 26
        plaintext += alphabet[pos]
        
    return plaintext

# Example usage
plaintext = "nama saya zidni"
key = "aku"

encrypted_text, new_key = caesarString(plaintext, key)
print("Encrypted Text:", encrypted_text)
print("Key Used:", new_key)

decrypted_text = decryptCaesarString(encrypted_text, key)
print("Decrypted Text:", decrypted_text)
