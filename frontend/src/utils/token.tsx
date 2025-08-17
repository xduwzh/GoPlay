// Token and auth info management utilities

const TOKENKEY = "token_key";

function setToken(token: string) {
  localStorage.setItem(TOKENKEY, token);
}

function getToken(): string | null {
  return localStorage.getItem(TOKENKEY);
}

function removeToken() {
  localStorage.removeItem(TOKENKEY);
}

export { setToken, getToken, removeToken };
