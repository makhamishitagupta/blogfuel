import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },

    password: {
        type: String,
        required: false,
        select: false
    },

    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },

    favorites:[
        {
        type:mongoose.Schema.Types.ObjectId,
        ref:"Blog"
        }
    ],

    picture: {
        type: String,
        default: ''
    },

    readingHistory: [
        {
            blog: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Blog"
            },
            viewedAt: {
                type: Date,
                default: Date.now
            }
        }
    ],

    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;