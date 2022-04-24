/**
 * Defines file categories to be used both in File Migration and Model
 */

// value
const fileCategories = ['avatar', 'post'] as const

// type
type FileCategory = typeof fileCategories[number]

export { fileCategories, FileCategory }
