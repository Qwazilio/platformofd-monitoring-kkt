interface KktEntity {
    id?: number
    uid_terminal: string
    organization?: string
    name_terminal: string
    name_store?: string
    reg_number?: string
    comment?: string
    address?: string
    active_card?: CardEntity
    cards?: CardEntity[]
    end_date_sub?: Date
    deleted?: boolean
    updated?: boolean
    stock?: boolean
    broken?: boolean
    notification?: string
    hasFN?: boolean
}

interface CardEntity{
    id?: number
    uid_card: string
    end_date_card: Date
    terminal?: KktEntity
}