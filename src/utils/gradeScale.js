export const GRADE_SCALE = {
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

export const GRADE_OPTIONS = Object.keys(GRADE_SCALE)

export function calculateGPA(subjects = []) {
  if (!subjects.length) return 0
  const totalPoints = subjects.reduce((sum, subject) => {
    const gradePoint = GRADE_SCALE[subject.grade] ?? 0
    return sum + gradePoint * (subject.credits || 0)
  }, 0)
  const totalCredits = subjects.reduce((sum, subject) => sum + (subject.credits || 0), 0)
  if (totalCredits === 0) return 0
  return totalPoints / totalCredits
}

export function getGPAColor(gpa) {
  if (gpa >= 3.5) return 'text-accent'
  if (gpa >= 2.5) return 'text-primary'
  if (gpa >= 2.0) return 'text-yellow-400'
  return 'text-red-400'
}

export function getQualityPoint(grade, credits) {
  const gradePoint = GRADE_SCALE[grade] ?? 0
  return gradePoint * (credits || 0)
}

export function getGPALabel(gpa) {
  if (gpa >= 3.5) return 'Excellent'
  if (gpa >= 3.0) return 'Good'
  if (gpa >= 2.5) return 'Above Average'
  if (gpa >= 2.0) return 'Satisfactory'
  if (gpa >= 1.0) return 'Below Average'
  return 'Failing'
}
