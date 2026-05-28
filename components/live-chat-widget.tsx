'use client'

import { useMemo, useState } from 'react'
import { usePathname } from 'next/navigation'
import { Mail, MessageCircle, Send, X } from 'lucide-react'

const contactEmail = 'scentclobrand@gmail.com'
const whatsappNumber = '27659980114'
const defaultMessage = 'Hi SCENT, I need help with an order.'

function shouldHideOnRoute(pathname: string) {
  return pathname === '/admin' || pathname.startsWith('/admin/')
}

export function LiveChatWidget() {
  const pathname = usePathname() ?? ''
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState(defaultMessage)

  const encodedMessage = useMemo(() => encodeURIComponent(message.trim() || defaultMessage), [message])
  const whatsappHref = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`
  const emailHref = `mailto:${contactEmail}?subject=${encodeURIComponent(
    'SCENT live chat enquiry',
  )}&body=${encodedMessage}`

  if (shouldHideOnRoute(pathname)) return null

  return (
    <div className="fixed bottom-36 right-4 z-[65] flex flex-col items-end gap-3 sm:bottom-40 md:bottom-28 md:right-8">
      {open && (
        <div
          className="w-[calc(100vw-2rem)] max-w-sm border border-white/15 bg-background/95 p-4 text-foreground shadow-[0_24px_80px_rgba(0,0,0,0.55)] backdrop-blur-xl"
          role="dialog"
          aria-label="Live chat contact options"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.32em] text-muted-foreground">Live chat</p>
              <h2 className="mt-2 text-lg font-light uppercase tracking-wide">Talk to SCENT</h2>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-full border border-white/15 p-2 text-muted-foreground transition-colors hover:border-white/40 hover:text-foreground"
              aria-label="Close live chat"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Send us a quick message on WhatsApp or email. WhatsApp is usually the fastest route.
          </p>

          <label htmlFor="live-chat-message" className="mt-4 block text-xs uppercase tracking-[0.22em] text-white/55">
            Message
          </label>
          <textarea
            id="live-chat-message"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            rows={4}
            className="mt-2 w-full resize-none border border-white/15 bg-black/30 p-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-white/45"
          />

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <a
              href={whatsappHref}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 border border-foreground bg-foreground px-4 py-3 text-xs font-medium uppercase tracking-[0.2em] text-background transition-opacity hover:opacity-90"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp
            </a>
            <a
              href={emailHref}
              className="inline-flex items-center justify-center gap-2 border border-white/20 px-4 py-3 text-xs font-medium uppercase tracking-[0.2em] text-foreground transition-colors hover:border-white/50"
            >
              <Mail className="h-4 w-4" />
              Email
            </a>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-foreground px-4 py-3 text-xs font-medium uppercase tracking-[0.18em] text-background shadow-[0_18px_50px_rgba(0,0,0,0.45)] transition-transform hover:scale-[1.02]"
        aria-expanded={open}
        aria-label={open ? 'Close live chat' : 'Open live chat'}
      >
        {open ? <X className="h-4 w-4" /> : <Send className="h-4 w-4" />}
        Chat
      </button>
    </div>
  )
}
