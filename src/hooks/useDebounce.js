import { useEffect } from "react"
import { useState } from "react"

export const useDebounce = (value, delay) => {
    const [valueDebounce, setValueDebounce] = useState('')
    useEffect(() => {
        const handle = setTimeout(() => {
            setValueDebounce(value)
        }, [delay])
        return () => {
            clearTimeout(handle)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value])
    return valueDebounce
}