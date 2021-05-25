import { Table, Column, Model, PrimaryKey, BeforeCreate, BeforeUpdate, AllowNull, Length } from 'sequelize-typescript';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


@Table
export class Users extends Model {
    @PrimaryKey
    @AllowNull(false)
    @Column
    email: string

    @AllowNull(false)
    @Length({min: 7})
    @Column
    password: string

    @Column
    token: string

    async verifyPassword(password: string) {
        return await bcrypt.compare(password, this.password);
    }

    getAuthToken() {
        return jwt.sign({id:this.email.toString()},process.env.JWT_SECRET as string);
    }

    toResponse() {
        return({
            email:this.email,
            token:this.token
        });
    }

    logout() {
        this.token = "";
        this.save();
    }

    changePassword(password: string) {
        this.password = password;
        this.token = "";
        this.save();
    }

    static async login(email: string, password: string) {
        const user = await Users.findByPk(email);
        if (user === null) {
            return({status:"error", message:"Authentication failed"});
        }
        const validPassword = await user.verifyPassword(password);
        if(validPassword) {
            user.token = user.getAuthToken();
            user.save();
            return({status:"success", token:user.token});
        } else {
            return({status:"error", message:"Authentication failed"});
        }
    }

    @BeforeCreate
    @BeforeUpdate
    static hashPassword(user: Users) {
        const fields = user.changed();
        if(fields !== false){
            if (fields.includes('password')) {        
                var salt = bcrypt.genSaltSync(10);
                user.password = bcrypt.hashSync(user.password, salt);
            }
        }
    }

    @BeforeCreate
    static updateToken(user: Users){
        user.token = user.getAuthToken();
    }

}
