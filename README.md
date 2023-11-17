# EduCTX Issuer platform

### Environment

- Node.js v18.17.1
- pnpm 8.7.6

### Docker

We are using 3 images:

- Base image for building everything in the monorepo: `blockchain-lab-um/eductx-platform-base`
- Dashboard image: `blockchain-lab-um/eductx-platform-dashboard`
- Issuer image: `blockchain-lab-um/eductx-platform-issuer`

> ⚠️ We urge you to set `POSTGRES_USER` and `POSTGRES_PASSWORD` .

If you already have `.env` files for the issuer and dashboard you can run them using docker compose with the following command:

```bash
docker compose --env-file apps/dashboard/.env --env-file apps/issuer/.env up --build
```

You can also use the command:

```bash
pnpm docker:run
```

In this process, postgresql container also starts. If running for the first time, you need to run migrations. This can be achieved by running:

```bash
sh apps/issuer/scripts/run_db.sh
```
