import { useCallback } from 'react'
import { id } from '@instantdb/react'
import db from '../lib/db'
import { useAuth } from '../context/AuthContext'
import { calculateGPA, getGPAColor, getGPALabel } from '../utils/gradeScale'

export default function useGPA() {
  const { user } = useAuth()

  const { isLoading, error, data } = db.useQuery(
    user
      ? {
          semesters: {
            $: {
              where: { userId: user.id },
            },
            subjects: {},
          },
        }
      : null
  )

  const semesters = data?.semesters || []

  const recalcSemesterGPA = useCallback(async (semesterId) => {
    const result = await db.queryOnce({
      subjects: {
        $: {
          where: { 'semester.id': semesterId },
        },
      },
    })
    const subjects = result.data?.subjects || []
    const totalCredits = subjects.reduce((sum, s) => sum + (s.credits || 0), 0)
    const totalQualityPoints = subjects.reduce((sum, s) => sum + (s.qualityPoint || 0), 0)
    const semesterGPA = totalCredits > 0 ? totalQualityPoints / totalCredits : 0
    db.transact(
      db.tx.semesters[semesterId].update({
        semesterGPA: Math.round(semesterGPA * 100) / 100,
        totalCredits,
      })
    )
  }, [])

  const addSemester = useCallback(
    (semester) => {
      if (!user) return
      const semesterId = id()
      db.transact(
        db.tx.semesters[semesterId]
          .update({
            name: semester.name,
            type: semester.type,
            year: semester.year,
            semesterGPA: 0,
            totalCredits: 0,
            userId: user.id,
            createdAt: Date.now(),
          })
          .link({ $user: user.id })
      )
      return semesterId
    },
    [user]
  )

  const updateSemester = useCallback((semesterId, updates) => {
    db.transact(db.tx.semesters[semesterId].update(updates))
  }, [])

  const deleteSemester = useCallback((semesterId) => {
    db.transact(db.tx.semesters[semesterId].delete())
  }, [])

  const addSubject = useCallback(
    (semesterId, subject) => {
      const gradePoint = GRADE_MAP[subject.grade] || 0
      const qualityPoint = gradePoint * (subject.credits || 0)
      const subjectId = id()
      db.transact(
        db.tx.subjects[subjectId]
          .update({
            name: subject.name,
            credits: subject.credits,
            grade: subject.grade,
            gradePoint: GRADE_MAP[subject.grade] || 0,
            qualityPoint,
            userId: user?.id || '',
            createdAt: Date.now(),
          })
          .link({ semester: semesterId })
      )
      setTimeout(() => recalcSemesterGPA(semesterId), 500)
      return subjectId
    },
    [recalcSemesterGPA, user]
  )

  const updateSubject = useCallback(
    (semesterId, subjectId, updates) => {
      const gradePoint = updates.grade ? GRADE_MAP[updates.grade] || 0 : updates.gradePoint || 0
      const credits = updates.credits || 0
      const qualityPoint = gradePoint * credits
      db.transact(
        db.tx.subjects[subjectId].update({
          ...updates,
          gradePoint,
          qualityPoint,
        })
      )
      setTimeout(() => recalcSemesterGPA(semesterId), 500)
    },
    [recalcSemesterGPA]
  )

  const deleteSubject = useCallback(
    (semesterId, subjectId) => {
      db.transact(db.tx.subjects[subjectId].delete())
      setTimeout(() => recalcSemesterGPA(semesterId), 500)
    },
    [recalcSemesterGPA]
  )

  const getSemester = useCallback(
    (id) => {
      return semesters.find((s) => s.id === String(id))
    },
    [semesters]
  )

  const getSemesterGPA = useCallback(
    (semesterId) => {
      const semester = semesters.find((s) => s.id === String(semesterId))
      return semester?.semesterGPA || 0
    },
    [semesters]
  )

  const getOverallGPA = useCallback(() => {
    if (!semesters.length) return 0
    const allSubjects = semesters.flatMap((s) => s.subjects || [])
    return calculateGPA(allSubjects)
  }, [semesters])

  return {
    semesters,
    isLoading,
    error,
    addSemester,
    updateSemester,
    deleteSemester,
    addSubject,
    updateSubject,
    deleteSubject,
    getSemester,
    getSemesterGPA,
    getOverallGPA,
    getGPAColor,
    getGPALabel,
  }
}

const GRADE_MAP = {
  'A': 4.00,
  'A-': 3.67,
  'B+': 3.33,
  'B': 3.00,
  'B-': 2.67,
  'C+': 2.33,
  'C': 2.00,
  'C-': 1.67,
  'D+': 1.33,
  'D': 1.00,
  'F': 0.00,
}
