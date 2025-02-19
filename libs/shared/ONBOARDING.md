# Onboarding a Legal Entity DID

More info can be found [here](https://hub.ebsi.eu/tools/cli/onboard).

## Using the CLI

### [Install Node.js](https://nodejs.org/en/learn/getting-started/how-to-install-nodejs).

### Start EBSI CLI

```bash
npx @cef-ebsi/cli
```

It will prompt you with `==>` indicating it's ready to start accepting commands.

### Create new DID with 2 key pairs

```bash
==> using user ES256
==> using user ES256K
```

The commands above output something like this:

```json
{
  "address":"0x8390f8b75Dfb727dD53C25a048DC4887CF482330",
  "did":"did:ebsi:zy8Psj9ez9wrsSZ7vrHE221",
  "didVersion":1,
  "keys":{
    "ES256":{
      "id":"eJYROV5PYyRZxjF7QABzsd7ooTw5bFNm2Ytt6bAxySQ",
      "kid":"did:ebsi:zzcJJuM4Z4AUKdL8kdMEKNw#eJYROV5PYyRZxjF7QABzsd7ooTw5bFNm2Ytt6bAxySQ",
      "privateKeyEncryptionJwk":{
        "crv":"P-256",
        "d":"p4B-UL0hzwNTJFA4taL3N0a1jCmIjUMPgKiwSjO1ZjM",
        "kty":"EC",
        "x":"ORK0V91Xg9IAFAMMcl73AxXv6n2ptYKEn5nBfiKCIm4",
        "y":"yRMSUPrqVtF2-Q_HkCDYjhNcrvkJeaf9PZdY1BLs8Jc"
      },
      "privateKeyJwk":{
        "crv":"P-256",
        "d":"O26b4UPVx_MMrzs8ibq0PCIHInEcHdouYy9mDcYcCk8",
        "kty":"EC",
        "x":"Vm7_Vhz07e9UoblDw1rmd29bV6ykcut4npLnqhhQlVk",
        "y":"uISs1AK-TVo0duSg3AvFuBNgBPp7ex4dWmYvkFN8uRk"
      },
      "publicKeyEncryptionJwk":{
        "crv":"P-256",
        "kty":"EC",
        "x":"ORK0V91Xg9IAFAMMcl73AxXv6n2ptYKEn5nBfiKCIm4",
        "y":"yRMSUPrqVtF2-Q_HkCDYjhNcrvkJeaf9PZdY1BLs8Jc"
      },
      "publicKeyJwk":{
        "crv":"P-256",
        "kty":"EC",
        "x":"Vm7_Vhz07e9UoblDw1rmd29bV6ykcut4npLnqhhQlVk",
        "y":"uISs1AK-TVo0duSg3AvFuBNgBPp7ex4dWmYvkFN8uRk"
      }
    },
    "ES256K":{
      "id":"k0G8kZ0UxsxGLYiiAhRUgtLtFzu-ZpbvzFtpJIH63ZI",
      "kid":"did:ebsi:zzcJJuM4Z4AUKdL8kdMEKNw#k0G8kZ0UxsxGLYiiAhRUgtLtFzu-ZpbvzFtpJIH63ZI",
      "privateKeyEncryptionJwk":{
        "crv":"secp256k1",
        "d":"O26b4UPVx_MMrzs8ibq0PCIHInEcHdouYy9mDcYcCk8",
        "kty":"EC",
        "x":"gmT8xLpAGaGX2JnfxTnlOs5JUy7SXSQbIErwPNBbu68",
        "y":"r9JVbckK24sbIw4Nyz16qoHaAZdhNmossxyO6a_Naxo"
      },
      "privateKeyJwk":{
        "crv":"secp256k1",
        "d":"O26b4UPVx_MMrzs8ibq0PCIHInEcHdouYy9mDcYcCk8",
        "kty":"EC",
        "x":"gmT8xLpAGaGX2JnfxTnlOs5JUy7SXSQbIErwPNBbu68",
        "y":"r9JVbckK24sbIw4Nyz16qoHaAZdhNmossxyO6a_Naxo"
      },
      "publicKeyEncryptionJwk":{
        "crv":"secp256k1",
        "kty":"EC",
        "x":"gmT8xLpAGaGX2JnfxTnlOs5JUy7SXSQbIErwPNBbu68",
        "y":"r9JVbckK24sbIw4Nyz16qoHaAZdhNmossxyO6a_Naxo"
      },
      "publicKeyJwk":{
        "crv":"secp256k1",
        "kty":"EC",
        "x":"gmT8xLpAGaGX2JnfxTnlOs5JUy7SXSQbIErwPNBbu68",
        "y":"r9JVbckK24sbIw4Nyz16qoHaAZdhNmossxyO6a_Naxo"
      }
    }
  },
  "privateKeyHex":"0x3b6e9be143d5c7f30caf3b3c89bab43c220722711c1dda2e632f660dc61c0a4f",
  "publicKeyHex":"0x048264fcc4ba4019a197d899dfc539e53ace49532ed25d241b204af03cd05bbbafafd2556dc90adb8b1b230e0dcb3d7aaa81da019761366a2cb31c8ee9afcd6b1a"
}
```

Make sure to store those keys someplace **SAFE**.

### Connect to the pilot environment

```bash
==> env pilot
```

### Get your generated DID

It looks something like `did:ebsi:zqXpq4nsfsyfcRdRrFyd52n` .

```bash
==> view user.did
```

> Request a credential to onboard. Contact the Trusted Issuer related to your use case and request a `VerifiableAuthorizationToOnboard` and provide them your DID you printed in the previous step.

### Use the script OR go step-by-step

#### Use the script

```bash
==> run registerDidDocument_ES256K_ES256 <VC_TO_ONBOARD>
```

#### Go step-by-step

1. Request an "invite" access token.

```bash
==> resAuthDIDRInvite: authorisation auth didr_invite_presentation ES256 <VC_TO_ONBOARD>
```

2. Load the access token:

```bash
==> using token resAuthDIDRInvite.access_token
```

3. Register first part of the DID Document:

```bash
==> did insertDidDocument
```

4. Request a "write" access token:

```bash
==> resAuthDIDRWrite: authorisation auth didr_write_presentation ES256K
```

5. Load the write access token:     

```bash
==> using token resAuthDIDRWrite.access_token
```

6. Complete DID Document registration:

```bash
==> did addVerificationMethod user.did ES256
==> did addVerificationRelationship user.did authentication ES256
==> did addVerificationRelationship user.did assertionMethod ES256
```

7. Verify final DID Document:

```bash
==> did get /identifiers/ user.did
```
