import crypto from 'crypto'

export type PayFastMode = 'sandbox' | 'live'

export type PayFastConfig = {
  mode: PayFastMode
  merchantId: string
  merchantKey: string
  passphrase?: string
}

export function getPayFastConfig(): PayFastConfig {
  const merchantId = process.env.PAYFAST_MERCHANT_ID
  const merchantKey = process.env.PAYFAST_MERCHANT_KEY
  const passphrase = process.env.PAYFAST_PASSPHRASE

  const modeEnv = (process.env.PAYFAST_MODE ?? 'sandbox').toLowerCase()
  const mode: PayFastMode = modeEnv === 'live' ? 'live' : 'sandbox'

  if (!merchantId || !merchantKey) {
    throw new Error('Missing PAYFAST_MERCHANT_ID or PAYFAST_MERCHANT_KEY env vars.')
  }

  return { mode, merchantId, merchantKey, passphrase: passphrase || undefined }
}

export function payFastActionUrl(mode: PayFastMode) {
  return mode === 'live'
    ? 'https://www.payfast.co.za/eng/process'
    : 'https://sandbox.payfast.co.za/eng/process'
}

export function payFastValidateUrl(mode: PayFastMode) {
  return mode === 'live'
    ? 'https://www.payfast.co.za/eng/query/validate'
    : 'https://sandbox.payfast.co.za/eng/query/validate'
}

function encodeValue(v: string) {
  // PayFast expects spaces as + in signature string
  return encodeURIComponent(v).replace(/%20/g, '+')
}

export function toQueryString(data: Record<string, string>) {
  const entries = Object.entries(data).filter(([, v]) => v !== '')
  entries.sort(([a], [b]) => a.localeCompare(b))
  return entries.map(([k, v]) => `${k}=${encodeValue(v)}`).join('&')
}

export function sign(data: Record<string, string>, passphrase?: string) {
  const qs = toQueryString(data)
  const signingString = passphrase ? `${qs}&passphrase=${encodeValue(passphrase)}` : qs
  return crypto.createHash('md5').update(signingString).digest('hex')
}

export function verifySignature(
  data: Record<string, string>,
  signature: string,
  passphrase?: string,
) {
  const cloned = { ...data }
  delete cloned.signature
  const expected = sign(cloned, passphrase)
  return expected === signature
}

