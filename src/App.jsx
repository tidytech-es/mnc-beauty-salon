import Header from './components/Header.jsx'
import Hero from './components/Hero.jsx'
import Services from './components/Services.jsx'
import HairSpa from './components/HairSpa.jsx'
import Team from './components/Team.jsx'
import Gallery from './components/Gallery.jsx'
import Reviews from './components/Reviews.jsx'
import Contact from './components/Contact.jsx'
import Footer from './components/Footer.jsx'
import MobileBookingBar from './components/MobileBookingBar.jsx'
import Booking from './components/Booking.jsx'
import { bookingEnabled } from './lib/booking-events.js'

export default function App() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Services />
        <HairSpa />
        <Team />
        <Reviews />
        <Gallery />
        <Contact />
      </main>
      <Footer />
      <MobileBookingBar />
      {bookingEnabled && <Booking />}
    </>
  )
}
