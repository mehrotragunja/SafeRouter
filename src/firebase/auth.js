// Firebase REST API configuration
const FB = {
  key: 'AIzaSyBeBcJPRIeAEn2lym0X9TfVihQzaJ2l3os',
  pid: 'saferouter-44214',
  auth: 'https://identitytoolkit.googleapis.com/v1',
  fs: 'https://firestore.googleapis.com/v1'
};

/**
 * Firebase error handler
 */
export function fbErr(err) {
  const msg = err?.response?.data?.error?.message || err?.message || 'Something went wrong';
  const errors = {
    'EMAIL_EXISTS': 'Email is already registered',
    'OPERATION_NOT_ALLOWED': 'Operation not allowed',
    'TOO_MANY_ATTEMPTS_LOGIN_RETRY_LATER': 'Too many login attempts. Try again later',
    'EMAIL_NOT_FOUND': 'Email not found',
    'INVALID_PASSWORD': 'Invalid password',
    'USER_DISABLED': 'User account is disabled',
    'INVALID_EMAIL': 'Invalid email',
    'WEAK_PASSWORD': 'Password too weak (min 6 chars)',
    'MISSING_PASSWORD': 'Missing password'
  };
  return errors[msg] || msg;
}

/**
 * Sign up with email and password
 */
export async function fbSignUp(email, password) {
  try {
    const res = await fetch(`${FB.auth}/accounts:signUp?key=${FB.key}`, {
      method: 'POST',
      body: JSON.stringify({
        email,
        password,
        returnSecureToken: true
      })
    });
    const data = await res.json();
    if (!res.ok) throw data;
    return data; // { idToken, refreshToken, localId, email, expiresIn }
  } catch (err) {
    throw new Error(fbErr(err));
  }
}

/**
 * Sign in with email and password
 */
export async function fbSignIn(email, password) {
  try {
    const res = await fetch(`${FB.auth}/accounts:signInWithPassword?key=${FB.key}`, {
      method: 'POST',
      body: JSON.stringify({
        email,
        password,
        returnSecureToken: true
      })
    });
    const data = await res.json();
    if (!res.ok) throw data;
    return data; // { idToken, refreshToken, localId, email, expiresIn }
  } catch (err) {
    throw new Error(fbErr(err));
  }
}

/**
 * Refresh access token
 */
export async function fbRefresh(refreshToken) {
  try {
    const res = await fetch(`https://securetoken.googleapis.com/v1/token?key=${FB.key}`, {
      method: 'POST',
      body: JSON.stringify({
        grant_type: 'refresh_token',
        refresh_token: refreshToken
      })
    });
    const data = await res.json();
    if (!res.ok) throw data;
    return data; // { access_token, expires_in, token_type, refresh_token }
  } catch (err) {
    throw new Error(fbErr(err));
  }
}

/**
 * Send email verification code
 */
export async function fbSendVerification(idToken) {
  try {
    const res = await fetch(`${FB.auth}/accounts:sendOobCode?key=${FB.key}`, {
      method: 'POST',
      body: JSON.stringify({
        requestType: 'VERIFY_EMAIL',
        idToken
      })
    });
    const data = await res.json();
    if (!res.ok) throw data;
    return data;
  } catch (err) {
    throw new Error(fbErr(err));
  }
}

/**
 * Verify email code
 */
export async function fbVerifyEmail(oobCode) {
  try {
    const res = await fetch(`${FB.auth}/accounts:update?key=${FB.key}`, {
      method: 'POST',
      body: JSON.stringify({
        oobCode
      })
    });
    const data = await res.json();
    if (!res.ok) throw data;
    return data;
  } catch (err) {
    throw new Error(fbErr(err));
  }
}

/**
 * Get account info (verify token is valid and get email verification status)
 */
export async function fbGetAccountInfo(idToken) {
  try {
    const res = await fetch(`${FB.auth}/accounts:lookup?key=${FB.key}`, {
      method: 'POST',
      body: JSON.stringify({
        idToken
      })
    });
    const data = await res.json();
    if (!res.ok) throw data;
    return data.users[0]; // Get first user
  } catch (err) {
    throw new Error(fbErr(err));
  }
}

/**
 * Delete account
 */
export async function fbDeleteAccount(idToken) {
  try {
    const res = await fetch(`${FB.auth}/accounts:delete?key=${FB.key}`, {
      method: 'POST',
      body: JSON.stringify({
        idToken
      })
    });
    const data = await res.json();
    if (!res.ok) throw data;
    return data;
  } catch (err) {
    throw new Error(fbErr(err));
  }
}
