# Localstack sample

## Run first time

```bash
docker-compose -f docker-compose.localstack.yml up
pnpm setupall
pnpm run app
```

## Run next time

```bash
docker-compose -f docker-compose.localstack.yml up
pnpm run app
```
