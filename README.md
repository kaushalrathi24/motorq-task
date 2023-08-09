## Running the app

Need to create users in the DB since there is no register route <br>
Set env at backend/.env <br>
Set backend url at frontend/src/routes.ts

```bash
# Run the backend
$ cd backend
$ docker compose up --build -d

# Run the frontend
$ cd frontend
$ docker build -t motorq_frontend .
$ docker run --name motorq_frontend -p 3000:3000 -d motorq_frontend
```

## URLS
demo link: https://drive.google.com/file/d/1LHNAGRFlNPSrOrdYPfEhSikRDTCnEbi1/view?usp=sharing

Postman Collection links:

- https://universal-firefly-673545-1.postman.co/workspace/motorq~5a41a67f-ea14-46b3-8c81-56921a96abed/collection/19723541-8a8442e1-9d6d-4feb-a455-3803bf121305?action=share&creator=19723541

- https://universal-firefly-673545-1.postman.co/workspace/motorq~5a41a67f-ea14-46b3-8c81-56921a96abed/collection/-19723541-62e409e3-6fcb-4b30-b775-6774e1fd4172?action=share&creator=19723541

- https://universal-firefly-673545-1.postman.co/workspace/motorq~5a41a67f-ea14-46b3-8c81-56921a96abed/collection/19723541-6a8f58d2-6df9-4866-9627-acd57277f97e?action=share&creator=19723541

- https://universal-firefly-673545-1.postman.co/workspace/motorq~5a41a67f-ea14-46b3-8c81-56921a96abed/collection/19723541-3e78af33-2595-4345-a89c-0c203541835b?action=share&creator=19723541

hosted link: http://165.22.212.245:3000/login

## Existing users in hosted DB:

<b>ADMINISTRATOR</b>
- email: admin@task.com, password: admin

<b>APPROVERS</b>
- email: approver1@task.com, password: approver
- email: approver2@task.com, password: approver
- email: approver3@task.com, password: approver
- email: approver4@task.com, password: approver

<b>REQUESTERS</b>
- email: requester1@task.com, password: requester
- email: requester1@task.com, password: requester
- email: kaushalrathi24@gmail.com, password: requester