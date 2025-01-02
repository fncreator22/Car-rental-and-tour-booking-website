'use client'

import { useState } from 'react'
import DateTimePicker from './DateTimePicker'

interface CarWithDriverBookingFormProps {
  carId: string
  carName: string
  pricePerDay: number
}

export default function CarWithDriverBookingForm({ carId, carName, pricePerDay }: CarWithDriverBookingFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [totalPrice, setTotalPrice] = useState(0)

  const calculateTotalPrice = (startDate: string, endDate: string) => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24))
    return days * pricePerDay
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)
    const bookingData = Object.fromEntries(formData.entries())

    try {
      const response = await fetch('/api/bookings/car-with-driver', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...bookingData, carId, totalPrice }),
      })

      if (response.ok) {
        // Handle successful booking (e.g., show confirmation, redirect)
        console.log('Booking successful')
      } else {
        // Handle errors
        console.error('Booking failed')
      }
    } catch (error) {
      console.error('Error submitting booking:', error)
    }

    setIsSubmitting(false)
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Book {carName} with Driver</h2>
      <input type="hidden" name="carId" value={carId} />
      <DateTimePicker label="Start Date and Time" name="startDateTime" required />
      <DateTimePicker label="End Date and Time" name="endDateTime" required />
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
      </div>
      <div className="mb-4">
        <label htmlFor="pickupLocation" className="block text-sm font-medium text-gray-700 mb-1">
          Pickup Location
        </label>
        <input
          type="text"
          id="pickupLocation"
          name="pickupLocation"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="dropoffLocation" className="block text-sm font-medium text-gray-700 mb-1">
          Drop-off Location
        </label>
        <input
          type="text"
          id="dropoffLocation"
          name="dropoffLocation"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      <div className="mb-4">
        <p className="text-lg font-semibold">Total Price: ₹{totalPrice}</p>
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 disabled:opacity-50"
      >
        {isSubmitting ? 'Booking...' : 'Book Now'}
      </button>
    </form>
  )
}

