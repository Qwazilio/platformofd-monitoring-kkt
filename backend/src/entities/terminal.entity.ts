import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Card } from "./card.entity";

@Entity('terminal')
export class Terminal{
    @PrimaryGeneratedColumn()
    id: number

    @Column({unique: true, nullable: false})
    uid_terminal: string

    @Column({nullable: true})
    reg_number: number

    @Column({nullable: false})
    name_terminal: string

    @Column({nullable: true})
    name_store: string

    @Column({nullable: true})
    organization: string

    @Column({nullable: true})
    comment: string

    @Column({nullable: true})
    address: string

    @OneToOne(() => Card, {nullable: true})
    @JoinColumn()
    active_card: Card

    @ManyToOne(() => Card, (card) => card.terminal)
    cards: Card[]

    @Column({nullable: true})
    end_date_sub: Date

    @Column({nullable: false, default: false})
    deleted: boolean

    @Column({nullable: false, default: false})
    stock: boolean

    @Column({nullable: false, default: false})
    broken: boolean

    @Column({nullable: true})
    notification: string
}