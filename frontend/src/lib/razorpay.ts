/**
 * Razorpay's payment window ("Standard Checkout") is a script on Razorpay's own site. It's
 * downloaded only when someone actually pays, so it never slows down the rest of the shop.
 */
const CHECKOUT_SCRIPT = 'https://checkout.razorpay.com/v1/checkout.js'

/** The signed receipt the window hands over after a successful payment (checked by our server). */
export interface RazorpayReceipt {
  razorpay_payment_id: string
  razorpay_order_id: string
  razorpay_signature: string
}

export interface RazorpayFailure {
  error: { code: string; description: string; reason?: string }
}

export interface RazorpayOptions {
  key: string // the public key id
  amount: number // in paise
  currency: string
  name: string
  description?: string
  order_id: string // the Razorpay order our server opened
  prefill?: { name?: string; email?: string; contact?: string }
  theme?: { color?: string }
  handler: (receipt: RazorpayReceipt) => void // called after a successful payment
  modal?: { ondismiss?: () => void } // called when the customer closes the window without paying
}

export interface RazorpayCheckout {
  open: () => void
  on: (event: 'payment.failed', callback: (response: RazorpayFailure) => void) => void
}

export type RazorpayConstructor = new (options: RazorpayOptions) => RazorpayCheckout

// The script adds a global "Razorpay" to the page. This tells TypeScript it may exist.
declare global {
  interface Window {
    Razorpay?: RazorpayConstructor
  }
}

let loading: Promise<RazorpayConstructor> | null = null

/** Load the payment window's script (only the first time) and give back its Razorpay class. */
export function loadRazorpay(): Promise<RazorpayConstructor> {
  if (window.Razorpay) return Promise.resolve(window.Razorpay)

  // Several clicks while it's still downloading share the same download.
  loading ??= new Promise<RazorpayConstructor>((resolve, reject) => {
    const script = document.createElement('script')
    script.src = CHECKOUT_SCRIPT
    script.async = true
    script.onload = () => {
      if (window.Razorpay) resolve(window.Razorpay)
      else fail()
    }
    script.onerror = fail
    document.body.appendChild(script)

    function fail() {
      script.remove()
      loading = null // allow a fresh try on the next click
      reject(new Error("Couldn't open the payment window. Check your internet connection and try again."))
    }
  })
  return loading
}
