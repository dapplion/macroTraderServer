var crypto = require("crypto")

function encrypt(key, data) {
        var cipher = crypto.createCipher('aes-256-cbc', key);
        var crypted = cipher.update(data, 'utf-8', 'hex');
        crypted += cipher.final('hex');

        return crypted;
}

function decrypt(key, data) {
        var decipher = crypto.createDecipher('aes-256-cbc', key);
        var decrypted = decipher.update(data, 'hex', 'utf-8');
        decrypted += decipher.final('utf-8');

        return decrypted;
}
const credentials = {
  Key: "4c294b8570334ff0802aa4b5ecf7de52",
  Secret: "19979712c8374a9f87587e78ede83635"
}
var key = "password";
var objectString = JSON.stringify(credentials);
console.log("Original Object: " + objectString);

var encryptedObject = encrypt(key, objectString);
console.log("Encrypted Object: " + encryptedObject);
var decryptedObject = decrypt(key, encryptedObject);
var cred = JSON.parse(decryptedObject)
console.log("Decrypted Object: Key " + cred.Key + ' Secret: '+cred.Secret);
