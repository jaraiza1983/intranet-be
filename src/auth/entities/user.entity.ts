import { BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('users')
export class User {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text',{
        unique: true,
    })
    email: string;

    @Column('text', {
        select: false,
    })
    password: string;

    @Column('text')
    fullName: string;

    @Column('bool',{
        default: true,
    })
    isActive: boolean;

    @Column('text',{
        array: true,
        default: ['user']
    })
    roles: string[];

    @Column('text')
    username: string;

    @Column('text',{
        default: '-'
    })
    first_name: string;

    @Column('text',{
        default: '-'
    })
    last_name: string;

    @Column('text')
    occupation?: string;

    @Column('text')
    companyName?:string;

    @Column('text')
    phone?:string;

    @BeforeInsert()
    checkFieldsBeforeInsert() {
        this.email = this.email.toLocaleLowerCase().trim();
        this.username = this.email;
    }

    @BeforeUpdate()
    checkFieldsBeforeUpdate() {
        this.email = this.email.toLocaleLowerCase().trim();
    }

}
