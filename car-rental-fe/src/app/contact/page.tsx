'use client'

import { useState } from 'react'
import ContactForm from '../components/ContactForm'

export default function Contact() {
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (formData: FormData) => {
    // Here you would typically send the form data to your backend
    // For this example, we'll just simulate a successful submission
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsSubmitted(true)
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold mb-6">Contact Us</h1>
      {isSubmitted ? (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          Thank you for your message. We'll get back to you soon!
        </div>
      ) : (
        <ContactForm onSubmit={handleSubmit} />
      )}
    </div>
  )
}

