const express = require('express');
const router = express.Router();

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Utilisation de Prisma pour récupérer toutes les classes
router.get('/', async (req, res) => {
    try {
        const classes = await prisma.classe.findMany();
        res.json(classes);
    } catch (error) {
        console.error(error);
        res.status(500).send('Erreur lors de la récupération des classes');
    }
});

// Ajout d'une nouvelle classe// Création d'une nouvelle classe
router.post('/', async (req, res) => {
   const name = req.body.name;
   try {
     const nouvelleClasse = await prisma.classe.create({
       data: {
           name,
       },
     });
     res.json(nouvelleClasse);
   } catch (error) {
     console.error(error);
     res.status(500).send('Erreur lors de la création de la classe');
   }
});

// Récupération d'une classe spécifique par ID
router.get('/:id', async (req, res) => {
    const classeId = parseInt(req.params.id);
    try {
        const classe = await prisma.classe.findUnique({
            where: { id: classeId },
        });
        res.json(classe);
    } catch (error) {
        console.error(error);
        res.status(500).send('Erreur lors de la récupération de la classe');
    }
});

// Modification d'une classe spécifique par ID
router.put('/:id', async (req, res) => {
    const classeId = parseInt(req.params.id);
    const { name } = req.body;
    try {
        const classe = await prisma.classe.update({
            where: { id: classeId },
            data: { name },
        });
        res.json(classe);
    } catch (error) {
        console.error(error);
        res.status(500).send('Erreur lors de la modification de la classe');
    }
});

// Suppression d'une classe spécifique par ID
router.delete('/:id', async (req, res) => {
    const classeId = parseInt(req.params.id);
    try {
        const classe = await prisma.classe.delete({
            where: { id: classeId },
        });
        res.json(classe);
    } catch (error) {
        console.error(error);
        res.status(500).send('Erreur lors de la suppression de la classe');
    }
});

module.exports = router;
