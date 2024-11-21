import express, { Request, Response } from "express";

import Template from "./model.js";

const router = express.Router();

// Route to get all templates
router.get("/templates", async (req: Request, res: Response) => {
    try {
        const templates = await Template.findAll();
        res.status(200).json(templates);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to retrieve templates" });
    }
});

// Route to save a new template
router.post("/templates", async (req: Request, res: Response) => {
    const { content } = req.body;
    if (!content) {
        return res.status(400).json({ message: "Content is required" });
    }
    try {
        const newTemplate = await Template.create({ content });
        res.status(201).json(newTemplate);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to save template" });
    }
});

// Route to update a template
router.put("/templates/:id", async (req: Request, res: Response) => {
    const { id } = req.params;
    const { content } = req.body;
    if (!content) {
        return res.status(400).json({ message: "Content is required" });
    }
    try {
        const template = await Template.findByPk(id);
        if (!template) {
            return res.status(404).json({ message: "Template not found" });
        }
        template.content = content;
        await template.save();
        res.status(200).json(template);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to update template" });
    }
});

// Route to delete a template
router.delete("/templates/:id", async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const template = await Template.findByPk(id);
        if (!template) {
            return res.status(404).json({ message: "Template not found" });
        }
        await template.destroy();
        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to delete template" });
    }
});

export default router;