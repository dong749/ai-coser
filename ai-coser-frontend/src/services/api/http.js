/**
 * http.js
 * 统一请求层（基于 fetch）
 * - 自动拼接 BASE_URL
 * - 统一错误处理
 * - 支持 JSON 与 FormData
 * - 提供 postStream 用于流式响应
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

async function request(path, { method = 'GET', headers = {}, body, signal } = {}) {
  const isForm = body instanceof FormData;
  const token = localStorage.getItem('token'); // 如需鉴权，可放这里
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      ...(isForm ? {} : { 'Content-Type': 'application/json' }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: isForm ? body : body ? JSON.stringify(body) : undefined,
    signal,
    credentials: 'include', // 如不需要可移除
  });

  if (!res.ok) {
    let payload = null;
    try { payload = await res.json(); } catch { /* ignore */ }
    const message = payload?.error?.message || `${res.status} ${res.statusText}`;
    const code = payload?.error?.code || 'HTTP_ERROR';
    const err = new Error(message);
    err.code = code;
    err.status = res.status;
    throw err;
  }
  return res;
}

export const http = {
  get: async (path, opt) => request(path, { ...opt, method: 'GET' }).then(r => r.json()),
  post: async (path, body, opt = {}) => request(path, { ...opt, method: 'POST', body }).then(r => r.json()),
  postStream: async (path, body, opt = {}) => request(path, { ...opt, method: 'POST', body }),
};
