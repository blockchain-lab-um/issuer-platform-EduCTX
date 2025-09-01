# Instructions for self-hosting

## Requirements

- Docker
- Docker Compose
- Microsoft Entra ID (Azure AD) -> Can be replaced with different identity provider, but requires code changes.
- [Uploadthing](https://uploadthing.com/) account
- Outlook account (for sending emails)
- Node v20.18.0
- pnpm v9.12.2

## Ports used by services

| Service | Port |
|---------|------|
| dashboard | 3000 |
| testing-frontend | 3004 |
| issuer-service | 3001 |
| authorization-service | 3002 |
| backend | 3003 | 

## Generate the keys, identifier and DID

```bash
cd libs/shared
pnpm keygen
```

This will output something like:

```
==================================== ISSUER DID ===================================
  Subject Identifier: 27327406d87b07bbe6a0c3106a4d844c
  DID: did:ebsi:zdTEBXuQfgzD3SvYYacKapb

  ============================== ISSUER ES256K Keypair ==============================
  Private key: a2377f15cc7999336e5059901495a6b24243b719ecdaa1d652ab2375b3d81854
  Public key: 03ae67c98d07adede939067b308e4994bb63f15e0b22a7d9e09632239e6244fedf

  ============================== ISSUER ES256 Keypair ===============================
  Private key: 2f27de710b00df8088b64aa68bc8cf2650a67cf6a18ca851adb52b0bc569ecfd
  Public key: 02ed782a8e244d8f1d1a65c822569f111b84123ede025a35a02e74babd9c3e5cf8

  ============================== VERIFIER ES256 Keypair ===============================
  Private key: e4eab3964f8c4b6a590f3269c80372c852c265473f9b48602afa6dae51f91985
  Public key: 0300bc63299fd39b86382d5af82a8c6514dd2c17ed2c714e4dc32e6c11435e31c6

```

⚠️ **Make sure to store PRIVATE KEYS, DID and SUBJECT IDENTIFIER someplace SAFE**.

## EBSI DID Onboarding (pilot environment)

Follow the instructions in [ONBOARDING.md](../libs/shared/ONBOARDING.md).

## Updating env variables

The following variables are required to be set in the `docker-compose.yml` file.

```sh
# Entra ID (Azure AD) variables
AZURE_AD_CLIENT_ID=
AZURE_AD_CLIENT_SECRET=
AZURE_AD_TENANT_ID=

# Email sending (outlook/office365) account variables
EMAIL_USERNAME=
EMAIL_PASSWORD=

# Next Auth
NEXTAUTH_SECRET= # Generate a secret using `openssl rand -base64 32`

# API keys
# Generate them using `openssl rand -base64 32`
# Replace the following occurences with the generated secret
- <issuer_api_key>
- <authorization_service_api_key>
- <dashboard_server_api_key>
- <backend_api_key>

# Uploadthing
# Create account and project on https://uploadthing.com
UPLOADTHING_TOKEN=

# Url endpoints
# Replace the following occurences with the correct url (subdomain) pointing to the services
- <eductx_platform_dashboard_url>
- <eductx_platform_issuer_service_url>
- <eductx_platform_authorization_service_url>
- <eductx_platform_backend_url>

# Keys (use the ES256 Keypair information from the key generation step)
- <issuer_service_private_key>
- <authorization_service_private_key>
- <issuer_service_public_key>
- <authorization_service_public_key>

# EBSI DID
- <ebsi_subject_id>
``` 


## Build the images and start the services

### Build the images
```bash
# Run the following command in the root directory to build the images
./scripts/docker-build.sh
```

### Start the services

```bash
# Start the services using your `docker-compose.yml` file which contains the correct env variables
docker compose up -d
```

