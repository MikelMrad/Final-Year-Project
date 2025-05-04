'use client'

import { useQuery, useMutation } from "@apollo/client"
import { GET_ALL_EXPENSES } from "../data/queries"
import { DELETE_EXPENSE } from "../data/queries"
import Sidebar from "../../components/AdminSidebar/page"
import styles from "./style.module.css"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function ExpensesPage() {
  const { data, loading, error, refetch } = useQuery(GET_ALL_EXPENSES)
  const [deleteExpense] = useMutation(DELETE_EXPENSE)
  const router = useRouter()

  useEffect(() => {
    refetch()
  }, [])

  const handleDelete = async (id: string) => {
    try {
      await deleteExpense({ variables: { id } })
      refetch()
    } catch (err) {
      console.error("Failed to delete expense", err)
    }
  }

  return (
    <div className={styles.pageWrapper}>
      <Sidebar />
      <div className={styles.mainContent}>
        <div className={styles.headerRow}>
          <h2 className={styles.pageTitle}>Expenses</h2>
          <button
            className={styles.addButton}
            onClick={() => router.push("/expenses/add")}
          >
            + Add Expense
          </button>
        </div>

        {loading ? (
          <p style={{ color: "#2c3e50" }}>Loading...</p>
        ) : error ? (
          <p>Error loading expenses</p>
        ) : (
          <ul className={styles.expenseList}>
            {data.expenses.map((expense: any) => (
              <li key={expense.id} className={styles.expenseCard}>
                <div>
                  <strong>{expense.title}</strong> – ${expense.amount}
                  <br />
                  Date: {new Date(expense.date).toLocaleDateString()}
                  <br />
                  Count: {expense.count}
                </div>
                <div className={styles.buttonGroup}>
                  <button
                    className={styles.editButton}
                    onClick={() => router.push(`/expenses/${expense.id}`)}
                  >
                    Edit
                  </button>
                  <button
                    className={styles.deleteButton}
                    onClick={() => handleDelete(expense.id)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
