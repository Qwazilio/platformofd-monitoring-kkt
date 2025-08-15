interface CheckedProps{
    value: boolean;
    setValue: (value: boolean) => void;
    disabled?: boolean;
}
export default function Checked({value, setValue, disabled}: CheckedProps) {
    return(
        <input
            disabled={disabled}
            type={"checkbox"}
            checked={value}
            onChange={(event) => setValue(event.target.checked)}
        />)
}