import DatePicker from 'react-date-picker';
import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css';
import { ChangeEvent, useEffect, useState } from "react";
import { categories } from "../data/categories";
import { DraftExpense, Value } from "../types";
import ErrorMessage from "./ErrorMessage";
import { useBudget } from "../hooks/useBudget";

export default function ExpenseForm() {
    const initialExpense = {
        amount: 0,
        expenseName: '',
        category: '',
        date: new Date()
    }

    const [expense, setExpense] = useState<DraftExpense>(initialExpense)
    const [error, setError] = useState('')
    const [prevAmount, setPrevAmount] = useState(0)
    const { state, dispatch, remainingBudget } = useBudget()

    useEffect(() => {
        if (state.editingId) {
            const editingExpense = state.expenses.filter(currentExpense => currentExpense.id === state.editingId)[0]
            setExpense(editingExpense)
            setPrevAmount(editingExpense.amount)
        }
    }, [state.editingId])

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        const isAmaountField = ['amount'].includes(name)
        setExpense({
            ...expense,
            [name]: isAmaountField ? Number(value) : value
        })
    }

    const handleChangeDate = (value: Value) => {
        setExpense({
            ...expense,
            date: value
        })
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (Object.values(expense).includes('')) {
            setError('All fields are required')
            return
        }

        if ((expense.amount - prevAmount) > remainingBudget) {
            setError('Budget Not Enought')
        }

        if (state.editingId) {
            dispatch({ type: 'update-expense', payload: { expense: { id: state.editingId, ...expense } } })
        } else {
            dispatch({ type: 'add-expense', payload: { expense } })
        }

        setExpense(initialExpense)
        setPrevAmount(0)
    }

    return (
        <form className="space-y-5" onSubmit={handleSubmit}>
            <legend
                className="text-2xl text-center font-black border border-b-4 border-blue-800 py-2 uppercase rounded-lg"
            >{state.editingId ? 'Edit Expense' : 'New Expense'}</legend>

            {error && <ErrorMessage>{error}</ErrorMessage>}

            <div className="flex flex-col gap-2">
                <label htmlFor="expenseName" className="text-xl">Expense Name:</label>
                <input
                    type="text"
                    id="expenseName"
                    name="expenseName"
                    placeholder="Add new Expense"
                    className="bg-slate-100 p-2"
                    value={expense.expenseName}
                    onChange={handleChange}
                />
            </div>
            <div className="flex flex-col gap-2">
                <label htmlFor="amount" className="text-xl">Amount:</label>
                <input
                    type="number"
                    id="amount"
                    name="amount"
                    placeholder="Add your budget Ex. 500"
                    className="bg-slate-100 p-2"
                    value={expense.amount}
                    onChange={handleChange}
                />
            </div>
            <div className="flex flex-col gap-2">
                <label htmlFor="category" className="text-xl">Category:</label>
                <select
                    id="category"
                    name="category"
                    className="bg-slate-100 p-2"
                    value={expense.category}
                    onChange={handleChange}
                >
                    <option value="">-- Select --</option>
                    {categories.map(cat => (
                        <option
                            key={cat.id}
                            value={cat.id}
                        >{cat.name}</option>
                    ))}
                </select>
            </div>
            <div className="flex flex-col gap-2">
                <label htmlFor="amount" className="text-xl">Expense Date:</label>
                <DatePicker
                    className="bg-slate-100 p-2 border-0"
                    value={expense.date}
                    onChange={handleChangeDate}
                >
                </DatePicker>
            </div>
            <input
                type="submit"
                className="bg-blue-800 cursor-pointer w-full p-2 text-white uppercase font-bold rounded-lg"
                value={state.editingId ? 'Save Changes' : 'Add Expense'}
            />
        </form>
    )
}