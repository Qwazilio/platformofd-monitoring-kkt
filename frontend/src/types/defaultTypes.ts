interface TerminalEntity{
    id?: number
    uid_terminal: string
    organization?: string
    name_terminal: string
    name_store?: string
    comment?: string
    address?: string
    active_card?: CardEntity
    cards?: CardEntity[]
    end_date_sub?: Date
    deleted?: boolean
    stock?: boolean
    broken?: boolean
    notification?: string
}

interface CardEntity{
    id?: number
    uid_card: string
    end_date_card: Date
    terminal?: TerminalEntity
}