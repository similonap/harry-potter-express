import harryPotterSpells from "./spells.json";
import { Spell } from "./types";

let spells: Spell[] = harryPotterSpells;

export function getSpells(q: string = "") {
    return spells.filter(spell => spell.description.toLowerCase().includes(q) 
                               || spell.name.toLowerCase().includes(q) 
                               || spell.type.toLowerCase().includes(q))
}

export function getSpellById(id: number) {
    return spells.find(spell => spell.id === id);
}

export function createSpell(spell: Spell) {
    let maxId: number = 0;
    for (let spell of spells) {
        if (spell.id > maxId) {
            maxId = spell.id;
        }
    }
    // let maxId2: number = Math.max(...spells.map(spell => spell.id), 0);
    spell.id = maxId+1;
    spells.push(spell);
    return spell;
}

export function deleteSpell(id: number) {
    spells = spells.filter(spell => spell.id !== id);
}

export function updateSpell(id: number, spellPatch: Spell) {
    spells = spells.map(spell => spell.id === id ? {...spell, ...spellPatch}  : spell);
}