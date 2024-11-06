# Onboarding a Legal Entity DID

More info can be found [here](https://hub.ebsi.eu/tools/cli/onboard).

01.  [Install Node.js](https://nodejs.org/en/learn/getting-started/how-to-install-nodejs).
02.  Install `pnpm`.

```bash
pnpm install -g pnpm@9.12.2
```

03.  Clone the repository.

```bash
git clone git@github.com:blockchain-lab-um/issuer-platform-EduCTX.git
```

04.  Go into the cloned repo and run install dependencies.

```bash
cd issuer-platform-EduCTX
pnpm install
```

05.  Generate key by going into the scripts folder and running the command.

```bash
cd libs/shared/scripts
pnpm keygen
```

06.  Save those private keys somewhere safe.
07.  Start EBSI CLI.

```bash
pnpm dlx @cef-ebsi/cli
```

It will prompt you with `==>` indicating it's ready to start accepting commands.

08.  Create new DID with 2 key pairs. Run:

```
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

09.  Connect to the pilot environment

```
==> env pilot
```

10. Get your generated DID. It looks something like `did:ebsi:zqXpq4nsfsyfcRdRrFyd52n`.

```
==> view user.did
```

11. Request a credential to onboard. Contact the Trusted Issuer related to your use case and request a `VerifiableAuthorizationToOnboard` and provide them your DID you printed in the previous step.

12. Request an "invite" access token:

```bash
==> resAuthDIDRInvite: authorisation auth didr_invite_presentation ES256 <VC_TO_ONBOARD>
```

13. Load the access token:

```bash
==> using token resAuthDIDRInvite.access_token
```

14. Register first part of the DID Document:

```bash
==> did insertDidDocument
```

15. Request a "write" access token:

```bash
==> resAuthDIDRWrite: authorisation auth didr_write_presentation ES256K
```

16. Load the write access token:

```bash
==> using token resAuthDIDRWrite.access_token
```

17. Complete DID Document registration:

```bash
==> did addVerificationMethod user.did ES256
==> did addVerificationRelationship user.did authentication ES256
==> did addVerificationRelationship user.did assertionMethod ES256
```

18. Verify final DID Document:

```bash
==> did get /identifiers/ user.did
```

    Alternatively, use the simplified script:

```bash
==> run registerDidDocument_ES256K_ES256 <VC_TO_ONBOARD>
```
