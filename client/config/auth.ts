// -- Methods to handle run-time value of the access token (on the client side)
let token = '';

export function setAccessToken(t: string) {
  token = t;
}

export function getAccessToken() {
  return token;
}
// --
