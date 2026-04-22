'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, MapPin, Clock, Send, Instagram, Twitter } from 'lucide-react'

export default function ContactPage() {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsSubmitting(false)
    setSubmitted(true)
    setFormState({ name: '', email: '', subject: '', message: '' })
  }

  return (
    <div className="min-h-screen bg-background pt-20">
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-6xl font-light tracking-tight text-foreground">
              Contact
            </h1>
            <p className="mt-4 text-muted-foreground max-w-md mx-auto">
              Get in touch with us for inquiries, collaborations, or support
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="text-2xl font-light text-foreground mb-8">
                Send us a message
              </h2>

              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-8 border border-border bg-card"
                >
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    Thank you for reaching out
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    We have received your message and will get back to you within 24-48 hours.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-6 text-sm text-foreground underline underline-offset-4 hover:text-muted-foreground transition-colors"
                  >
                    Send another message
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-xs tracking-widest uppercase text-muted-foreground mb-2"
                      >
                        Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        required
                        value={formState.name}
                        onChange={(e) =>
                          setFormState({ ...formState, name: e.target.value })
                        }
                        className="w-full px-4 py-3 bg-input border border-border text-foreground text-sm focus:outline-none focus:border-foreground transition-colors"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-xs tracking-widest uppercase text-muted-foreground mb-2"
                      >
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        required
                        value={formState.email}
                        onChange={(e) =>
                          setFormState({ ...formState, email: e.target.value })
                        }
                        className="w-full px-4 py-3 bg-input border border-border text-foreground text-sm focus:outline-none focus:border-foreground transition-colors"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="subject"
                      className="block text-xs tracking-widest uppercase text-muted-foreground mb-2"
                    >
                      Subject
                    </label>
                    <input
                      type="text"
                      id="subject"
                      required
                      value={formState.subject}
                      onChange={(e) =>
                        setFormState({ ...formState, subject: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-input border border-border text-foreground text-sm focus:outline-none focus:border-foreground transition-colors"
                      placeholder="How can we help?"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-xs tracking-widest uppercase text-muted-foreground mb-2"
                    >
                      Message
                    </label>
                    <textarea
                      id="message"
                      required
                      rows={6}
                      value={formState.message}
                      onChange={(e) =>
                        setFormState({ ...formState, message: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-input border border-border text-foreground text-sm focus:outline-none focus:border-foreground transition-colors resize-none"
                      placeholder="Tell us more..."
                    />
                  </div>

                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className="w-full py-4 bg-foreground text-background text-sm tracking-widest uppercase font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-5 h-5 border-2 border-background border-t-transparent rounded-full"
                      />
                    ) : (
                      <>
                        Send Message
                        <Send className="h-4 w-4" />
                      </>
                    )}
                  </motion.button>
                </form>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="space-y-12"
            >
              <div>
                <h2 className="text-2xl font-light text-foreground mb-8">
                  Get in touch
                </h2>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 border border-border">
                      <Mail className="h-5 w-5 text-foreground" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-foreground mb-1">
                        Email
                      </h3>
                      <a
                        href="mailto:hello@scent.com"
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        hello@scent.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-3 border border-border">
                      <MapPin className="h-5 w-5 text-foreground" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-foreground mb-1">
                        Location
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Los Angeles, California
                        <br />
                        United States
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-3 border border-border">
                      <Clock className="h-5 w-5 text-foreground" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-foreground mb-1">
                        Hours
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Mon - Fri: 9AM - 6PM PST
                        <br />
                        Sat - Sun: Closed
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xs tracking-widest uppercase text-muted-foreground mb-4">
                  Follow Us
                </h3>
                <div className="flex gap-3">
                  <motion.a
                    href="#"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-3 border border-border hover:border-foreground transition-colors"
                    aria-label="Instagram"
                  >
                    <Instagram className="h-5 w-5 text-foreground" />
                  </motion.a>
                  <motion.a
                    href="#"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-3 border border-border hover:border-foreground transition-colors"
                    aria-label="Twitter"
                  >
                    <Twitter className="h-5 w-5 text-foreground" />
                  </motion.a>
                </div>
              </div>

              <div className="p-8 bg-card border border-border">
                <h3 className="text-sm font-medium text-foreground mb-2">
                  Wholesale Inquiries
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Interested in stocking SCENT? Reach out to discuss wholesale opportunities.
                </p>
                <a
                  href="mailto:wholesale@scent.com"
                  className="text-sm text-foreground underline underline-offset-4 hover:text-muted-foreground transition-colors"
                >
                  wholesale@scent.com
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}
