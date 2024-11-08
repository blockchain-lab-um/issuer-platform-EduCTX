# Issuer

## Requirements

### Bytebase

**Install:**

`/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/bytebase/install/HEAD/install.sh)"`

## DB

Runing DB in development can be done with the `scripts/run_db.sh` script.

## Generating a new API Key

The API Key is used to protect the `/issue` and `/issue-deferred` endpoints.

The script for generating a new API key is `scripts/generate_api_key.js`. It will generate a new API key and print it to stdout.

```sh
$ node scripts/generate_api_key.js
```
