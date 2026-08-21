import { useState, useEffect } from 'react'
import { supabase } from '../supabase/supabaseClient'
import { CheckCircle, X, Check, Image as ImageIcon } from 'lucide-react'

export default function Approvals() {
  const [pendingSubmissions, setPendingSubmissions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchPendingVerifications() {
      try {
        const { data: submissions, error } = await supabase
          .from('user_challenges')
          .select(`
            id,
            proof_text,
            proof_url,
            status,
            submitted_at,
            user_id,
            challenge_id,
            users:user_id (name, email),
            challenges:challenge_id (title, xp)
          `)
          .eq('status', 'pending')
          .order('submitted_at', { ascending: false })

        if (error) throw error

        const formattedSubmissions = submissions.map(sub => ({
          id: sub.id,
          challengeTitle: sub.challenges?.title || 'Unknown Challenge',
          studentName: sub.users?.name || sub.users?.email || 'Unknown Student',
          evidence: sub.proof_text,
          proofUrl: sub.proof_url,
          submittedAt: sub.submitted_at,
          userId: sub.user_id,
          challengeId: sub.challenge_id
        }))

        setPendingSubmissions(formattedSubmissions)
      } catch (err) {
        console.error('Error fetching verifications:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchPendingVerifications()
  }, [])

  async function handleVerification(submissionId, status) {
    try {
      const { error: reviewError } = await supabase.rpc('review_submission', {
        p_submission_id: submissionId,
        p_status: status
      })
      if (reviewError) throw reviewError

      setPendingSubmissions(prev => prev.filter(sub => sub.id !== submissionId))
    } catch (err) {
      console.error('Error verifying submission:', err)
      alert('Failed to verify submission. See console for details.')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">
          Pending Approvals
        </h1>
        <p className="mt-2 text-slate-600">
          Review student submissions for eco-challenges
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-slate-900">
            Awaiting Verification
          </h2>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
            {pendingSubmissions.length} pending
          </span>
        </div>

        {pendingSubmissions.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 rounded-lg border-2 border-dashed border-slate-200">
            <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-3" />
            <p className="text-slate-600 font-medium text-lg">You're all caught up!</p>
            <p className="text-slate-500 mt-1">There are no pending submissions right now.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {pendingSubmissions.map((submission) => (
              <SubmissionCard
                key={submission.id}
                submission={submission}
                onApprove={() => handleVerification(submission.id, 'approved')}
                onReject={() => handleVerification(submission.id, 'rejected')}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function SubmissionCard({ submission, onApprove, onReject }) {
  return (
    <div className="border border-slate-200 rounded-lg p-5 bg-white shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-semibold text-lg text-slate-900">{submission.challengeTitle}</h3>
          <p className="text-sm text-slate-500 mt-1">
            Submitted by <span className="font-medium text-slate-700">{submission.studentName}</span> on {new Date(submission.submittedAt).toLocaleDateString()}
          </p>
        </div>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          Pending
        </span>
      </div>

      <div className="bg-slate-50 rounded-lg p-4 mb-4">
        <h4 className="text-sm font-medium text-slate-700 mb-2">Description:</h4>
        <p className="text-sm text-slate-600 whitespace-pre-wrap">
          {submission.evidence || 'No text evidence provided.'}
        </p>
      </div>

      {submission.proofUrl ? (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-slate-700 mb-2 flex items-center">
            <ImageIcon className="h-4 w-4 mr-1 text-slate-500" /> Image Evidence:
          </h4>
          <div className="rounded-lg overflow-hidden border border-slate-200 max-w-sm">
            <img src={submission.proofUrl} alt="Submission evidence" className="w-full h-auto object-cover" />
          </div>
        </div>
      ) : (
        <div className="mb-4 text-sm text-slate-500 italic">
          No image uploaded.
        </div>
      )}

      <div className="flex space-x-3 pt-2">
        <button
          onClick={onApprove}
          className="flex-1 flex items-center justify-center space-x-2 bg-green-600 text-white py-2.5 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium"
        >
          <Check className="h-5 w-5" />
          <span>Approve</span>
        </button>
        <button
          onClick={onReject}
          className="flex-1 flex items-center justify-center space-x-2 bg-red-600 text-white py-2.5 px-4 rounded-lg hover:bg-red-700 transition-colors font-medium"
        >
          <X className="h-5 w-5" />
          <span>Reject</span>
        </button>
      </div>
    </div>
  )
}
