import { Router } from "express";
import { Spell } from "../types";
import { getSpells, deleteSpell, getSpellById, createSpell, updateSpell } from "../database";

export function spellsRouter() {
    const router = Router();

    router.get("/", async (req, res) => {
        const q : string = typeof req.query.q === "string" ? req.query.q : "";

        const spells: Spell[] = await getSpells(q.toLowerCase());

        res.json(spells);
    });

    router.get("/:id", async (req, res) => {
        const id: number = parseInt(req.params.id);

        const spell: Spell | undefined = await getSpellById(id);

        if (spell) {
            res.json(spell);
        } else {
            res.status(404).send({error: "Spell not found"});
        }
    });

    router.post("/", async(req, res) => {
        const newSpell : Spell = req.body;

        let createdSpell: Spell | undefined = await createSpell(newSpell);

        if (!createdSpell) {
            res.status(500).send({error: "Failed to create spell"});
            return;
        }

        res.status(201).json(createdSpell);
    });


    router.delete("/:id", async (req,res) => {
        const id : number = parseInt(req.params.id);

        await deleteSpell(id);

        res.status(204).json({});
    });

    router.patch("/:id", async(req, res) => {
        const id: number = parseInt(req.params.id);
        const spellPatch: Spell = req.body;

        let updatedSpell : Spell | undefined = await updateSpell(id, spellPatch);
        if (!updatedSpell) {
            res.status(404).send({error: "Spell not found"});
            return;
        }

        res.status(200).json(updatedSpell);
    });


    return router;
}