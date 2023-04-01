import axios from 'axios'

function generateRandomString(length) {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~'
  let randomString = ''

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length)
    randomString += charset[randomIndex]
  }

  return randomString
}

async function createCodeVerifierAndChallenge() {
  const verifier = generateRandomString(32)
  const encoder = new TextEncoder()
  const data = encoder.encode(verifier)
  const buffer = await crypto.subtle.digest('SHA-256', data)
  const challengeArray = new Uint8Array(buffer)
  const challenge = btoa(String.fromCharCode.apply(null, challengeArray))
    .replace('+', '-')
    .replace('/', '_')
    .replace(/=+$/, '')

  return { verifier, challenge }
}

function buildAuthorizationUrl(clientId, redirectUri, challenge, scope) {
  const authUrl = new URL('https://api.sumup.com/authorize')
  authUrl.searchParams.set('client_id', clientId)
  authUrl.searchParams.set('response_type', 'code')
  authUrl.searchParams.set('redirect_uri', redirectUri)
  authUrl.searchParams.set('code_challenge', challenge)
  authUrl.searchParams.set('code_challenge_method', 'S256')
  authUrl.searchParams.set('scope', scope)
  authUrl.searchParams.set('state', generateRandomString(16))

  return authUrl
}

async function exchangeCodeForToken(clientId, redirectUri, code, codeVerifier) {
  const tokenUrl = 'https://api.sumup.com/token'
  const response = await axios.post(tokenUrl, null, {
    params: {
      client_id: clientId,
      grant_type: 'authorization_code',
      redirect_uri: redirectUri,
      code: code,
      code_verifier: codeVerifier
    }
  })

  return response.data
}

export { createCodeVerifierAndChallenge, buildAuthorizationUrl, exchangeCodeForToken }
