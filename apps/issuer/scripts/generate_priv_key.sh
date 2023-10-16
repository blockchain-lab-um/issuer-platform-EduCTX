#!/usr/bin/env bash

# Generate the Secp256k1 private key
priv_key=$(
  openssl ecparam -name secp256k1 -genkey -noout |
  openssl ec -text -noout |
  grep priv -A 3 |
  tail -n +2 |
  tr -d '\n[:space:]:' |
  sed 's/^00//'
)

echo "Private Key: $priv_key"
