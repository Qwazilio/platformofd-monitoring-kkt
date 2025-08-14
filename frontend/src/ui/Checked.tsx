interface CheckedProps{
    value: boolean;
    setValue: (value: boolean) => void;
}
export default function Checked({value, setValue}: CheckedProps) {
    return(
        <input
            type={"checkbox"}
            checked={value}
            onChange={(event) => setValue(event.target.checked)}
        />)
}