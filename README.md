# EduCTX Issuer platform

## Environment

- Node.js v20.18.0
- pnpm 9.12.2

## Running services

### Local development environment

```bash
 pnpm --filter @blockchain-lab-um/eductx-platform-dashboard dev
 pnpm --filter @blockchain-lab-um/eductx-platform-issuer-service dev
 pnpm --filter @blockchain-lab-um/eductx-platform-authorization-service dev
```

### Development environment in Docker 🐳

We are using 3 images:

- Base image for building everything in the monorepo: `blockchain-lab-um/eductx-platform-base`
- Dashboard image: `blockchain-lab-um/eductx-platform-dashboard`
- Issuer service image: `blockchain-lab-um/eductx-platform-issuer-service`
- Authorization service image: `blockchain-lab-um/eductx-platform-verifier-service`

> To build all needed images run `./scripts/docker-build.sh`

> Example env files can be found in the respective apps folders (example files are `.env.example`).

Recommended way to run the platform is using docker compose. First create a `docker-compose.local.yml` file in the root of the project and copy the contents from `docker-compose.yml` and change the env variables to your needs. Then run `docker compose up -d --force-recreate` to start the services.

### Development notes

1. Issuer service and authorization service need to be accessible from the outside, so you can use something like [ngrok](https://ngrok.com/) or [zrok](https://zrok.io/) for local development.
2. For authentication on the Dashboard [Auth.js](https://authjs.dev/) is used. To change the authentication method, you need to just select the right [provider](https://authjs.dev/getting-started/providers/microsoft-entra-id) that fits your needs and setup the correct env variables.
3. For sending emails [Nodemailer](https://nodemailer.com/) is used. Nodemailer connects to the `smtp.office365.com` servers. Alternatively something like [Resend](https://resend.com/) can be used, with minor code changes.
4. Currently QR codes are generated on the Dashboard backend (Next.js API routes) and saved to [uploadthing](https://uploadthing.com/).

# License

This project is licensed under EUPL-1.2 terms:

- Apache License, Version 2.0, ([LICENSE](LICENSE) or https://interoperable-europe.ec.europa.eu/licence/european-union-public-licence-version-12-eupl)