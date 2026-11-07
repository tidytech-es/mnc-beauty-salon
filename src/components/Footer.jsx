import { navLinks, site } from '../data/site.js'
import { Logo } from './Header.jsx'

// Lucide ya no incluye logos de marca: SVG inline mínimos.
const Instagram = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden {...p}>
    <rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" />
  </svg>
)
const Facebook = (p) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...p}>
    <path d="M13.5 21v-7.5h2.5l.4-3h-2.9V8.6c0-.87.25-1.46 1.5-1.46h1.6V4.46A21 21 0 0 0 14.27 4.3c-2.3 0-3.87 1.4-3.87 3.98v2.22H7.8v3h2.6V21h3.1z" />
  </svg>
)

export default function Footer() {
  const socials = [
    { href: site.links.instagram, label: 'Instagram', Icon: Instagram },
    { href: site.links.facebook, label: 'Facebook', Icon: Facebook },
  ].filter((s) => s.href)
  return (
    <footer className="bg-espresso pb-28 pt-16 text-cream/70 sm:pb-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="max-w-xs">
            <Logo light />
            <p className="mt-5 text-sm leading-relaxed">
              {site.altName} · Peluquería y Renova Hair Spa. {site.address.street}, {site.address.city}.
            </p>
          </div>

          <nav aria-label="Pie de página">
            <ul className="grid grid-cols-2 gap-x-10 text-sm">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="inline-flex min-h-11 items-center hover:text-cream">{l.label}</a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex gap-3">
            {socials.map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="grid size-11 place-items-center rounded-full border border-cream/20 transition-colors hover:border-gold-light hover:text-gold-light"
              >
                <Icon className="size-5" />
              </a>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-cream/10 pt-6 text-[0.8rem] sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} {site.name} · {site.altName}. Todos los derechos reservados.</p>
          <p className="text-cream/70">Sant Celoni, Barcelona</p>
        </div>
      </div>
    </footer>
  )
}
