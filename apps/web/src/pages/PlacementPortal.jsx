import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import supabase from '../supabase/supabaseClient'
import { CheckCircle2, Lock, FolderOpen } from 'lucide-react'

export default function PlacementPortal() {
  const { currentUser, userRole } = useAuth()
  const [hasPurchased, setHasPurchased] = useState(false)
  const [loading, setLoading] = useState(true)
  const [materials, setMaterials] = useState([])
  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    checkPurchaseStatus()
  }, [currentUser])

  async function checkPurchaseStatus() {
    try {
      if (!currentUser) return
      
      const { data, error } = await supabase
        .from('user_purchases')
        .select('*')
        .eq('user_id', currentUser.id)
        .eq('status', 'successful')
        .single()

      if (data) {
        setHasPurchased(true)
        fetchMaterials()
      }
    } catch (error) {
      console.error('Error checking purchase:', error)
    } finally {
      setLoading(false)
    }
  }

  async function fetchMaterials() {
    try {
      const { data, error } = await supabase
        .from('placement_materials')
        .select('*')
        .order('company_name')

      if (data) {
        setMaterials(data)
      }
    } catch (error) {
      console.error('Error fetching materials:', error)
    }
  }

  async function handlePayment() {
    try {
      setProcessing(true)
      
      // 1. Create Order via Edge Function
      const { data: orderData, error: orderError } = await supabase.functions.invoke('create-razorpay-order', {
        method: 'POST'
      })

      if (orderError) throw new Error('Failed to create order')

      // 2. Load Razorpay script if not loaded
      if (!window.Razorpay) {
        await new Promise((resolve) => {
          const script = document.createElement('script')
          script.src = 'https://checkout.razorpay.com/v1/checkout.js'
          script.onload = resolve
          document.body.appendChild(script)
        })
      }

      // 3. Initialize Razorpay Checkout
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_mockkey', // In real life, fetch from env
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'EcoQuest Placement Prep',
        description: 'Unlock all placement materials',
        order_id: orderData.id,
        handler: async function (response) {
          // 4. Verify Payment via Edge Function
          const { data: verifyData, error: verifyError } = await supabase.functions.invoke('verify-razorpay-payment', {
            method: 'POST',
            body: {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            }
          })

          if (verifyData?.success) {
            setHasPurchased(true)
            fetchMaterials()
          } else {
            alert('Payment verification failed. Please contact support.')
          }
        },
        prefill: {
          email: currentUser?.email || '',
        },
        theme: {
          color: '#16a34a' // Tailwind green-600
        }
      }

      const rzp = new window.Razorpay(options)
      rzp.on('payment.failed', function (response){
        alert('Payment failed: ' + response.error.description)
      })
      rzp.open()

    } catch (error) {
      console.error(error)
      alert('Error initiating payment. Please try again.')
    } finally {
      setProcessing(false)
    }
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600" /></div>
  }

  if (!hasPurchased) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Placement Preparation Portal</h2>
          <p className="mt-4 text-lg text-slate-600">Get access to premium placement materials for top tech companies. One time payment, lifetime access.</p>
        </div>
        
        <div className="mx-auto mt-16 max-w-lg rounded-3xl ring-1 ring-slate-200 lg:mx-0 lg:flex lg:max-w-none lg:bg-white lg:ring-slate-200 lg:ring-inset">
          <div className="p-8 sm:p-10 lg:flex-auto">
            <h3 className="text-2xl font-bold tracking-tight text-slate-900">Lifetime Access</h3>
            <p className="mt-6 text-base leading-7 text-slate-600">Unlock a comprehensive repository of previous year questions, mock tests, and interview experiences categorized by company.</p>
            <div className="mt-10 flex items-center gap-x-4">
              <h4 className="flex-none text-sm font-semibold leading-6 text-green-600">What's included</h4>
              <div className="h-px flex-auto bg-slate-100"></div>
            </div>
            <ul role="list" className="mt-8 grid grid-cols-1 gap-4 text-sm leading-6 text-slate-600 sm:grid-cols-2 sm:gap-6">
              <li className="flex gap-x-3"><CheckCircle2 className="h-6 w-5 flex-none text-green-600" /> ZOHO Interview Experiences</li>
              <li className="flex gap-x-3"><CheckCircle2 className="h-6 w-5 flex-none text-green-600" /> TCS NQT Preparation</li>
              <li className="flex gap-x-3"><CheckCircle2 className="h-6 w-5 flex-none text-green-600" /> WIPRO Elite NLTH Materials</li>
              <li className="flex gap-x-3"><CheckCircle2 className="h-6 w-5 flex-none text-green-600" /> Tech Mahindra Resources</li>
              <li className="flex gap-x-3"><CheckCircle2 className="h-6 w-5 flex-none text-green-600" /> ZenQ & Zenpact materials</li>
            </ul>
          </div>
          <div className="-mt-2 p-2 lg:mt-0 lg:w-full lg:max-w-md lg:flex-shrink-0">
            <div className="rounded-2xl bg-slate-50 py-10 text-center ring-1 ring-inset ring-slate-900/5 lg:flex lg:flex-col lg:justify-center lg:py-16">
              <div className="mx-auto max-w-xs px-8">
                <p className="text-base font-semibold text-slate-600">One-time payment</p>
                <p className="mt-6 flex items-baseline justify-center gap-x-2">
                  <span className="text-5xl font-bold tracking-tight text-slate-900">?199</span>
                  <span className="text-sm font-semibold leading-6 tracking-wide text-slate-600">INR</span>
                </p>
                <button
                  onClick={handlePayment}
                  disabled={processing}
                  className="mt-10 block w-full rounded-md bg-green-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 disabled:opacity-50"
                >
                  {processing ? 'Processing...' : 'Unlock Now'}
                </button>
                <p className="mt-6 text-xs leading-5 text-slate-600">Secured by Razorpay</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-slate-900 sm:truncate sm:text-3xl sm:tracking-tight">Placement Materials</h2>
          <p className="mt-1 text-sm text-slate-500">Access your unlocked company-specific preparation resources.</p>
        </div>
      </div>

      {materials.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-slate-500">No materials available yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {materials.map((material) => (
            <a key={material.id} href={material.drive_link} target="_blank" rel="noopener noreferrer" className="col-span-1 flex flex-col divide-y divide-slate-200 rounded-lg bg-white text-center shadow transition hover:shadow-md hover:-translate-y-1">
              <div className="flex flex-1 flex-col p-8">
                <FolderOpen className="mx-auto h-12 w-12 text-green-500" />
                <h3 className="mt-6 text-sm font-medium text-slate-900">{material.company_name}</h3>
                <dl className="mt-1 flex flex-grow flex-col justify-between">
                  <dt className="sr-only">Description</dt>
                  <dd className="text-sm text-slate-500">{material.description}</dd>
                </dl>
              </div>
              <div>
                <div className="-mt-px flex divide-x divide-slate-200">
                  <div className="flex w-0 flex-1">
                    <span className="relative -mr-px inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-b-lg border border-transparent py-4 text-sm font-semibold text-slate-900 hover:bg-slate-50">
                      Open in Drive
                    </span>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      )}
    </main>
  )
}
