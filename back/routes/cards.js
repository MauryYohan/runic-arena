const express = require('express');
const router = express.Router();

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { faker } = require('@faker-js/faker');
const multer = require('multer');

// Le petit middleware qui va bien
// Permet de changer le nom du fichier en mettant le nom du fichier + la date et la bonne extension
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/images/')
    },
    filename: function (req, file, cb) {
        const newFilename = `${Date.now()}-${file.originalname}`
        cb(null, newFilename)
    }
})

const upload = multer({storage: storage})


// Utilisation de Prisma pour récupérer toutes les cartes
router.get('/', async (req, res) => {
    try {
        const cards = await prisma.card.findMany();
        res.json(cards);
    } catch (error) {
        console.error(error);
        res.status(500).send('Erreur lors de la récupération des cards');
    }
})

// Création d'une nouvelle carte
router.post('/', upload.single('image'), async (req, res) => {
    try {
        const { name, typeId, classeId, power, mainSkillId, secondSkillId, passiveSkillId } = req.body;
        const image = req.file.filename;
        console.log(image);

        // If [type, classe, compétences principales, secondaires, passives] in bdd
        const type = await prisma.type.findUnique({ where: { id: parseInt(typeId) } });
        const classe = await prisma.classe.findUnique({ where: { id: parseInt(classeId) } });
        const mainSkill = await prisma.skill.findUnique({ where: { id: parseInt(mainSkillId) } });
        const secondSkill = await prisma.skill.findUnique({ where: { id: parseInt(secondSkillId) } });
        const passiveSkill = await prisma.skill.findUnique({ where: { id: parseInt(passiveSkillId) } });

        if (!type || !classe || !mainSkill || !secondSkill || !passiveSkill) {
            return res.status(400).json({ message: 'Type, classe or skill not found' });
        }

        // Créer la carte
        const card = await prisma.card.create({
            data: {
                name,
                image,
                type: { connect: { id: parseInt(typeId) } },
                classe: { connect: { id: parseInt(classeId) } },
                power: parseInt(power),
                mainSkill: { connect: { id: parseInt(mainSkillId) } },
                secondSkill: { connect: { id: parseInt(secondSkillId) } },
                passiveSkill: { connect: { id: parseInt(passiveSkillId) } },
            }
        });

        res.status(201).json(card);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error creating card' });
    }
});

// Récupération d'une carte spécifique par ID
router.get('/:id', async (req, res) => {
    const cardId = parseInt(req.params.id);
    try {
        const the_card = await prisma.card.findUnique({
            where: { id: cardId },
        });
        res.json(the_card);
    } catch (error) {
        console.error(error);
        res.status(500).send('Erreur lors de la récupération de la carte');
    }
});

router.put('/:id', async (req, res) => {
    const cardId = parseInt(req.params.id);
    const { name, image, typeId, classeId, power, mainSkillId, secondSkillId, passiveSkillId } = req.body;
    try {
        const the_card = await prisma.card.findUnique({ where: { id: cardId } });
        const updatedCard = await prisma.card.update({
            where: { id: cardId },
            data: {
                name: name || the_card.name,
                image: image || the_card.image,
                typeId: typeId || parseInt(the_card.typeId),
                classeId: classeId || parseInt(the_card.classeId),
                power: power || parseInt(the_card.power),
                mainSkillId: mainSkillId || parseInt(the_card.mainSkillId),
                secondSkillId: secondSkillId || parseInt(the_card.secondSkillId),
                passiveSkillId: passiveSkillId || parseInt(the_card.passiveSkillId),
            },
            include: {
                type: true,
                classe: true,
                mainSkill: true,
                secondSkill: true,
                passiveSkill: true,
            },
        });
        res.json(updatedCard);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Une erreur est survenue lors de la mise à jour de la carte.' });
    }
});

// Suppression d'une carte par son ID
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const card = await prisma.card.delete({
            where: { id: parseInt(id) },
        });
        res.json(card);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting card' });
    }
});

// Génération d'un nom de carte
router.get('/name-generator', (req, res) => {
    const cardName = faker.random.word()
    res.send(cardName.toUpperCase());
});

module.exports = router;
