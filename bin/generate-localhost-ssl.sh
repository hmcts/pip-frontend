#!/bin/bash
# This script generates a self-signed SSL certificate and private key only for localhost environment.
# The generated files are stored in src/main/resources/localhost-ssl.

SSL_DIR="src/main/resources/localhost-ssl"

if [ -d "$SSL_DIR" ]; then
  exit 0
fi

mkdir -p "$SSL_DIR"

openssl genrsa -out "$SSL_DIR/localhost.key" 2048

openssl req -new -x509 -key "$SSL_DIR/localhost.key" \
  -out "$SSL_DIR/localhost.crt" \
  -days 3650 -subj "/C=UK/ST=London/L=London/O=MOJ/OU=CC/CN=localhost"

cat > "$SSL_DIR/README.md" <<EOF
# **SSL key and certificate (development only)**
This folder contains a private RSA key and a self-signed certificate. These resources are used for exposing the application via HTTPS in development environment. They must not be used in other environments, as their purpose is to provide consistency, not security.
EOF
