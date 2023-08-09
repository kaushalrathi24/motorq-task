## Running the app

```bash
# setup env at backend/.env
# set backend url at frontend/src/routes.ts

#Run the backend
$ cd backend
$ docker compose up --build -d

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```