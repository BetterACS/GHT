# Gamified Habit Tracker

Are you tired of the same old to-do lists? Do you want to gamify your life? Then this is the app for you!

![preview](assets/preview.png)

## Installation

Note: This project requires both MongoDB and MySQL to be installed on your machine or you can use a cloud database service.

1. Clone the repository and install the dependencies.

```bash
git clone https://github.com/BetterACS/GHT.git
```

2. Setup your mysql database. using files in `backend/database` folder. and setup your mongodb database. using files in `backend/src/database/models.ts` folder.

3. You need to create file called `.env` inside the `backend` folder. This file should contain the following:

-   `MONGODB_URI`: The URI of the MongoDB database.
-   `MYSQL_HOST`: The host of the MySQL database.
-   `MYSQL_USER`: The username of the MySQL database.
-   `MYSQL_PASSWORD`: The password of the MySQL database.
-   `MYSQL_PORT`: The port of the MySQL database.
-   `MYSQL_DATABASE`: The name of the MySQL database.
-   `ACCESS_TOKEN`: The access token for the JWT.
-   `REFRESH_TOKEN`: The refresh token for the JWT.

Example:

```
MONGODB_URI = "mongodb://localhost:27017/ght"
MYSQL_HOST = "localhost"
MYSQL_USER = "root"
MYSQL_PASSWORD = "password"
MYSQL_PORT = "3300"
MYSQL_DATABASE = "ght"
ACCESS_TOKEN = "aCcE$s#S"
REFRESH_TOKEN = "r#E$fReSh"
```

4. Install dependencies, run the following commands:

```node
cd GHT/backend
npm run install
cd ../frontend
npm run install
```

or you can install all dependencies separately.

## Usage

To start the web application, you need to run these commands:

Start all the servers at once

```node
cd GHT
npm run all-dev
```

or you can start each server separately.

-   Start the backend | frontend | validate server

```node
npm run <server>
```

## Gameplay

You role-played as a young tamer who wants to become the best tamer in the world. You will be given a monster to tame. You can tame your monster by give it item (food).

Each time you complete a task, you will get a random item. You can view your items in the inventory.

### Default Items

Note: These are the default items. Made by Stable diffusion model.

![item](assets/items/image_0.png)
![item](assets/items/image_1.png)
![item](assets/items/image_2.png)
![item](assets/items/image_3.png)
![item](assets/items/image_4.png)
![item](assets/items/image_5.png)
![item](assets/items/image_6.png)
![item](assets/items/image_7.png)
![item](assets/items/image_8.png)
![item](assets/items/image_9.png)
![item](assets/items/image_10.png)
![item](assets/items/image_11.png)
![item](assets/items/image_12.png)
![item](assets/items/image_13.png)
![item](assets/items/image_14.png)
![item](assets/items/image_15.png)
![item](assets/items/image_16.png)
![item](assets/items/image_17.png)
![item](assets/items/image_18.png)
![item](assets/items/image_19.png)
![item](assets/items/image_20.png)
![item](assets/items/image_21.png)
![item](assets/items/image_22.png)
![item](assets/items/image_23.png)
![item](assets/items/image_24.png)
![item](assets/items/image_25.png)

Each monster has a different food preference. You need to give the monster the right food to tame it (Better chance).

### Default Monsters

Note: These are the default monsters. Made by Stable diffusion model.

![monster](assets/monsters/monster__1.png)
![monster](assets/monsters/monster__2.png)
![monster](assets/monsters/monster__3.png)
![monster](assets/monsters/monster__4.png)
![monster](assets/monsters/monster__5.png)
![monster](assets/monsters/monster__6.png)
![monster](assets/monsters/monster__7.png)
![monster](assets/monsters/monster__8.png)
![monster](assets/monsters/monster__9.png)
![monster](assets/monsters/monster__10.png)
![monster](assets/monsters/monster__11.png)
![monster](assets/monsters/monster__12.png)
![monster](assets/monsters/monster__13.png)
![monster](assets/monsters/monster__14.png)
![monster](assets/monsters/monster__15.png)
![monster](assets/monsters/monster__16.png)
![monster](assets/monsters/monster__17.png)
![monster](assets/monsters/monster__18.png)
![monster](assets/monsters/monster__19.png)
![monster](assets/monsters/monster__20.png)
![monster](assets/monsters/monster__21.png)
![monster](assets/monsters/monster__22.png)
![monster](assets/monsters/monster__23.png)
![monster](assets/monsters/monster__24.png)
![monster](assets/monsters/monster__25.png)
![monster](assets/monsters/monster__26.png)
![monster](assets/monsters/monster__27.png)
![monster](assets/monsters/monster__28.png)
![monster](assets/monsters/monster__29.png)
![monster](assets/monsters/monster__30.png)
![monster](assets/monsters/monster__31.png)
![monster](assets/monsters/monster__32.png)
![monster](assets/monsters/monster__33.png)
![monster](assets/monsters/monster__34.png)
![monster](assets/monsters/monster__35.png)
![monster](assets/monsters/monster__36.png)
![monster](assets/monsters/monster__37.png)
![monster](assets/monsters/monster__38.png)

Additional monster sprite:

![monster](assets/monsters/monster__39.png)

### Default Backgrounds

Note: These are the default backgrounds. Made by Stable diffusion model.

![monster](frontend/public/scene_1.png)
![monster](frontend/public/scene_2.png)
![monster](frontend/public/scene_3.png)
![monster](frontend/public/scene_4.png)
![monster](frontend/public/scene_5.png)
![monster](frontend/public/scene_6.png)
![monster](frontend/public/scene_7.png)
![monster](frontend/public/scene_8.png)
![monster](frontend/public/scene_9.png)
