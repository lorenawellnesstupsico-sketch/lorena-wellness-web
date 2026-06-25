function InstagramIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.7" fill="currentColor" stroke="none" />
    </svg>
  );
}

function WhatsappIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20 11.5a8.5 8.5 0 1 1-15.9 4.2L3 21l5.5-1.1A8.5 8.5 0 1 1 20 11.5Z" />
      <path d="M9.5 8.8c.2-.5.5-.5.7-.5h.6c.2 0 .4 0 .6.5l.5 1.4c.1.3.1.5-.1.8l-.4.5c-.1.2-.2.3-.1.5.2.4.6 1 1.2 1.5.8.7 1.5 1 1.9 1.2.2.1.4 0 .5-.1l.5-.6c.2-.2.5-.3.8-.2l1.3.6c.4.2.5.4.4.7l-.2.8c-.1.3-.3.5-.6.7-.4.2-.9.3-1.5.2-.8-.2-1.8-.6-3-1.6-1-.8-1.8-1.8-2.4-2.8-.6-1-.8-1.9-.8-2.6 0-.4.1-.8.4-1.1.2-.2.4-.4.5-.7Z" />
    </svg>
  );
}

function YouTubeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M22 12s0-3.2-.4-4.7a2.4 2.4 0 0 0-1.7-1.7C18.4 5.2 12 5.2 12 5.2s-6.4 0-7.9.4A2.4 2.4 0 0 0 2.4 7.3 20 20 0 0 0 2 12s0 3.2.4 4.7a2.4 2.4 0 0 0 1.7 1.7c1.5.4 7.9.4 7.9.4s6.4 0 7.9-.4a2.4 2.4 0 0 0 1.7-1.7c.4-1.5.4-4.7.4-4.7Z" />
      <path d="m10 15 5-3-5-3v6Z" fill="currentColor" stroke="none" />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M14.5 3c.3 1.8 1.4 3.3 3 4.1 1 .5 2 .8 3 .8v3.1c-1.5 0-3-.4-4.3-1.1v6.1c0 3.5-2.8 6.2-6.3 6.2S3.6 19.5 3.6 16 6.4 9.8 9.9 9.8c.4 0 .8 0 1.2.1v3.2c-.4-.1-.8-.2-1.2-.2-1.7 0-3.1 1.4-3.1 3.1s1.4 3.1 3.1 3.1 3.2-1.3 3.2-3.3V3h1.4Z" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-[#E8DCCF] bg-[#F7F0E8]">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-8 md:flex-row md:items-center md:justify-between md:px-10">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#8C5A3C]">
            Lorena Wellness TuPsico
          </p>
          <p className="mt-2 text-sm leading-7 text-[#6E5648]">
            Psicología online con una experiencia de acompañamiento más clara,
            cercana y organizada.
          </p>
        </div>

        <div className="flex flex-col items-start gap-4 md:items-end">
          <div className="flex items-center gap-3">
            <a
              href="https://www.instagram.com/lorena.wellness?igsh=MXNwaDcwcjBzZjFpbA%3D%3D&utm_source=qr"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-[#D9C9BA] bg-white text-[#8C5A3C] transition hover:bg-[#F3E7DA]"
              aria-label="Instagram de Lorena Wellness TuPsico"
            >
              <InstagramIcon />
            </a>

            <a
              href="https://wa.me/573229301341?text=%C2%A1Hola!%20Quiero%20empezar%20mi%20proceso%20con%20Lorena%20Wellness%20TuPsico%E2%9C%A8%F0%9F%A4%8D"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-[#D9C9BA] bg-white text-[#8C5A3C] transition hover:bg-[#F3E7DA]"
              aria-label="WhatsApp de Lorena Wellness TuPsico"
            >
              <WhatsappIcon />
            </a>

            <a
              href="https://youtube.com/@lorena.wellnesstupsico?si=aNI55MMPJwfNxFoR"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-[#D9C9BA] bg-white text-[#8C5A3C] transition hover:bg-[#F3E7DA]"
              aria-label="YouTube de Lorena Wellness TuPsico"
            >
              <YouTubeIcon />
            </a>

            <a
              href="https://www.tiktok.com/@lorenawellness?_r=1&_t=ZS-97VyYAFJmVs"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-[#D9C9BA] bg-white text-[#8C5A3C] transition hover:bg-[#F3E7DA]"
              aria-label="TikTok de Lorena Wellness TuPsico"
            >
              <TikTokIcon />
            </a>
          </div>

          <p className="text-sm text-[#6E5648]">
            © {new Date().getFullYear()} Lorena Wellness TuPsico. Todos los
            derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}