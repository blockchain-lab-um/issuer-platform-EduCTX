# EduCTX Issuer platform

### Environment

- Node.js v18.17.1
- pnpm 8.7.6

### Docker

We are using 3 images:

- Base image for building everything in the monorepo: `blockchain-lab-um/eductx-platform-base`
- Dashboard image: `blockchain-lab-um/eductx-platform-dashboard`
- Issuer image: `blockchain-lab-um/eductx-platform-issuer`

We also have `docker-compose.yml` file prepared, but you need to build the base image first.

This can be done with the following command: `pnpm docker:build`

If you already have `.env` files for the issuer and dashboard you can run them using docker compose with the following command:

- `docker compose --env-file apps/dashboard/.env --env-file apps/issuer/.env up --build`
