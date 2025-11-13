CREATE DATABASE magic_school

USE magic_school

CREATE TABLE spells (
    id INT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL,
    mana INT NOT NULL,
    description TEXT NOT NULL,
    difficulty VARCHAR(50) NOT NULL,
    effectDuration VARCHAR(50),
    isUnforgivable BOOLEAN NOT NULL,
    spellRange VARCHAR(50),
    counterSpell VARCHAR(100),
    alignment VARCHAR(50)
);