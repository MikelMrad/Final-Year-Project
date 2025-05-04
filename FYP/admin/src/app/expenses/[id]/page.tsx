'use client'
import { useState, useEffect } from "react"
import { useQuery, useMutation } from "@apollo/client"
import { useRouter, useParams } from "next/navigation"
import Sidebar from "../../../components/AdminSidebar/page"
import styles from "./style.module.css"
import { GET_EXPENSE, UPDATE_EXPENSE } from "../../data/queries"

export default function EditExpensePage() {
  const { id } = useParams()
  const router = useRouter()
  const { data, loading, error } = useQuery(GET_EXPENSE, { variables: { id } })
  const [updateExpense, { loading: saving, error: saveError }] =
    useMutation(UPDATE_EXPENSE)
  const [title, setTitle] = useState("")
  const [amount, setAmount] = useState("")
  const [date, setDate] = useState("")
  const [count, setCount] = useState("1")

  useEffect(() => {
    if (data?.expense) {
      setTitle(data.expense.title)
      setAmount(data.expense.amount.toString())
      setDate(new Date(data.expense.date).toISOString().split("T")[0])
      setCount(
        data.expense.count !== undefined && data.expense.count !== null
          ? data.expense.count.toString()
          : "1"
      )
    }
  }, [data])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await updateExpense({
      variables: {
        id,
        title,
        amount: parseFloat(amount),
        date: new Date(date).toISOString(),
        count: parseInt(count)
      }
    })
    router.push("/expenses")
  }

  if (loading) return <p style={{ color: "#2c3e50" }}>Loading expense...</p>
  if (error) return <p style={{ color: "#c0392b" }}>Error loading expense</p>

  return (
    <div className={styles.pageWrapper}>
      <Sidebar />
      <div className={styles.mainContent}>
        <h2 className={styles.pageTitle}>Edit Expense</h2>
        <form className={styles.form} onSubmit={handleSubmit}>
          <label className={styles.label}>
            <span className={styles.labelText}>Title</span>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
              className={styles.input}
            />
          </label>
          <label className={styles.label}>
            <span className={styles.labelText}>Amount ($)</span>
            <input
              type="number"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              required
              step="0.01"
              className={styles.input}
            />
          </label>
          <label className={styles.label}>
            <span className={styles.labelText}>Date</span>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              required
              className={styles.input}
              max={new Date().toISOString().split("T")[0]}
            />
          </label>
          <label className={styles.label}>
            <span className={styles.labelText}>Count</span>
            <input
              type="number"
              value={count}
              onChange={e => setCount(e.target.value)}
              required
              min="1"
              className={styles.input}
            />
          </label>
          <button
            type="submit"
            className={styles.saveButton}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
          {saveError && (
            <p className={styles.errorText}>Error: {saveError.message}</p>
          )}
        </form>
      </div>
    </div>
  )
}
