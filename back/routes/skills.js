const express = require('express');
const router = express.Router();

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Utilisation de Prisma pour récupérer tous les skills
router.get('/', async (req, res) => {
    try {
        const skills = await prisma.skill.findMany();
        res.json(skills);
    } catch (error) {
        console.error(error);
        res.status(500).send('Erreur lors de la récupération des skills');
    }
});

// Création d'un nouveau skill
router.post('/', async (req, res) => {
    const { name, description } = req.body;
    try {
        const nouveauskill = await prisma.skill.create({
            data: { name, description },
        });
        res.json(nouveauskill);
    } catch (error) {
        console.error(error);
        res.status(500).send('Erreur lors de la création du skill');
    }
});

// Récupération d'un skill spécifique par ID
router.get('/:id', async (req, res) => {
    const skillId = parseInt(req.params.id);
    try {
        const skill = await prisma.skill.findUnique({
            where: { id: skillId },
        });
        res.json(skill);
    } catch (error) {
        console.error(error);
        res.status(500).send('Erreur lors de la récupération du skill');
    }
});

// Modification d'un skill spécifique par ID
router.put('/:id', async (req, res) => {
    const skillId = parseInt(req.params.id);
    const { name, description } = req.body;
    try {
        const skill = await prisma.skill.update({
            where: { id: skillId },
            data: { name, description },
        });
        res.json(skill);
    } catch (error) {
        console.error(error);
        res.status(500).send('Erreur lors de la modification du skill');
    }
});

// Suppression d'une skill spécifique par ID
router.delete('/:id', async (req, res) => {
    const skillId = parseInt(req.params.id);
    try {
        const skill = await prisma.skill.delete({
            where: { id: skillId },
        });
        res.json(skill);
    } catch (error) {
        console.error(error);
        res.status(500).send('Erreur lors de la suppression du skill');
    }
});

module.exports = router;
