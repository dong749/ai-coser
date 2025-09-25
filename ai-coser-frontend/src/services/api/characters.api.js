/**
 * 真实接口实现（占位）：角色检索/详情
 * 与后端约定见 contracts/characters.contract.js
 */
import { http } from './http.js';

export function searchCharacters({ q = '' } = {}) {
  const qp = q ? `?q=${encodeURIComponent(q)}` : '';
  return http.get(`/characters${qp}`);
}

export function getCharacterById(id) {
  return http.get(`/characters/${id}`);
}
