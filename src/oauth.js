import axios from 'axios'

const tokenExchangeEndpoints = {
  local: 'http://localhost:10122/exchange_token',
  theta: 'https://sumup-token-exchange.serj-tubin.com/exchange_token',
  staging: 'https://sumup-token-exchange.serj-tubin.com/exchange_token',
  live: 'https://sumup-token-exchange.serj-tubin.com/exchange_token',
}

const authUrlEndpoints = {
  local: 'http://localhost:10122/authorize',
  theta: 'https://api-theta.sam-app.ro/authorize',
  staging: 'https://api.sam-app.ro/authorize',
  live: 'https://api.sumup.com/authorize',
}

function generateRandomString(length) {
  const charset =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~'
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

function buildAuthorizationUrl(
  clientId,
  redirectUri,
  challenge,
  scope,
  environment
) {
  const state = generateRandomString(20)
  const authUrl = new URL(authUrlEndpoints[environment])
  authUrl.searchParams.set('client_id', clientId)
  authUrl.searchParams.set('response_type', 'code')
  authUrl.searchParams.set('redirect_uri', redirectUri)
  authUrl.searchParams.set('code_challenge', challenge)
  authUrl.searchParams.set('code_challenge_method', 'S256')
  authUrl.searchParams.set('state', state)

  // TODO: check why we can't set scopes (results in 500)
  // authUrl.searchParams.set('scope', scope)
  // authUrl.searchParams.set('scope', 'payments')

  return { url: authUrl, state: state }
}

async function exchangeCodeForAccessToken(
  code,
  redirectUri,
  codeVerifier,
  environment
) {
  try {
    const response = await axios.post(tokenExchangeEndpoints[environment], {
      code: code,
      redirect_uri: redirectUri,
      code_verifier: codeVerifier,
      env: environment,
    })
    return response.data
  } catch (error) {
    console.error('Error exchanging code for access token:', error)
  }
}

export {
  createCodeVerifierAndChallenge,
  buildAuthorizationUrl,
  exchangeCodeForAccessToken,
}
