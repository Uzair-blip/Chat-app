
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
    },
});

userSchema.methods.generateAuthtoken = function () {
    return jwt.sign(
        { _id: this._id },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
    );
};

userSchema.methods.comparePassword = async function (password) {
    if (!password) {
        throw new Error("Password is required");
    }

    return bcrypt.compare(password, this.password);
};

userSchema.statics.hashPassword = async function (password) {
    return bcrypt.hash(password, 10);
};

const User = mongoose.model("User", userSchema);

export default User;
