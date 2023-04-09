import axios from 'axios'

const tokenExchangeEndpoint = 'https://sumup-token-exchange.serj-tubin.com/exchange_token'

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

function buildAuthorizationUrl(clientId, redirectUri, challenge, env, scope) {
  const authUrl = new URL('https://api.sumup.com/authorize')
  authUrl.searchParams.set('client_id', clientId)
  authUrl.searchParams.set('response_type', 'code')
  authUrl.searchParams.set('redirect_uri', redirectUri)
  authUrl.searchParams.set('code_challenge', challenge)
  authUrl.searchParams.set('code_challenge_method', 'S256')
  authUrl.searchParams.set('env', env)
  authUrl.searchParams.set('state', generateRandomString(16))

  // TODO: check why we can't set scopes (results in 500)
  // authUrl.searchParams.set('scope', scope)
  // authUrl.searchParams.set('scope', 'payments')

  return authUrl
}

async function exchangeCodeForAccessToken(code, redirectUri, codeVerifier) {
  try {
    const response = await axios.post(tokenExchangeEndpoint, {
      code: code,
      redirect_uri: redirectUri,
      code_verifier: codeVerifier
    });
    return response.data
  } catch (error) {
    console.error('Error exchanging code for access token:', error);
  }
}

export { createCodeVerifierAndChallenge, buildAuthorizationUrl, exchangeCodeForAccessToken }
