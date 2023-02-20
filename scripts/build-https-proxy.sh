#!/bin/bash

# Generate a passphrase
echo "Generating a passphrase..."
openssl rand -base64 48 > ./https-proxy/passphrase.txt

# Generate a Private Key
echo "Generating a private key..."
openssl genrsa -aes128 -passout file:./https-proxy/passphrase.txt -out ./https-proxy/trellzo.key 2048

# Generate a CSR
echo "Generating a CSR..."
openssl req -new -config ./https-proxy/trellzo.conf -passin file:./https-proxy/passphrase.txt \
    -key ./https-proxy/trellzo.key -out ./https-proxy/trellzo.csr \
    -subj "/C=CA/ST=Ontario/L=Toronto/O=Trellzo/OU=trellzo/CN=localhost"

# Remove passphrase from key
echo "Removing passphrase from key..."
cp ./https-proxy/trellzo.key ./https-proxy/trellzo.key.org
openssl rsa -in ./https-proxy/trellzo.key.org -passin file:./https-proxy/passphrase.txt -out ./https-proxy/trellzo.key

# Create a self-signed certificate
echo "Creating a self-signed certificate..."
openssl x509 -req -days 36500 -in ./https-proxy/trellzo.csr -signkey ./https-proxy/trellzo.key -out ./https-proxy/trellzo.crt

# Create a pfx file
echo "Creating a pfx file..."
openssl pkcs12 -export -out ./https-proxy/trellzo.pfx -inkey ./https-proxy/trellzo.key -in ./https-proxy/trellzo.crt -password file:./https-proxy/passphrase.txt

# Import (trust) the certificate into macOS keychain
echo "Importing the certificate into macOS keychain..."
security import ./https-proxy/trellzo.pfx -k ~/Library/Keychains/login.keychain -P $(cat ./https-proxy/passphrase.txt)

# Build the docker image
echo "Building the docker image..."
docker-compose build --no-cache https-proxy

echo 'Make sure to add the certificate to your browser.'
echo '    Firefox: Settings -> Privacy & Security -> View Certificates -> Server -> Add Exception...'
echo '    Chrome: Paste "chrome://flags/#allow-insecure-localhost" into the address bar -> Enable -> Relaunch'
echo '    Safari: In Keychain Access, double-click the certificate -> Trust -> When using this certificate: Always Trust'
