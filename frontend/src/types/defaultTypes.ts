interface TerminalEntity{
    id?: number
    uid_terminal: number
    organization?: string
    name_terminal: string
    name_store?: string
    comment?: string
    address?: string
    active_card?: CardEntity
    cards?: CardEntity[]
    end_date_sub?: Date
    deleted?: boolean
}

interface CardEntity{
    id?: number
    uid_card: number
    end_date_card: Date
    terminal?: TerminalEntity
}