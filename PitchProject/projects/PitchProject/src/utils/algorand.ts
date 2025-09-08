import algosdk from 'algosdk'

const algodToken = '' // No token needed for most public endpoints
const algodServer = 'https://testnet-api.algonode.cloud'
const algodPort = ''

const algodClient = new algosdk.Algodv2(algodToken, algodServer, algodPort)

export async function sendDeviceTrackingNote(
  sender: string,
  signTransactions: (txns: string[]) => Promise<string[]>,
  deviceId: string,
  location: string,
  status: string
): Promise<string> {
  // 1. Get suggested params
  const suggestedParams = await algodClient.getTransactionParams().do()

  // 2. Create note
  const note = new TextEncoder().encode(
    JSON.stringify({ deviceId, location, status })
  )

  // 3. Create transaction (sending to self, 0 ALGO, just for note)
  const txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
    from: sender,
    to: sender,
    amount: 0,
    note,
    suggestedParams,
  })

  // 4. Encode transaction for wallet signing
  const txnB64 = Buffer.from(txn.toByte()).toString('base64')

  // 5. Sign transaction using wallet
  const [signedTxn] = await signTransactions([txnB64])

  // 6. Send transaction to network
  const { txId } = await algodClient.sendRawTransaction(
    Buffer.from(signedTxn, 'base64')
  ).do()

  return txId
}
