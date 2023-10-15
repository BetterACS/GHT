CREATE DATABASE gamify_habit_tracker;
USE gamify_habit_tracker;

CREATE TABLE Users (
    user_id INT NOT NULL AUTO_INCREMENT,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    PRIMARY KEY (user_id)
);

CREATE TABLE Quests (
    quest_id INT NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,
    quest_name VARCHAR(255) NOT NULL,
    quest_description VARCHAR(255) NOT NULL,
    start_date DATE NOT NULL,
    due_date DATE NOT NULL,
    PRIMARY KEY (quest_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE Habits (
    habit_id INT NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,
    habit_name VARCHAR(255) NOT NULL,
    habit_description VARCHAR(255) NOT NULL,
    value INT NOT NULL,
    maximum_value INT,
    PRIMARY KEY (habit_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

INSERT INTO users (username, password) VALUES ('monchinawat', '12345678');
INSERT INTO users (username, password) VALUES ('jackjessada', '23456789');
INSERT INTO users (username, password) VALUES ('james', '34567890');
INSERT INTO users (username, password) VALUES ('kimmycreative', 'microscg');

INSERT INTO quests 
    (user_id, quest_name, quest_description, start_date, due_date) 
    VALUES (1, 'Learn React', 'Learn React', '2020-01-01', '2020-01-31'),
		(1, 'Learn Node.js', 'Learn Node.js', '2020-02-01', '2020-02-28'),
		(1, 'Learn Express.js', 'Learn Express.js', '2020-03-01', '2020-03-16'),
		(4, 'Learn React', 'Learn React', '2020-01-01', '2020-01-31');


INSERT INTO habits
    (user_id, habit_name, habit_description, value)
    VALUES (2, 'Learning', 'Learning', 0),
		(2, 'Reading', 'Reading', 0),
		(3, 'Exercising', 'Exercising', 0);

INSERT INTO habits
    (user_id, habit_name, habit_description, value, maximum_value)
    VALUES (3, 'Eating', 'Eating', 0, 100);
