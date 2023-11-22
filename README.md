# EduCTX Issuer platform

## Environment

* Node.js v18.17.1
* pnpm 8.7.6

## Running services

### Local development environment

```bash
 pnpm --filter issuer dev
 pnpm --filter dashboard dev
```

See [below](#database) for database setup.

### Development environment in Docker 🐳

We are using 3 images:

* Base image for building everything in the monorepo: `blockchain-lab-um/eductx-platform-base`
* Dashboard image: `blockchain-lab-um/eductx-platform-dashboard`
* Issuer image: `blockchain-lab-um/eductx-platform-issuer`

> ❗️ Env files need to be set. See [dashboard env file](apps/dashboard/.env.example) and [issuer env file](apps/issuer/.env.example).

Running dashboard and issuer (with DB):

```bash
pnpm docker:run
```

or

```bash
docker compose --env-file apps/dashboard/.env --env-file apps/issuer/.env up --build
```

Running only issuer service (with db):

```bash
pnpm docker:run:issuer
```

or

```bash
docker compose --env-file apps/issuer/.env up issuer db --build
```

In both cases, database migrations need to be executed when running for the first time. See [below](#database) for more info.

## Database

Running database and migrations can be achieved by running the command below. Script will determine whether it needs to start docker container or not and execute migrations.

```bash
cd apps/issuer/scripts
sh run_db.sh
```

If migrations fail to execute and throw db does not exist error, make sure to wipe all volumes attached to containers and recreate containers.

Custom database info can be specific with env variables. See [example file](apps/issuer/.env.example).

 > ⚠️ If not executing `run_db.sh` , you'll need to take care of the database yourself. Be sure to also set `DATABASE_URL` env variable.
