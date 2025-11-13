import harryPotterSpells from "./spells.json";
import { Spell } from "./types";
import mysql, {ConnectionOptions, Connection, QueryResult, FieldPacket, RowDataPacket, ResultSetHeader} from "mysql2/promise";

const access: ConnectionOptions = {
    connectionLimit	: 10,
    host		: "localhost",
    user		: "root",
    password		: "root",
    database		: "magic_school"
};

let databaseConnection: Connection;

let spells: Spell[] = harryPotterSpells;

export async function getSpells(q: string = "") {
    if (!q) {
        const [rows, fields] : [RowDataPacket[], FieldPacket[]] = await databaseConnection.execute("SELECT * FROM spells;");
        return rows as Spell[];
    } else {
        const searchQuery = `%${q}%`;
        const [rows, fields] : [RowDataPacket[], FieldPacket[]] = await databaseConnection.execute(
            "SELECT * FROM spells WHERE LOWER(name) LIKE ? OR LOWER(description) LIKE ? OR LOWER(type) LIKE ?;",
            [searchQuery, searchQuery, searchQuery]
        );
        return rows as Spell[];
    }    
}

export async function getSpellById(id: number) {
    const [rows, fields] : [RowDataPacket[], FieldPacket[]] = await databaseConnection.execute(
        "SELECT * FROM spells WHERE id = ?;",
        [id]
    );
    return rows[0] as Spell | undefined;
}

export async function createSpell(spell: Spell) {
    const insertQuery = `INSERT INTO spells (name, type, mana, description, difficulty, effectDuration, isUnforgivable, spellRange, counterSpell, alignment)
                         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`;
    const values = [spell.name, spell.type, spell.mana, spell.description, spell.difficulty, spell.effectDuration, spell.isUnforgivable, spell.spellRange, spell.counterSpell, spell.alignment];
    const [result] : [ResultSetHeader, FieldPacket[]] = await databaseConnection.execute(insertQuery, values);
    
    return await getSpellById(result.insertId);
}

export async function deleteSpell(id: number) {
    await databaseConnection.execute(
        "DELETE FROM spells WHERE id = ?;",
        [id]
    );
}

export async function updateSpell(id: number, spellPatch: Spell) {
    const oldSpell = await getSpellById(id);
    if (!oldSpell) {
        throw new Error("Spell not found");
    }

    const updatedSpell = {...oldSpell, ...spellPatch};

    const updateQuery = `UPDATE spells SET name = ?, type = ?, mana = ?, description = ?, difficulty = ?, effectDuration = ?, isUnforgivable = ?, spellRange = ?, counterSpell = ?, alignment = ? WHERE id = ?;`;
    const values = [updatedSpell.name, updatedSpell.type, updatedSpell.mana, updatedSpell.description, updatedSpell.difficulty, updatedSpell.effectDuration, updatedSpell.isUnforgivable, updatedSpell.spellRange, updatedSpell.counterSpell, updatedSpell.alignment, id];
    await databaseConnection.execute(updateQuery, values);

    return await getSpellById(id);
}

export async function seedDatabase() {

    await databaseConnection.execute("DROP TABLE IF EXISTS spells;");

    const createTableQuery = `CREATE TABLE IF NOT EXISTS spells (
        id INT AUTO_INCREMENT PRIMARY KEY,
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
    );`;

    await databaseConnection.execute(createTableQuery);

    const [rows, fields] : [RowDataPacket[], mysql.FieldPacket[]] = await databaseConnection.execute("SELECT COUNT(*) as count FROM spells;");
    
    if (rows[0].count === 0) {
        for (let spell of spells) {
            const insertQuery = `INSERT INTO spells (id, name, type, mana, description, difficulty, effectDuration, isUnforgivable, spellRange, counterSpell, alignment)
                                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`;
            const values = [spell.id, spell.name, spell.type, spell.mana, spell.description, spell.difficulty, spell.effectDuration, spell.isUnforgivable, spell.spellRange, spell.counterSpell, spell.alignment];
            await databaseConnection.execute(insertQuery, values);
        }
        console.log("Database seeded with initial spells.");
    } else {
        console.log("Database already seeded.");
    }

    
    
}

export async function connect() {
    databaseConnection = await mysql.createConnection(access);

    await seedDatabase();
}