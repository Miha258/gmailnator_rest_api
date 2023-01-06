import mongoose, {Schema, Document} from "mongoose"


export interface IUser extends Document {
    profileId: number
    email: string
    password: string,
    number: number
}

const UserSchema: Schema = new Schema({
    profileId: { type: Number, require: true}, 
    email: { type: String, require: true, unique: true }, 
    password: { type: String, require: true }, 
    number: { type: Number, require: true }, 
})

export default mongoose.model<IUser>('User', UserSchema)