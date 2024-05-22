import { CircularProgressbar } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'
import { useBudget } from "../hooks/useBudget"
import AmountDisplay from "./AmountDisplay"

export default function BudgetTracker() {
    const { state, totalExpenses, remainingBudget, dispatch } = useBudget()
    const percentage = +((totalExpenses / state.budget) * 100).toFixed(2)

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="flex justify-center">
                <CircularProgressbar
                    value={percentage}
                    styles={{
                        path: { stroke: percentage === 100 ? '#dc2626' : '#3b82f6' },
                        trail: { stroke: '#f5f5f5' },
                        text: { fontSize: 8, fill: percentage === 100 ? '#dc2626' : '#3b82f6' }
                    }}
                    text={`${percentage}% Spent`}
                />
            </div>
            <div className="flex flex-col justify-center items-center gap-8">
                <button
                    type="button"
                    className="bg-pink-800 w-full p-2 text-white uppercase font-bold rounded-lg"
                    onClick={() => dispatch({ type: 'reset-app' })}
                >Reset App</button>
                <AmountDisplay label="Budget" amount={state.budget} />
                <AmountDisplay label="Available" amount={remainingBudget} />
                <AmountDisplay label="Spent" amount={totalExpenses} />
            </div>
        </div>
    )
}                        
