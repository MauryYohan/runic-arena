const express = require('express');
const router = express.Router();

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Utilisation de Prisma pour récupérer tous les types
router.get('/', async (req, res) => {
    try {
        const types = await prisma.type.findMany();
        res.json(types);
    } catch (error) {
        console.error(error);
        res.status(500).send('Erreur lors de la récupération des types');
    }
});

// Création d'un nouveau type
router.post('/', async (req, res) => {
   const name = req.body.name;
   try {
     const nouveauType = await prisma.type.create({
       data: {
           name,
       },
     });
     res.json(nouveauType);
   } catch (error) {
     console.error(error);
     res.status(500).send('Erreur lors de la création du type');
   }
});

// Récupération d'un type spécifique par ID
router.get('/:id', async (req, res) => {
    const typeId = parseInt(req.params.id);
    try {
        const type = await prisma.type.findUnique({
            where: { id: typeId },
        });
        res.json(type);
    } catch (error) {
        console.error(error);
        res.status(500).send('Erreur lors de la récupération du type');
    }
});

// Modification d'un type spécifique par ID
router.put('/:id', async (req, res) => {
    const typeId = parseInt(req.params.id);
    const { name } = req.body;
    try {
        const type = await prisma.type.update({
            where: { id: typeId },
            data: { name },
        });
        res.json(type);
    } catch (error) {
        console.error(error);
        res.status(500).send('Erreur lors de la modification du type');
    }
});

// Suppression d'une type spécifique par ID
router.delete('/:id', async (req, res) => {
    const typeId = parseInt(req.params.id);
    try {
        const type = await prisma.type.delete({
            where: { id: typeId },
        });
        res.json(type);
    } catch (error) {
        console.error(error);
        res.status(500).send('Erreur lors de la suppression du type');
    }
});

module.exports = router;
