import { BeforeInsert, BeforeUpdate, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

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
        nullable: true,
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

    @Column('text',{
        default: '-'
    })
    username: string;

    @Column('text',{
        default: '-'
    })
    first_name: string;

    @Column('text',{
        default: '-'
    })
    last_name: string;

    @Column('text',{
        default: '-'
    })
    occupation?: string;

    @Column('text',{
        default: '-'
    })
    companyName?:string;

    @Column('text',{
        default: '-'
    })
    phone?:string;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createAt: Date;
    
    @Column('timestamp', {
        nullable: true,
    })
    lastLogin: Date;

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
