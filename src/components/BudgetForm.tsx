import { useState, useMemo } from "react"
import { useBudget } from "../hooks/useBudget"

export default function BudgetForm() {
    const [budget, setBudget] = useState(0)
    const { dispatch } = useBudget()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setBudget(+e.target.value)
    }

    const isValid = useMemo(() => {
        return isNaN(budget) || budget <= 0
    }, [budget])

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        dispatch({ type: 'add-budget', payload: { budget } })
    }

    return (
        <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="flex flex-col space-y-5">
                <label htmlFor="budget" className="text-4xl text-blue-800 font-bold text-center">Set Budget</label>
                <input
                    id="budget"
                    name="budget"
                    type="number"
                    className="w-full bg-white border border-gray-200 p-2"
                    placeholder="Set your Budget..."
                    value={budget}
                    onChange={handleChange}
                />
            </div>
            <input
                type="submit"
                value="Set Budget"
                className="bg-blue-800 hover:bg-blue-900 rounded-lg cursor-pointer w-full text-white font-black uppercase disabled:opacity-30 disabled:cursor-not-allowed p-2"
                disabled={isValid}
            />
        </form>
    )
}