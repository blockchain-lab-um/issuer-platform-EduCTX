# Onboarding a Legal Entity DID

> More info can be found [here](https://hub.ebsi.eu/tools/cli/onboard).  

01. [Install Node.js](https://nodejs.org/en/learn/getting-started/how-to-install-nodejs). 

02. Install `pnpm`.  
```bash 
npm install -g pnpm@9.12.2 

```

03. Clone the repository.  
```bash 
git clone git@github.com:blockchain-lab-um/issuer-platform-EduCTX.git 
```  

04. Go into the cloned repo and run install dependencies.  
```bash 
cd issuer-platform-EduCTX 
pnpm install 
```  

05. Generate key by going into the scripts folder and running the command.  
```bash 
cd libs/shared/scripts 
pnpm keygen 
```  

06. Save those private keys somewhere safe. 

07. Start EBSI CLI.  
```bash 
pnpm dlx @cef-ebsi/cli 
```  

08. Connect to the pilot environment.
```bash
==> env pilot
```

09. Create new DID with 2 key pairs:

```bash
==> using user ES256K
==> using user ES256
```

10. View your generated DID:

```bash
==> view user.did
```

11. Request a credential to onboard by contacting the Trusted Issuer and providing your DID.

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
