'use client'

import { useMutation } from "@apollo/client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Sidebar from "../../../components/AdminSidebar/page"
import styles from "./style.module.css"
import { ADD_EXPENSE } from "../../data/queries"

export default function AddExpensePage() {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [amount, setAmount] = useState("")
  const [date, setDate] = useState("")

  const [addExpense, { loading, error }] = useMutation(ADD_EXPENSE)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
  
    const isoDate = new Date(date).toISOString()
    
    await addExpense({
      variables: {
        title,
        amount: parseFloat(amount),
        date: isoDate,
      },
    })
  
    router.push("/expenses")
  }
  

  return (
    <div className={styles.pageWrapper}>
      <Sidebar />
      <div className={styles.mainContent}>
        <h2 className={styles.pageTitle}>Add Expense</h2>
        <form className={styles.form} onSubmit={handleSubmit}>
          <label>
            <span>Title</span>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className={styles.input}
            />
          </label>
          <label>
            <span>Amount ($)</span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              step="0.01"
              className={styles.input}
            />
          </label>
          <label>
            <span>Date</span>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className={styles.input}
              max={new Date().toISOString().split("T")[0]}
            />
          </label>
          <button
            type="submit"
            className={styles.saveButton}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Expense"}
          </button>
          {error && <p className={styles.errorText}>Error: {error.message}</p>}
        </form>
      </div>
    </div>
  )
}
