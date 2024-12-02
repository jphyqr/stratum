// lib/encryption.ts
import { box, randomBytes } from 'tweetnacl';
import {
  decodeBase64,
  encodeBase64,
  encodeUTF8,
  decodeUTF8
} from 'tweetnacl-util';

export function decodeMessage(encryptedMessageBase64: string, privateKeyBase64: string): string {
    try {
      // Debug key sizes
      console.log('Debug key lengths:', {
        privateKeyBase64Length: privateKeyBase64.length,
        encryptedMessageLength: encryptedMessageBase64.length
      });
  
      // Split the private key - it contains both secret key and public key concatenated
      const privateKeyUint8 = decodeBase64(privateKeyBase64);
      const secretKey = privateKeyUint8.slice(0, box.secretKeyLength);
  
      console.log('Key sizes:', {
        fullPrivateKey: privateKeyUint8.length,
        secretKeyLength: secretKey.length,
        expectedLength: box.secretKeyLength
      });
  
      // Decode the full encrypted message
      const fullMessage = decodeBase64(encryptedMessageBase64);
      
      // Extract the components
      const ephemeralPublicKey = fullMessage.slice(0, box.publicKeyLength);
      const nonce = fullMessage.slice(
        box.publicKeyLength,
        box.publicKeyLength + box.nonceLength
      );
      const ciphertext = fullMessage.slice(box.publicKeyLength + box.nonceLength);
  
      // Decrypt using just the secret key portion
      const decrypted = box.open(
        ciphertext,
        nonce,
        ephemeralPublicKey,
        secretKey // Using just the secret key portion
      );
  
      if (!decrypted) {
        throw new Error('Decryption failed');
      }
  
      return encodeUTF8(decrypted);
    } catch (error) {
      console.error('Decryption error:', error);
      throw error;
    }
  }
  
  // Helper to verify keys
  export function verifyKeys() {
    try {
      const testMessage = 'test';
      const publicKey = process.env.NEXT_PUBLIC_ENCRYPTION_KEY!;
      const privateKey = process.env.ENCRYPTION_PRIVATE_KEY!;
  
      // Test encryption
      const encrypted = encryptMessage(testMessage, publicKey);
      const decrypted = decodeMessage(encrypted, privateKey);
  
      return testMessage === decrypted;
    } catch (error) {
      console.error('Key verification failed:', error);
      return false;
    }
  }
  
  export function encryptMessage(message: string, publicKeyBase64: string): string {
    const messageUint8 = decodeUTF8(message);
    const publicKeyUint8 = decodeBase64(publicKeyBase64);
    const ephemeralKeyPair = box.keyPair();
    const nonce = randomBytes(box.nonceLength);
    
    const encryptedMessage = box(
      messageUint8,
      nonce,
      publicKeyUint8,
      ephemeralKeyPair.secretKey
    );
    
    const fullMessage = new Uint8Array(
      ephemeralKeyPair.publicKey.length + 
      nonce.length + 
      encryptedMessage.length
    );
    
    fullMessage.set(ephemeralKeyPair.publicKey);
    fullMessage.set(nonce, ephemeralKeyPair.publicKey.length);
    fullMessage.set(
      encryptedMessage, 
      ephemeralKeyPair.publicKey.length + nonce.length
    );
    
    return encodeBase64(fullMessage);
  }

// Optional: Add a validation function
export function validatePublicKey(publicKeyBase64: string): boolean {
  try {
    const decoded = decodeBase64(publicKeyBase64);
    return decoded.length === box.publicKeyLength;
  } catch {
    return false;
  }
}