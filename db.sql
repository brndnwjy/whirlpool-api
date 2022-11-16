CREATE DATABASE whirlpool;

CREATE TABLE users (
    user_id UUID PRIMARY KEY, 
    fullname VARCHAR(32) NOT NULL,
    username VARCHAR(32),
    email VARCHAR(128) NOT NULL UNIQUE,
    phone VARCHAR(16) NOT NULL,
    password VARCHAR(64) NOT NULL,
    bio VARCHAR(64),
    avatar VARCHAR(256),
    status INTEGER DEFAULT 0,
    created_at TIMESTAMP,
    updated_at TIMESTAMP   
);

CREATE TABLE messages (
    message_id INTEGER PRIMARY KEY NOT NULL GENERATED ALWAYS AS IDENTITY,
    sender VARCHAR NOT NULL,
    receiver VARCHAR NOT NULL,
    message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);