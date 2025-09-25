/**
 * characters.contract.js
 * 前后端契约（Contract）——角色检索 / 角色详情
 *
 * 后端同学请注意（接口约定）：
 * 1) 搜索角色
 *    - Method/Path: GET /api/v1/characters?q=xxx
 *    - Query:
 *        q?: string  // 关键字，可为空
 *    - Response: { list: Character[] }
 *
 * 2) 角色详情
 *    - Method/Path: GET /api/v1/characters/:id
 *    - Response: Character
 *
 * 统一错误结构（建议）：
 *    4xx/5xx: { error: { code: string, message: string } }
 *
 * 说明：
 * 本文件导出的函数仅用于“约定签名/文档”，不应在运行时被调用。
 * 真正的实现请使用 services/index.js 导出的 mock 或 api 实现。
 */

/**
 * @typedef {Object} Character
 * @property {string} id             // 角色唯一ID
 * @property {string} name           // 展示名称
 * @property {string[]} tags         // 标签（如 "wizard","philosopher"）
 * @property {string} description    // 简介
 * @property {string} avatar         // 头像URL
 * @property {string[]} skills       // 角色“可用技能”名（前端展示/可点击）
 * @property {Object<string, any>=} meta // 其他元数据（可选）
 */

/**
 * 搜索角色（契约函数签名）
 * @param {{ q?: string }} params
 * @returns {Promise<{ list: Character[] }>}
 */
export async function searchCharacters(params) {
  // 用 void 消费参数，规避 ts(6133)/eslint no-unused-vars，同时不产生副作用
  void params;
  throw new Error('[Contract Stub] 请从 services/index.js 导入实现（mock 或 api）。');
}

/**
 * 获取角色详情（契约函数签名）
 * @param {string} id
 * @returns {Promise<Character>}
 */
export async function getCharacterById(id) {
  void id;
  throw new Error('[Contract Stub] 请从 services/index.js 导入实现（mock 或 api）。');
}
