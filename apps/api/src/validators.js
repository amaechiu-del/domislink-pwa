/**
 * Lesson schema validators — self-contained copy for API deployment.
 * Source of truth is /lib/index.js; keep both in sync if modifying fields.
 */

export const LESSON_FIELDS = ['title', 'class', 'subject', 'topic', 'content', 'quiz']
export const OPTIONAL_LESSON_FIELDS = ['subtopic', 'content_multilingual']

/**
 * Validate a lesson object has all required fields.
 * Returns { valid: boolean, missing: string[] }
 */
export function validateLesson(lesson) {
  const missing = LESSON_FIELDS.filter((f) => lesson[f] == null)
  return { valid: missing.length === 0, missing }
}

/**
 * Strip any fields not in the allowed lesson schema.
 * Prevents 400 errors from PocketBase.
 */
export function sanitizeLesson(lesson) {
  const allowed = new Set([...LESSON_FIELDS, ...OPTIONAL_LESSON_FIELDS])
  return Object.fromEntries(Object.entries(lesson).filter(([k]) => allowed.has(k)))
}
