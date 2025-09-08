import React, { useState } from 'react'
import { useWallet } from '@txnlab/use-wallet-react'
import { sendDeviceTrackingNote } from '../utils/algorand'

const DeviceTracker: React.FC = () => {
  const { activeAddress, signTransactions } = useWallet()
  const [location, setLocation] = useState('')
  const [deviceId, setDeviceId] = useState('')
  const [status, setStatus] = useState('lost')
  const [txId, setTxId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const trackDevice = async () => {
    if (!activeAddress || !signTransactions) return
    setLoading(true)

    try {
      const tx = await sendDeviceTrackingNote(
        activeAddress,
        signTransactions,
        deviceId || '1234',
        location || 'Unknown',
        status
      )
      setTxId(tx)
    } catch (err) {
      console.error(err)
      alert('Failed to send device tracking info.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mt-8 text-center max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">🔍 Track Your Device</h2>

      {!activeAddress ? (
        <p className="text-red-500 font-medium mb-2">Please connect your wallet to continue.</p>
      ) : (
        <>
          <input
            type="text"
            placeholder="Device ID"
            value={deviceId}
            onChange={(e) => setDeviceId(e.target.value)}
            className="input input-bordered w-full mb-2"
          />
          <input
            type="text"
            placeholder="Last Known Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="input input-bordered w-full mb-2"
          />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="select select-bordered w-full mb-4"
          >
            <option value="lost">Lost</option>
            <option value="found">Found</option>
          </select>

          <button
            className="btn btn-primary w-full"
            onClick={trackDevice}
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Submit Device Status'}
          </button>

          {txId && (
            <div className="mt-4 text-green-600">
              ✅ Submitted! Tx ID: <a
                className="underline text-blue-600"
                href={`https://app.dappflow.org/explorer/transaction/${txId}`}
                target="_blank"
                rel="noopener noreferrer"
              >{txId}</a>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default DeviceTracker