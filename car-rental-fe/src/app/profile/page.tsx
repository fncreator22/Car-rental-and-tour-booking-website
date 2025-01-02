import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/jwt.[backend]'
import { connectToDatabase } from '@/lib/mongodb.[backend]'
import { ObjectId } from 'mongodb'
import ProfileForm from '../components/ProfileForm'

async function getUserProfile(userId: string) {
  const { db } = await connectToDatabase()
  return db.collection('users').findOne({ _id: new ObjectId(userId) })
}

export default async function ProfilePage() {
  const cookieStore = cookies()
  const token = cookieStore.get('token')
  const decodedToken = token ? verifyToken(token.value) : null

  if (!decodedToken) {
    return <div>Please log in to view your profile.</div>
  }

  const user = await getUserProfile(decodedToken.userId)

  if (!user) {
    return <div>User not found.</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Your Profile</h1>
      <ProfileForm user={user} />
    </div>
  )
}

