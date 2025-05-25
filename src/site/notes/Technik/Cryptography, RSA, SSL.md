---
{"dg-publish":true,"dg-path":"Tech/Cryptography, RSA, SSL.md","permalink":"/tech/cryptography-rsa-ssl/","tags":["knowledge-base","german"],"created":"2024-12-06T15:30:53.740+01:00","updated":"2025-05-24T12:53:57.515+02:00"}
---

## Allgemeines
- Ein Zertifikat enthält den Public Key (und weitere Textinformationen über die Webseite, Ablaufdatum, etc.) und wurde mithilfe des Private Keys erstellt
- Trapdoor-Funktion: Mathematisch sehr "einfach" in eine Richtung zu lösen, aber nahezu unmöglich umzukehren
- Encryption: Nutzt den public key des Empfängers um Nachricht zu verschlüsseln
- Decryption: Empfänger nutzt seinen Private Key, um Nachricht zu entschlüsseln. Nur Empfänger hat Private Key und Inhalt der Nachricht ist so sicher.
- Sign: Nutzt eigenen Private Key, um Nachricht (bzw. Hash der Nachricht wegen Längenbeschränkungen) zu verschlüsseln
- Verify: Nutzt Public Key des Senders, um Nachricht=Hash zu entschlüsseln und vergleicht mit Hash der Nachricht. Jeder hat Zugang zum Public Key und kann so die Echtheit der Nachricht verifizieren.
- RSA / DSA / EC (Elliptic Curve): unterschiedliche Methoden zur Generierung der Schlüssel
- PKCS#8: Aktuelles Format für Private-Keys (in PEM erkennbar am Header `BEGIN PRIVATE KEY`)
- PKCS#1: Veraltetes Format für Keys (in PEM erkennbar am Header `BEGIN RSA PRIVATE KEY`)
- Das Zertifikat einer RootCA reicht aus, um allen untergeordneten Zertifikaten von dieser RootCA zu vertrauen (so validiert der Browser bspw. auch LetsEncrypt Zertifikate - er kann nicht die Zertifikate aller Webseiten kennen)
Mehr Info zu PKCS: https://crypto.stackexchange.com/a/103585
## Dateitypen
- `.pem` - Format für Keys / Zertifikate / CSR, Base64-kodiert. Standardformat von OpenSSL.
- `.der` - binär-kodiertes Äquivalent zu .pem
- `.key` - Meistens der Private-Key, kann auch der Public-Key sein. Meist im PEM-Format.
- `.ppk` - Putty Private Key. Dateiformat, welches von Putty erzeugt wird.
- `.pub` - Nicht standardisiert, wird oft für Public Keys verwendet. Meist PEM-Format.
- `.csr` - Certificate Signing Request. Enthält Public Key und Name der Certificate Authority (CA). Wird mit Private Key erstellt und genutzt, um Zertifikat auszustellen.
- `.crt` - Zertifikat, meistens X509, kann PEM- oder DER-kodiert sein.
Mehr Infos: https://crypto.stackexchange.com/a/43700
Weitere Formate (wie PKCS#7): [A SSL Certificate File Extension Explanation: PEM, PKCS7, DER, and PKCS#12 - Comodo SSL Resources](https://comodosslstore.com/resources/a-ssl-certificate-file-extension-explanation-pem-pkcs7-der-and-pkcs12/)

PEM:
```
-----BEGIN ENCRYPTED PRIVATE KEY-----
...
-----END ENCRYPTED PRIVATE KEY-----
-----BEGIN PRIVATE KEY-----
...
-----END PRIVATE KEY-----
-----BEGIN CERTIFICATE-----
...
-----END CERTIFICATE-----
-----BEGIN CERTIFICATE REQUEST-----
...
-----END CERTIFICATE REQUEST-----
etc.
```

PPK:
```
TODO
```

DSR:
```
<just a bunch of binary data>
```
## One-way TLS auth
![I0612.jpg](/img/user/_attachments/I0612.jpg)
## Two-way TLS auth
![SGyYa.png](/img/user/_attachments/SGyYa.png)
## OpenSSL Befehle
OpenSSL kommt mit GitForWindows: `C:\Program Files\Git\usr\bin\openssl.exe`
Getestet mit Version: `OpenSSL 3.2.3 3 Sep 2024 (Library: OpenSSL 3.2.3 3 Sep 2024)`
### Key-Pair erzeugen (PEM)
```bash
# Will promt for password
# Can also supply pw: -pass pass:very4secure%pass
# -des3 instead of -aes-128-cbc is also okay
openssl genpkey -algorithm RSA -out private.key -outpubkey public.pub -aes-128-cbc
# Privte-Key ohne Verschlüsselung
openssl genpkey -algorithm RSA -out private.key
# Public-Key aus Private-Key erzeugen
openssl rsa -in private.key -pubout > public.pub
```
Unter Windows: private.key ist ggf. UTF-16 und muss noch zu UTF-8 konvertiert werden https://superuser.com/a/1778270 (PowerShell 5.1 utf-8 ist mit BOM, aber das funktioniert mit mbedtls trotzdem)
```bash
$PSDefaultParameterValues['Out-File:Encoding'] = 'utf8'
```
Alternativ zu `genpkey` kann auch `genrsa` genutzt werden:
[ssl - Difference between `openssl genrsa` and `openssl genpkey -algorithm rsa`? - Stack Overflow](https://stackoverflow.com/questions/65449771/difference-between-openssl-genrsa-and-openssl-genpkey-algorithm-rsa)
https://stackoverflow.com/questions/25459512/what-is-diffrent-between-rsa-and-rsa-des3
### Self-Signed RootCA-Zertifikat erzeugen
Voraussetzung: Private Key
```bash
# CSR erzeugen. Man wird nach Infos zur CA gefragt
# Challenge Passwort kann leer gelassen werden
openssl req -new -key private.key -out csr.pem
# X509v3 RootCA erzeugen
# Gültigkeitsdauer wie gewünscht anpassen
openssl req -x509 -days 365 -key private.key -in csr.pem -out root.crt
# Ohne CSR
openssl req -new -x509 -days 365 -key rootCA.key -out rootCA.crt
```
Man kann den Schritt mit dem CSR überspringen und den `-in` Parameter beim Erstellen des Zertifikats weglässt. Man muss dann in diesem Schritt die Infos eingeben. 
Der CSR ist nützlich, wenn man ein Zertifikat erneuern möchte, ohne nochmal die ganzen Infos (Land, E-Mail, etc.) einzugeben. Wenn man das RootCA-Zertifikat nie erneuern möchte (lange Gültigkeitsdauer), kann man sich den CSR sparen.

Infos zu "Challenge Password": [openssl - What's the use of challenge password in build-key-server and build-key from Easy-RSA? - Information Security Stack Exchange](https://security.stackexchange.com/questions/77028/whats-the-use-of-challenge-password-in-build-key-server-and-build-key-from-easy/77082#77082)
### Self-Signed (untergeordnetes) Zertifikat erzeugen
Voraussetzungen: Private Key (idealerweise 2: für RootCA und neues Zertifikat) und RootCA-Zertifikat

Konfigurationsdatei `subordinate.cnf` erstellen:
```ini
[ v3_ca ]
basicConstraints = CA:FALSE
authorityKeyIdentifier=keyid,issuer
keyUsage = nonRepudiation, digitalSignature, keyEncipherment, dataEncipherment
subjectAltName = @alt_names

[ alt_names ]
DNS.1 = yourdomain.com
DNS.2 = www.yourdomain.com
DNS.3 = 192.168.1.114
```
`subjectAltName`  und der `alt_names` Block sind optional.

```bash
# CSR
openssl req -new -key subordinate.key -out subordinate.csr
# Zertifikat mit Config
# Gültigkeitsdauer wie gewünscht anpassen
openssl x509 -req -days 3650 -in subordinate.csr -CA root.crt -CAkey root.key -CAcreateserial -out subordinate.crt -extfile subordinate.cnf -extensions v3_ca
```
Wenn man die Konfigurationsdatei nicht verwendet (und `-extensions` sowie `-extfile` weglässt), wird ein X509v1 Zertifikat erstellt. Dies ist ein veralteter Standard und kann Probleme mit neuen Rust-Libraries (siehe Links unten), sowie der Erkennung in Chrome machen.
Ggf. werden aber X509v3 Zertifikate aber von manchen MQTT-Brokern nicht erkannt (Aussage aus github Thread zu Rust-Thematik).

**Mehr Info:**
[openssl - Creating an x509 v3 user certificate by signing CSR - Stack Overflow](https://stackoverflow.com/questions/18233835/creating-an-x509-v3-user-certificate-by-signing-csr)
[x509v3_config - OpenSSL Documentation](https://docs.openssl.org/master/man5/x509v3_config/)
Rust unterstützt nur noch v3: https://github.com/rustls/rustls/issues/1298
Erklärung der `keyUsage` Parameter in der Config: https://superuser.com/a/1248085
### PKCS#1 in PKCS#8 umwandeln
````bash
openssl rsa -in ~/.ssh/id_rsa -outform pem > id_rsa.pem
````
Input: -----BEGIN RSA PRIVATE KEY----- (oder public)
Output: -----BEGIN PRIVATE KEY-----
## Links
Erklärung zu RSA
https://security.stackexchange.com/questions/68822/trying-to-understand-rsa-and-its-terminology/68836#answer-68836
https://security.stackexchange.com/questions/9260/sha-rsa-and-the-relation-between-them#answer-9265
OpenSSL Dokumentation
[openssl-genpkey - OpenSSL Documentation](https://docs.openssl.org/3.3/man1/openssl-genpkey/)
Noch mehr Befehle, Beispiele und Erklärungen
https://www.digitalocean.com/community/tutorials/openssl-essentials-working-with-ssl-certificates-private-keys-and-csrs