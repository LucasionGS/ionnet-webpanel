# Ionnet CMS

## Running

You need to have Deno v2.1.0 or later installed to run this repo.

You will need a `.env` file in the root with the following variables:

```env
MYSQL_DATABASE="database"
MYSQL_USERNAME="username"
MYSQL_PASSWORD="password"
```

After the database is created, run the migrations:
```bash
deno task server --migration-up
```

Start a dev server:
```bash
deno task server
```

## Deploy

Build for production:

deno task build
deno task compile
# If you need to run migrations:
./ionnetcms --migration-up
# Run the server
./ionnetcms
```
