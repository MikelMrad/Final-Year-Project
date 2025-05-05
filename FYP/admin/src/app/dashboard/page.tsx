'use client'
import { ChangeEvent, useState, useMemo } from 'react'
import { useQuery } from '@apollo/client'
import CircularProgress from '@mui/material/CircularProgress'
import {
  GET_ALL_EXPENSES,
  GET_ALL_APPOINTMENTS,
  GET_ALL_STUDENTS,
  GET_ALL_TUTORS,
  GET_ALL_SUBJECTS,
} from '../data/queries'
import Sidebar from '../../components/AdminSidebar/page'
import styles from './style.module.css'

interface Expense    { id: string; title: string; amount: number; date: string; count?: number }
interface Appointment {
  id: string; date: string; confirmed: boolean
  student: { id: string; name: string }
  tutor:   { id: string; name: string; hourlyRate: number; subjects: string[] }
}
interface Student { id: string; name: string }
interface Tutor   { id: string; name: string }
interface Subject { id: string; name: string }

type ExpensesData     = { expenses: Expense[] }
type AppointmentsData = { appointments: Appointment[] }
type StudentsData     = { students: Student[] }
type TutorsData       = { tutors: Tutor[] }
type SubjectsData     = { subjects: Subject[] }

const AdminHome = () => {
  const { data: eData, loading: loadingExpenses } = useQuery<ExpensesData>(GET_ALL_EXPENSES)
  const { data: aData, loading: loadingAppointments } = useQuery<AppointmentsData>(GET_ALL_APPOINTMENTS)
  const { data: sData } = useQuery<StudentsData>(GET_ALL_STUDENTS)
  const { data: tData } = useQuery<TutorsData>(GET_ALL_TUTORS)
  const { data: subData } = useQuery<SubjectsData>(GET_ALL_SUBJECTS)

  const loading = loadingExpenses || loadingAppointments

  const [dateFilter, setDateFilter]     = useState<string>("")
  const [entityType, setEntityType]     = useState<"all"|"student"|"tutor"|"subject">("all")
  const [entityId, setEntityId]         = useState<string>("")

  const expenses     = eData?.expenses     ?? []
  const appointments = aData?.appointments ?? []
  const students = sData?.students ?? []
  const tutors = tData?.tutors ?? []
  const subjects = subData?.subjects ?? []

  const parseDate = (rawDate: string) => {
    const numericValue = Number(rawDate)
    return !isNaN(numericValue) ? new Date(numericValue) : new Date(rawDate)
  }

  const confirmedAppointments = useMemo(
    () => appointments.filter((appointment) => appointment.confirmed),
    [appointments]
  )

  const filteredAppointments = useMemo(() => {
    return confirmedAppointments.filter((appointment) => {
      if (dateFilter) {
        const appointmentDate = parseDate(appointment.date).toISOString().split("T")[0]
        if (appointmentDate !== dateFilter) return false
      }
      if (entityType === "student" && entityId && appointment.student.id !== entityId) return false
      if (entityType === "tutor" && entityId && appointment.tutor.id !== entityId) return false
      if (entityType === "subject" && entityId && !appointment.tutor.subjects.includes(entityId))
        return false
      return true
    })
  }, [confirmedAppointments, dateFilter, entityType, entityId])

  const expenseSummary = useMemo<Record<string, number>>(() => {
    const summary: Record<string, number> = {}
    expenses.forEach((expense) => {
      if (dateFilter) {
        const expenseDate = parseDate(expense.date).toISOString().split("T")[0]
        if (expenseDate !== dateFilter) return
      }
      summary[expense.title] = (summary[expense.title] || 0) + (expense.amount * (expense.count || 1))
    })
    return summary
  }, [expenses, dateFilter])

  const expenseCount = useMemo<Record<string, number>>(() => {
    const m: Record<string, number> = {}
    expenses.forEach(e => {
      if (dateFilter) {
        const d = parseDate(e.date).toISOString().split("T")[0]
        if (d !== dateFilter) return
      }
      m[e.title] = (m[e.title] || 0) + (e.count || 1)
    })
    return m
  }, [expenses, dateFilter])

  const revenue = filteredAppointments.reduce((sum, a) => {
    return sum + (a.tutor?.hourlyRate || 0);
  }, 0)
  const totalExpense = Object.values(expenseSummary).reduce((s,x) => s + x, 0)
  const profit       = revenue - totalExpense
  const titles       = Object.keys(expenseSummary)

  const onDateChange   = (e: ChangeEvent<HTMLInputElement>)    => setDateFilter(e.target.value)
  const onTypeChange   = (e: ChangeEvent<HTMLSelectElement>)  => { setEntityType(e.target.value as any); setEntityId("") }
  const onEntityChange = (e: ChangeEvent<HTMLSelectElement>)  => setEntityId(e.target.value)

  return (
    <div className={styles.pageWrapper}>
      <Sidebar/>
      <div className={styles.mainContent}>
        <h2 className={styles.pageTitle}>Dashboard Statistics</h2>

        <div className={styles.filters}>
          <input type="date" className={styles.select} value={dateFilter} onChange={onDateChange}/>
          <select className={styles.select} value={entityType} onChange={onTypeChange}>
            <option value="all">All</option>
            <option value="student">Student</option>
            <option value="tutor">Tutor</option>
            <option value="subject">Subject</option>
          </select>
          {entityType !== "all" && (
            <select className={styles.select} value={entityId} onChange={onEntityChange}>
              <option value="">— choose —</option>
              {entityType==="student" && students.map(s=> <option key={s.id} value={s.id}>{s.name}</option>)}
              {entityType==="tutor"   && tutors  .map(t=> <option key={t.id} value={t.id}>{t.name}</option>)}
              {entityType==="subject" && subjects.map(su=> <option key={su.name} value={su.name}>{su.name}</option>)}
            </select>
          )}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 40 }}>
            <CircularProgress />
          </div>
        ) : (
          <table className={styles.statsTable}>
            <thead>
              <tr>
                <th>Expense</th>
                <th>Total Value</th>
                <th>Count</th>
                <th>Profit</th>
              </tr>
            </thead>
            <tbody>
              {titles.map(title => {
                const total = expenseSummary[title]
                const count = expenseCount[title] || 0
                const share = totalExpense ? total / totalExpense : 0
                const prof  = profit * share
                return (
                  <tr key={title}>
                    <td className={styles.metric}>{title}</td>
                    <td>${total.toFixed(2)}</td>
                    <td>{count}</td>
                    <td>${prof.toFixed(2)}</td>
                  </tr>
                )
              })}
              {filteredAppointments.map(a => (
                <tr key={a.id}>
                  <td className={styles.metric}>
                    {a.student?.name || "Unknown Student"} with {a.tutor?.name || "Unknown Tutor"}
                  </td>
                  <td>${a.tutor?.hourlyRate?.toFixed(2) || "0.00"}</td>
                  <td>1</td>
                  <td>${(a.tutor?.hourlyRate ? a.tutor.hourlyRate * 0.8 : 0).toFixed(2)}</td>
                </tr>
              ))}
              <tr className={styles.totalRow}>
                <td>Total</td>
                <td>${(totalExpense + revenue).toFixed(2)}</td>
                <td>{Object.values(expenseCount).reduce((a,b)=>a+b,0) + filteredAppointments.length}</td>
                <td>${profit.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default AdminHome
