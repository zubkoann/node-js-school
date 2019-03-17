import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Length } from 'class-validator';
import { User } from './user';

@Entity()
export class Book {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        length: 80
    })
    @Length(2, 80)
    name: string;

    @Column({
        length: 200
    })
        @Length(5, 200)
    description: string;

    @Column({
        type: 'date'
    })
    date: Date;

    @ManyToOne( () => User, (user: User) =>  user.book )
    user: User;

}