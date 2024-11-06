import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Terminal } from "./terminal.entity";

@Entity('card')
export class Card{
    @PrimaryGeneratedColumn()
    id: number

    @Column({unique: true, nullable: false})
    uid_card: number

    @Column({nullable: false})
    end_date_card: Date

    @OneToOne(() => Terminal, (terminal) => terminal.cards, {nullable: false})
    terminal: Terminal

    @Column({nullable: false, default: true})
    status: boolean
}