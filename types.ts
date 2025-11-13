export interface Spell {
    id: number;
    name: string;
    type: string;
    mana: number;
    description: string;
    difficulty: string;
    effectDuration: string;
    isUnforgivable: boolean;
    spellRange: string;
    counterSpell: string;
    alignment: string;
}