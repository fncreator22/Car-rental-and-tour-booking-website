'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import DateTimePicker from './DateTimePicker'
import { loadStripe } from '@stripe/stripe-js'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface SelfDriveBookingFormProps {
  carId: string
  carName: string
  pricePerDay: number
}

export default function SelfDriveBookingForm({ carId, carName, pricePerDay }: SelfDriveBookingFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [totalPrice, setTotalPrice] = useState(0)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const router = useRouter()

  const calculateTotalPrice = (startDate: string, endDate: string) => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24))
    return days * pricePerDay
  }

  const validateForm = (formData: FormData) => {
    const newErrors: { [key: string]: string } = {}

    if (!formData.get('startDateTime')) {
      newErrors.startDateTime = 'Start date and time is required'
    }
    if (!formData.get('endDateTime')) {
      newErrors.endDateTime = 'End date and time is required'
    }
    if (!formData.get('fullName')) {
      newErrors.fullName = 'Full name is required'
    }
    if (!formData.get('email')) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.get('email') as string)) {
      newErrors.email = 'Invalid email format'
    }
    if (!formData.get('phone')) {
      newErrors.phone = 'Phone number is required'
    }
    if (!formData.get('drivingLicense')) {
      newErrors.drivingLicense = 'Driving license is required'
    }
    if (!formData.get('aadhaarCard')) {
      newErrors.aadhaarCard = 'Aadhaar card is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)
    
    if (!validateForm(formData)) {
      setIsSubmitting(false)
      return
    }

    const bookingData = Object.fromEntries(formData.entries())

    try {
      const response = await fetch('/api/bookings/self-drive', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...bookingData, carId, totalPrice }),
      })

      if (response.ok) {
        const { bookingId } = await response.json()
        
        // Initiate payment
        const paymentResponse = await fetch('/api/payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ amount: totalPrice, bookingId }),
        })

        if (paymentResponse.ok) {
          const { sessionId } = await paymentResponse.json()
          const stripe = await stripePromise
          if (stripe) {
            const result = await stripe.redirectToCheckout({ sessionId })
            if (result.error) {
              console.error(result.error)
            }
          }
        } else {
          console.error('Payment initiation failed')
        }
      } else {
        console.error('Booking failed')
      }
    } catch (error) {
      console.error('Error submitting booking:', error)
    }

    setIsSubmitting(false)
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Book {carName}</h2>
      <input type="hidden" name="carId" value={carId} />
      <DateTimePicker label="Start Date and Time" name="startDateTime" required />
      {errors.startDateTime && <p className="text-red-500 text-sm mt-1">{errors.startDateTime}</p>}
      <DateTimePicker label="End Date and Time" name="endDateTime" required />
      {errors.endDateTime && <p className="text-red-500 text-sm mt-1">{errors.endDateTime}</p>}
      <div className="mb-4">
        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
          Full Name
        </label>
        <input
          type="text"
          id="fullName"
          name="fullName"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
        {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
      </div>
      <div className="mb-4">
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
      </div>
      <div className="mb-4">
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
          Phone Number
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
        {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
      </div>
      <div className="mb-4">
        <label htmlFor="drivingLicense" className="block text-sm font-medium text-gray-700 mb-1">
          Driving License
        </label>
        <input
          type="file"
          id="drivingLicense"
          name="drivingLicense"
          required
          accept="image/*,.pdf"
          className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
        />
        {errors.drivingLicense && <p className="text-red-500 text-sm mt-1">{errors.drivingLicense}</p>}
      </div>
      <div className="mb-4">
        <label htmlFor="aadhaarCard" className="block text-sm font-medium text-gray-700 mb-1">
          Aadhaar Card
        </label>
        <input
          type="file"
          id="aadhaarCard"
          name="aadhaarCard"
          required
          accept="image/*,.pdf"
          className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
        />
        {errors.aadhaarCard && <p className="text-red-500 text-sm mt-1">{errors.aadhaarCard}</p>}
      </div>
      <div className="mb-4">
        <p className="text-lg font-semibold">Total Price: ₹{totalPrice}</p>
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 disabled:opacity-50"
      >
        {isSubmitting ? 'Processing...' : 'Book and Pay Now'}
      </button>
    </form>
  )
}

