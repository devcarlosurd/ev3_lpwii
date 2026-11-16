import { shallowRef } from 'vue';

const key = 'gamehub.session';
export const session = shallowRef(null);
try {
  session.value = JSON.parse(sessionStorage.getItem(key));
} catch {
  sessionStorage.removeItem(key);
}

export function setSession(value) {
  session.value = value;
  if (value) sessionStorage.setItem(key, JSON.stringify(value));
  else sessionStorage.removeItem(key);
}

export async function api(path, { method = 'GET', body } = {}) {
  const token = session.value?.token;
  let response;
  try {
    response = await fetch('/api' + path, {
      method,
      headers: {
        ...(token ? { Authorization: 'Bearer ' + token } : {}),
        ...(body === undefined ? {} : { 'Content-Type': 'application/json' }),
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new Error('No se pudo comunicar con la API. Comprueba que esté en ejecución.');
  }
  if (response.status === 204) return undefined;
  const data = await response.json().catch(() => null);
  if (!response.ok || data === null) {
    if (response.status === 401 && token) setSession(null);
    throw new Error([data?.message].flat().filter(Boolean).join('. ') || 'La API no respondió correctamente.');
  }
  return data;
}
