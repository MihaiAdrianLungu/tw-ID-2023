const express = require('express');
const bcrypt = require('bcrypt');

const User = require('../database/models/User');

const router = express.Router();

router.get('/', async function (req, res) {
    try {
        const users = await User.findAll();

        res.status(200).json(users);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: 'Error retrieving users', data: {} })
    }
})

router.get('/:username', async function (req, res) {
    try {
        const username = req.params.username;

        const user = await User.findOne({
            where: {
                username: username
            }
        })

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found', data: {} })
        }

        return res.status(200).json({ success: true, message: 'User was found', data: user });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: 'Error finding user by id', data: {} })
    }
})

router.post('/', async function (req, res) {
    try {
        const { username, password, email, role } = req.body;

        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);

        const user = await User.create({
            username,
            password: hash,
            email,
            role
        })

        delete user.dataValues.password;

        return res.status(201).json(user);
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Error creating user', data: {} })
    }
})

router.put('/:username', async function (req, res) {
    try {
        const username = req.params.username;

        const user = await User.findOne({
            where: {
                username: username
            }
        })

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found', data: {} })
        }

        const updatedUser = await user.update(req.body);

        delete updatedUser.dataValues.password;

        return res.status(200).json({ success: true, message: 'User updated', data: updatedUser })
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Error updating user', data: {} })
    }
})

router.delete('/:username', async function (req, res) {
    try {
        const username = req.params.username;

        const user = await User.findOne({
            where: {
                username: username
            }
        })

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found', data: {} })
        }

        await user.destroy();

        res.status(200).json({ success: true, message: 'User deleted', data: {} })
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Error deleting user', data: {} })
    }
})

module.exports = router;