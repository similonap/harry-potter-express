import { Router } from "express";
import { Spell } from "../types";
import { getSpells, deleteSpell, getSpellById, createSpell, updateSpell } from "../database";

export function spellsRouter() {
    const router = Router();

    router.get("/", (req, res) => {
        const q : string = typeof req.query.q === "string" ? req.query.q : "";

        const spells: Spell[] = getSpells(q.toLowerCase());

        res.json(spells);
    });

    router.get("/:id", (req, res) => {
        const id: number = parseInt(req.params.id);

        const spell: Spell | undefined = getSpellById(id);

        if (spell) {
            res.json(spell);
        } else {
            res.status(404).send({error: "Spell not found"});
        }
    });

    router.post("/", (req, res) => {
        const newSpell : Spell = req.body;

        let createdSpell: Spell = createSpell(newSpell);

        res.status(201).json(createdSpell);
    });


    router.delete("/:id", (req,res) => {
        const id : number = parseInt(req.params.id);

        deleteSpell(id);

        res.status(204).json({});
    });

    router.patch("/:id", (req, res) => {
        const id: number = parseInt(req.params.id);
        const spellPatch: Spell = req.body;

        updateSpell(id, spellPatch);

        res.status(200).json(getSpellById(id));
    });


    return router;
}