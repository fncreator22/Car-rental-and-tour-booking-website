import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-wrap justify-between">
          <div className="w-full md:w-1/4 mb-6 md:mb-0">
            <h3 className="text-lg font-semibold mb-2">Tripura Car Rental & Tours</h3>
            <p className="text-sm">Your trusted partner for exploring Tripura.</p>
          </div>
          <div className="w-full md:w-1/4 mb-6 md:mb-0">
            <h4 className="text-lg font-semibold mb-2">Quick Links</h4>
            <ul className="text-sm">
              <li><Link href="/" className="hover:text-blue-400">Home</Link></li>
              <li><Link href="/car-rental" className="hover:text-blue-400">Car Rental</Link></li>
              <li><Link href="/tour-booking" className="hover:text-blue-400">Tour Booking</Link></li>
              <li><Link href="/contact" className="hover:text-blue-400">Contact</Link></li>
            </ul>
          </div>
          <div className="w-full md:w-1/4 mb-6 md:mb-0">
            <h4 className="text-lg font-semibold mb-2">Contact Us</h4>
            <p className="text-sm">123 Main Street, Agartala, Tripura</p>
            <p className="text-sm">Phone: +91 123 456 7890</p>
            <p className="text-sm">Email: info@tripuracarrental.com</p>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-sm text-center">
          © {new Date().getFullYear()} Tripura Car Rental & Tours. All rights reserved.
        </div>
      </div>
    </footer>
  )
}

