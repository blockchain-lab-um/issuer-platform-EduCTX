# Onboarding a Legal Entity DID

More info can be found [here](https://hub.ebsi.eu/tools/cli/onboard).

## Requirements

* [Node.js](https://nodejs.org/en/learn/getting-started/how-to-install-nodejs).
* [pnpm](https://pnpm.io/installation).

## Generate the keys, identifier and DID

```bash
cd libs/shared
pnpm keygen
```

This will output something like:

```
==================================== DID ===================================
  Subject Identifier: 27327406d87b07bbe6a0c3106a4d844c
  DID: did:ebsi:zdTEBXuQfgzD3SvYYacKapb

  ============================== ES256K Keypair ==============================
  Private key: a2377f15cc7999336e5059901495a6b24243b719ecdaa1d652ab2375b3d81854
  Public key: 03ae67c98d07adede939067b308e4994bb63f15e0b22a7d9e09632239e6244fedf

  ============================== ES256 Keypair ===============================
  Private key: 2f27de710b00df8088b64aa68bc8cf2650a67cf6a18ca851adb52b0bc569ecfd
  Public key: 02ed782a8e244d8f1d1a65c822569f111b84123ede025a35a02e74babd9c3e5cf8

```

⚠️ **Make sure to store PRIVATE KEYS, DID and SUBJECT IDENTIFIER someplace SAFE**.

## Start the onboarding process

### Start EBSI CLI

```bash
npx @cef-ebsi/cli
```

It will prompt you with `==>` indicating it's ready to start accepting commands.

### Add your private keys

```bash
==> using user ES256K did1 xxxprivate_key_ES256Kxxx did:ebsi:xxxxxx
==> using user ES256 did1 xxxprivate_key_jwk_ES256xxx did:ebsi:xxxxx
```

For our examples above, it would be:

```bash
==> using user ES256K did1 a2377f15cc7999336e5059901495a6b24243b719ecdaa1d652ab2375b3d81854 did:ebsi:zdTEBXuQfgzD3SvYYacKapb
==> using user ES256 did1 2f27de710b00df8088b64aa68bc8cf2650a67cf6a18ca851adb52b0bc569ecfd did:ebsi:zdTEBXuQfgzD3SvYYacKapb
```

This will print something like:

```
{
  "keys": {
    "ES256K": {
      "id": "ART45RrF68SaGO8ebOcPO87K71Of3Uj85xS1ZXSfAYY",
      "kid": "did:ebsi:zdTEBXuQfgzD3SvYYacKapb#ART45RrF68SaGO8ebOcPO87K71Of3Uj85xS1ZXSfAYY",
      "privateKeyJwk": {
        "kty": "EC",
        "crv": "secp256k1",
        "x": "rmfJjQet7ek5BnswjkmUu2PxXgsip9ngljIjnmJE_t8",
        "y": "ljYalVzFTyz2bwlLNLViu7hkZeKs4vZW-qTjzqyPAYc",
        "d": "ojd_Fcx5mTNuUFmQFJWmskJDtxns2qHWUqsjdbPYGFQ"
      },
      "publicKeyJwk": {
        "kty": "EC",
        "crv": "secp256k1",
        "x": "rmfJjQet7ek5BnswjkmUu2PxXgsip9ngljIjnmJE_t8",
        "y": "ljYalVzFTyz2bwlLNLViu7hkZeKs4vZW-qTjzqyPAYc"
      },
      "publicKeyPem": "-----BEGIN PUBLIC KEY-----\nMFYwEAYHKoZIzj0CAQYFK4EEAAoDQgAErmfJjQet7ek5BnswjkmUu2PxXgsip9ng\nljIjnmJE/t+WNhqVXMVPLPZvCUs0tWK7uGRl4qzi9lb6pOPOrI8Bhw==\n-----END PUBLIC KEY-----\n",
      "isHardwareWallet": false
    },
    "ES256": {
      "id": "r6YIRiLEkpasy6zo7PmUSYo1Hjz68yG-IwT0DvhvXUQ",
      "kid": "did:ebsi:zdTEBXuQfgzD3SvYYacKapb#r6YIRiLEkpasy6zo7PmUSYo1Hjz68yG-IwT0DvhvXUQ",
      "privateKeyJwk": {
        "kty": "EC",
        "crv": "P-256",
        "x": "7XgqjiRNjx0aZcgiVp8RG4QSPt4CWjWgLnS6vZw-XPg",
        "y": "GroAaxZ2Il0YRdvsOCR1BfaWf-vaslcZs-JDr1ZELiY",
        "d": "LyfecQsA34CItkqmi8jPJlCmfPahjKhRrbUrC8Vp7P0"
      },
      "publicKeyJwk": {
        "kty": "EC",
        "crv": "P-256",
        "x": "7XgqjiRNjx0aZcgiVp8RG4QSPt4CWjWgLnS6vZw-XPg",
        "y": "GroAaxZ2Il0YRdvsOCR1BfaWf-vaslcZs-JDr1ZELiY"
      },
      "publicKeyPem": "-----BEGIN PUBLIC KEY-----\nMFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAE7XgqjiRNjx0aZcgiVp8RG4QSPt4C\nWjWgLnS6vZw+XPgaugBrFnYiXRhF2+w4JHUF9pZ/69qyVxmz4kOvVkQuJg==\n-----END PUBLIC KEY-----\n",
      "isHardwareWallet": false
    }
  },
  "privateKeyHex": "0xa2377f15cc7999336e5059901495a6b24243b719ecdaa1d652ab2375b3d81854",
  "publicKeyHex": "0x04ae67c98d07adede939067b308e4994bb63f15e0b22a7d9e09632239e6244fedf96361a955cc54f2cf66f094b34b562bbb86465e2ace2f656faa4e3ceac8f0187",
  "address": "0x8DE11cA910a9d38a52dAD53EE01c4FeBF6377c6a",
  "did": "did:ebsi:zdTEBXuQfgzD3SvYYacKapb",
  "didVersion": 1
}
```

### Connect to the pilot environment

```bash
==> env pilot
==> set domain https://api-pilot.ebsi.eu
```

### Verify your generated DID

```bash
==> view user.did
```

In our case, this would print:

```
did:ebsi:zdTEBXuQfgzD3SvYYacKapb
```

> Request a credential to onboard. [Contact the Trusted Issuer](https://ec.europa.eu/digital-building-blocks/tracker/plugins/servlet/desk/portal/11/create/127) (we recommend selecting subject "Onboard to EBSI") related to your use case and request a `VerifiableAuthorizationToOnboard` and provide them your DID (in our example `did:ebsi:zdTEBXuQfgzD3SvYYacKapb` ).

### Use the script when you receive the `VerifiableAuthorizationToOnboard`

The customer support will guide you through the process from this point on, but once they send you a `VerifiableAuthorizationToOnboard` , you can use the following script to register your DID (using the same EBSI CLI as before). Since the process of receiving he `VerifiableAuthorizationToOnboard` can take a couple of hours to a couple of days, you'll probably have to exit the EBSI CLI and come back to it later and rerun the commands above (without generating the keys again — from [Start the onboarding process](#start-the-onboarding-process) chapter on) to get to this point where you can provide the `VC_TO_ONBOARD` ( `VerifiableAuthorizationToOnboard` ) to the script.

```bash
==> run registerDidDocument_ES256K_ES256 <VC_TO_ONBOARD>
```

Your DID is now onboarded. Congrats!

## Registering a DID to EBSI TIR (Trusted Issuer Registry)

> Using [the same form](https://ec.europa.eu/digital-building-blocks/tracker/plugins/servlet/desk/portal/11/create/127) (we recommend selecting subject "Register a DID") as mentioned before, you can request the registration to the EBSI TIR (Trusted Issuer Registry). The support team will guide you through this process as well. The fields <JWT> and <number> will be provided by them, probably along with exact commands to run for registering as a trusted issuer.

### Start the EBSI CLI

```bash
npx @cef-ebsi/cli
```

### Connect to the pilot environment

```bash
==> env pilot 
```

### Add your private keys

```bash
==> using user ES256K did1 xxxprivate_key_ES256Kxxx did:ebsi:xxxxxx

==> using user ES256 did1 xxxprivate_key_jwk_ES256xxx did:ebsi:xxxxxx
```

In our example above, it would be:

```bash
==> using user ES256K did1 a2377f15cc7999336e5059901495a6b24243b719ecdaa1d652ab2375b3d81854 did:ebsi:z25euAwW3mXPQAKUTqKqogsj

==> using user ES256 did1 2f27de710b00df8088b64aa68bc8cf2650a67cf6a18ca851adb52b0bc569ecfd did:ebsi:z25euAwW3mXPQAKUTqKqogsj
```

### Request an access token to register the VC

```bash
==> t: authorisation auth tir_invite_presentation ES256 <JWT>
==> using token t.access_token
```

### Register the credential (accept invitation)

```bash
==> tir setAttributeData did:ebsi:z25euAwW3mXPQAKUTqKqogsj <number> <JWT>
```

At this point, your DID is registered to the EBSI TIR (Trusted Issuer Registry) as a trusted issuer.

### Verify the registration

Visit the URL https://api-pilot.ebsi.eu/trusted-issuers-registry/v5/issuers/<your-did>

For example, visiting https://api-pilot.ebsi.eu/trusted-issuers-registry/v5/issuers/did:ebsi:z25euAwW3mXPQAKUTqKqogsj, we get:

```json
{
  "attributes":[
    {
      "body":"eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImRpZDplYnNpOnpaZUt5RUpmVVRHd2FqaE55Tlg5Mjh6I1NvMUhJUnQwS3FmMF9CU3dxdjRWTU5na2F4M21DRjlJamNRSndNbkIzYnMifQ.eyJpYXQiOjE3NDI5ODY4MzYsImp0aSI6InVybjp1dWlkOmFmODExN2NlLWJmYmEtNDBkYy04YzAwLWQ1YTViOTgwNDM0YSIsIm5iZiI6MTc0Mjk4NjgzNiwiZXhwIjoxOTAwNjY2ODM2LCJzdWIiOiJkaWQ6ZWJzaTp6MjVldUF3VzNtWFBRQUtVVHFLcW9nc2oiLCJpc3MiOiJkaWQ6ZWJzaTp6WmVLeUVKZlVUR3dhamhOeU5YOTI4eiIsInZjIjp7IkBjb250ZXh0IjpbImh0dHBzOi8vd3d3LnczLm9yZy8yMDE4L2NyZWRlbnRpYWxzL3YxIl0sImlkIjoidXJuOnV1aWQ6YWY4MTE3Y2UtYmZiYS00MGRjLThjMDAtZDVhNWI5ODA0MzRhIiwidHlwZSI6WyJWZXJpZmlhYmxlQ3JlZGVudGlhbCIsIlZlcmlmaWFibGVBdHRlc3RhdGlvbiIsIlZlcmlmaWFibGVBY2NyZWRpdGF0aW9uIiwiVmVyaWZpYWJsZUFjY3JlZGl0YXRpb25Ub0F0dGVzdCJdLCJpc3N1ZXIiOiJkaWQ6ZWJzaTp6WmVLeUVKZlVUR3dhamhOeU5YOTI4eiIsImlzc3VhbmNlRGF0ZSI6IjIwMjUtMDMtMjZUMTE6MDA6MzZaIiwiaXNzdWVkIjoiMjAyNS0wMy0yNlQxMTowMDozNloiLCJ2YWxpZEZyb20iOiIyMDI1LTAzLTI2VDExOjAwOjM2WiIsImV4cGlyYXRpb25EYXRlIjoiMjAzMC0wMy0yNVQxMTowMDozNloiLCJjcmVkZW50aWFsU3ViamVjdCI6eyJpZCI6ImRpZDplYnNpOnoyNWV1QXdXM21YUFFBS1VUcUtxb2dzaiIsInJlc2VydmVkQXR0cmlidXRlSWQiOiIyMjY3ZTg2ZWQxZmRmMGQxNzQ4YmNmNjBiYTZlMmI2YzdmMzA1MmRlYzUyZDJhZGQ1MGJmN2MyNWU0OTEyZjA3IiwiYWNjcmVkaXRlZEZvciI6W3sic2NoZW1hSWQiOiJodHRwczovL2FwaS1waWxvdC5lYnNpLmV1L3RydXN0ZWQtc2NoZW1hcy1yZWdpc3RyeS92My9zY2hlbWFzL3o1S0JRVnhRSEtlYXFuZ1lqOWFFV0diZ0twUFQ0Z1RTem5Vd0NSeW0xR0c5bSIsInR5cGVzIjpbIlZlcmlmaWFibGVDcmVkZW50aWFsIiwiVmVyaWZpYWJsZUF0dGVzdGF0aW9uIiwiQ1RSZXZvY2FibGUiXSwibGltaXRKdXJpc2RpY3Rpb24iOiJodHRwczovL3B1YmxpY2F0aW9ucy5ldXJvcGEuZXUvcmVzb3VyY2UvYXV0aG9yaXR5L2F0dS9GSU4ifV19LCJ0ZXJtc09mVXNlIjpbeyJpZCI6Imh0dHBzOi8vYXBpLXBpbG90LmVic2kuZXUvdHJ1c3RlZC1pc3N1ZXJzLXJlZ2lzdHJ5L3Y1L2lzc3VlcnMvZGlkOmVic2k6elplS3lFSmZVVEd3YWpoTnlOWDkyOHovYXR0cmlidXRlcy9jOWMyMzIxMTQ0NDA1NWRjNmU5NTBmY2I2YTA5YjBiZGI2NDdlNDY0MmY4OTgwYTM3ODBkNWNkMDIxMTE3OTZhIiwidHlwZSI6Iklzc3VhbmNlQ2VydGlmaWNhdGUifV0sImNyZWRlbnRpYWxTY2hlbWEiOnsiaWQiOiJodHRwczovL2FwaS1waWxvdC5lYnNpLmV1L3RydXN0ZWQtc2NoZW1hcy1yZWdpc3RyeS92My9zY2hlbWFzL3pqVkZOdmJFQlBBcjNhNzI0RHR0aW9acGdabU5yNzVCQnRSelpxazdwa0RlIiwidHlwZSI6IkZ1bGxKc29uU2NoZW1hVmFsaWRhdG9yMjAyMSJ9fX0.LU2DalNBg9b27XImeGKQLdnlhgskwrTB2L46SlzLX8dRh_w5u72cGPfNCkOBeZhOucOzpxAGF9_RbniLWnmdNA",
      "hash":"9a1926c7d342cbbe5c16fe2bb944767b90a76b97a6065d86642362ad0926d8da",
      "issuerType":"TI",
      "rootTao":"did:ebsi:zZeKyEJfUTGwajhNyNX928z",
      "tao":"did:ebsi:zZeKyEJfUTGwajhNyNX928z"
    }
  ],
  "did":"did:ebsi:z25euAwW3mXPQAKUTqKqogsj"
}
```

If you are curious, you can copy the body attribute and paste it in [JWT decoder](https://jwt.io/) to see the decoded content.

Congratulations! You are now a trusted issuer.
