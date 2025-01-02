'use client'

import { useState } from 'react'

interface DateTimePickerProps {
  label: string
  name: string
  required?: boolean
}

export default function DateTimePicker({ label, name, required = false }: DateTimePickerProps) {
  const [value, setValue] = useState('')

  return (
    <div className="mb-4">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        type="datetime-local"
        id={name}
        name={name}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        required={required}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
      />
    </div>
  )
}

