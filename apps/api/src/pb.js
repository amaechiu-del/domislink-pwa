import PocketBase from 'pocketbase'

const pb = new PocketBase(process.env.POCKETBASE_URL || 'http://127.0.0.1:8090')

// Authenticate as admin if credentials provided (admin API is needed for writes)
export async function ensureAuth() {
  if (pb.authStore.isValid) return
  const email = process.env.POCKETBASE_EMAIL
  const password = process.env.POCKETBASE_PASSWORD
  if (email && password) {
    try {
      await pb.admins.authWithPassword(email, password)
    } catch (e) {
      console.warn('[PocketBase] Admin auth failed:', e.message)
    }
  }
}

export default pb
