'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface CancelBookingButtonProps {
  bookingId: string
}

export default function CancelBookingButton({ bookingId }: CancelBookingButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleCancel = async () => {
    if (confirm('Are you sure you want to cancel this booking?')) {
      setIsLoading(true)
      try {
        const response = await fetch('/api/bookings/cancel', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ bookingId }),
        })

        if (response.ok) {
          router.refresh()
        } else {
          const data = await response.json()
          alert(data.error || 'Failed to cancel booking')
        }
      } catch (error) {
        alert('An error occurred. Please try again.')
      }
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={handleCancel}
      disabled={isLoading}
      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-300 disabled:opacity-50"
    >
      {isLoading ? 'Cancelling...' : 'Cancel Booking'}
    </button>
  )
}

