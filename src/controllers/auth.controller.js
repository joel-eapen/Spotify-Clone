const userModel = require('../models/user.models.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const registerUser = async (req, res) => {
    const { username, email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    try {

        const isUserExists = await userModel.findOne({
            $or: [{ email }, { username }]
        })

        if (isUserExists) {
            return res.status(409).json({
                message: "User with this email or username already exists"
            })
        }

        const newUser = await userModel.create({
            username,
            email,
            password: hashedPassword,
            role
        })

        //JWT token generation
        const token = jwt.sign({
            id: newUser._id,
            role: newUser.role
        }, process.env.JWT_SECRET)

        //Cookie shared with client browser
        res.cookie('token', token);

        res.status(201).json({
            message: "User registered successfully",
            user: newUser
        })
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            error: error.message
        })
    }

};

const loginUser = async (req, res) => {
    const { email, password,username } = req.body;
    const user = await userModel.findOne({
        $or: [{ email }, { username }]
    })

    if (!user) {
        return res.status(404).json({
            message: "User not found"
        })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(401).json({
            message: "Invalid password"
        })
    }
    const token = jwt.sign({
        id: user._id,
        role: user.role
    },process.env.JWT_SECRET)
    res.cookie('token', token)
    res.status(200).json({
        message: "Login successful",

    })
}

module.exports = { registerUser, loginUser };