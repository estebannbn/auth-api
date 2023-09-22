import {DocumentType, getModelForClass, index, modelOptions, pre, prop, Severity} from '@typegoose/typegoose'
import {nanoid} from "nanoid";
import argon2 from 'argon2'
import logger from "../utils/logger.js";

export const privateFields = [
    "password",
    "__v",
    "verificationCode",
    "passwordResetCode",
    "verified"
];
// Se ejecuta cada vez que se usa el metodo .save(). Encripta el password si es que se cambió.
@pre<User>("save", async function(){
    if(!this.isModified('password')){
        return
    }
    const hash = await argon2.hash(this.password);
    this.password = hash
    return
})
@index({email:1})
@modelOptions({
    schemaOptions:{
        timestamps:true
    },
    options:{
        allowMixed: Severity.ALLOW
    }
})
export class User {
    @prop({required:true})
    firstName: string;

    @prop({required:true, lowercase:true})
    email:string;

    @prop({required:true})
    lastName:string;

    @prop({required:true, default: ()=> nanoid()})
    verificationCode:string;

    @prop({required:true})
    password:string;

    @prop()
    passwordResetCode:string | null;

    @prop({default:false})
    verified:boolean;

    async validatePassword(this: DocumentType<User>, candidatePassword:string){
        try {
            return await argon2.verify(this.password,candidatePassword)
        }catch (error) {
            logger.error({
                message: 'Could not validate password',
                error
            })
        }
    }
}
const UserModel = getModelForClass(User)
export default UserModel