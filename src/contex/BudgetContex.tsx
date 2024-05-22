import { useReducer, createContext, Dispatch, ReactNode, useMemo } from "react"
import { BudgetAction, BudgetReducer, BudgetState, initialState } from "../reducers/budget-reducers"

type BudgetProviderProps = {
    children: ReactNode
}

type BudgetContextProps = {
    state: BudgetState
    dispatch: Dispatch<BudgetAction>
    totalExpenses: number
    remainingBudget: number
}

export const BudgetContext = createContext<BudgetContextProps>(null!)

export const BudgetProvider = ({ children }: BudgetProviderProps) => {
    const [state, dispatch] = useReducer(BudgetReducer, initialState)

    const totalExpenses = useMemo(() =>
        state.expenses.reduce((total, expense) => expense.amount + total, 0), [state.expenses])

    const remainingBudget = state.budget - totalExpenses

    return (
        <BudgetContext.Provider
            value={{
                state,
                dispatch,
                totalExpenses,
                remainingBudget
            }}
        >{children}
        </BudgetContext.Provider>
    )
}