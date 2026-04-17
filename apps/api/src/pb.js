import PocketBase from 'pocketbase'

const pb = new PocketBase(process.env.POCKETBASE_URL || 'http://127.0.0.1:8090')

// Authenticate as admin if credentials provided (admin API is needed for writes).
// Supports both PocketBase v0.20+ (_superusers) and older versions (admins).
export async function ensureAuth() {
  if (pb.authStore.isValid) return
  const email = process.env.POCKETBASE_EMAIL
  const password = process.env.POCKETBASE_PASSWORD
  if (!email || !password) return
  try {
    // PocketBase v0.22+ uses _superusers collection
    await pb.collection('_superusers').authWithPassword(email, password)
  } catch (_) {
    try {
      // Fallback for older PocketBase versions
      await pb.admins.authWithPassword(email, password)
    } catch (e) {
      console.warn('[PocketBase] Admin auth failed:', e.message)
    }
  }
}

export default pb
