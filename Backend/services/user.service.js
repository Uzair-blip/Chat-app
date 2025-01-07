import userModel from "../models/user.model.js";

const CreateUser = async ({ email, password }) => {
    if (!email || !password) {
        throw new Error("Please fill all the fields");
    }

    // Check if the email already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
        throw new Error("Email already exists");
    }

    const user = new userModel({ email, password });
    await user.save();

    return user;
};
const GetallUser=async ({userId}) => {
    //agr userid hogi ti ap es user ko nhi lao fu
    const users=await userModel.find({
        _id:{$ne:userId}
    })
    return users
}
export default { CreateUser,GetallUser };
