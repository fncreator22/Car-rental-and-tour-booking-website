'use client'

import { useState, useEffect } from 'react'

interface Notification {
  id: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
}

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch('/api/notifications')
        if (response.ok) {
          const data = await response.json()
          setNotifications(data.notifications)
        }
      } catch (error) {
        console.error('Error fetching notifications:', error)
      }
    }

    fetchNotifications()
    const interval = setInterval(fetchNotifications, 60000) // Fetch every minute

    return () => clearInterval(interval)
  }, [])

  const removeNotification = (id: string) => {
    setNotifications(notifications.filter(notif => notif.id !== id))
  }

  if (notifications.length === 0) {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`mb-2 p-4 rounded-lg shadow-md ${
            notification.type === 'info' ? 'bg-blue-100 text-blue-800' :
            notification.type === 'success' ? 'bg-green-100 text-green-800' :
            notification.type === 'warning' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}
        >
          <p>{notification.message}</p>
          <button
            onClick={() => removeNotification(notification.id)}
            className="mt-2 text-sm font-semibold hover:underline"
          >
            Dismiss
          </button>
        </div>
      ))}
    </div>
  )
}

