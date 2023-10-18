# Gamified Habit Tracker

Are you tired of the same old to-do lists? Do you want to gamify your life? Then this is the app for you!

## Installation
1. Clone the repository and install the dependencies.

```bash
git clone https://github.com/BetterACS/GHT.git
```
2. You need to create file called `.env` inside the `backend` folder. This file should contain the following:
- `PORT`: The port of the backend server.
- `MYSQL_HOST`: The host of the MySQL database.
- `MYSQL_USER`: The username of the MySQL database.
- `MYSQL_PASSWORD`: The password of the MySQL database.
- `MYSQL_PORT`: The port of the MySQL database.

Example:
```
MYSQL_HOST = "localhost"
MYSQL_USER = "root"
MYSQL_PASSWORD = "password"
MYSQL_PORT = "3300"
```

3. Install dependencies, run the following commands:

```node
cd frontend
npm install
cd ../backend
npm install
cd ..
```
or you can install all dependencies separately.

## Usage

To start the client, run the following commands:

```node
cd frontend
npm run dev
```

To start the server, run the following commands:

```node
cd backend
npm run start
```
