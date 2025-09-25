/**
 * Mock：角色列表/详情
 * 可立即跑通前端，后端接入后切换 VITE_USE_MOCK=false 即可
 */
const DB = [
  {
    id: 'harry',
    name: '哈利·波特',
    tags: ['wizard', 'fiction'],
    description: '来自魔法世界的年轻巫师，擅长魔法知识解读与魔咒对话。',
    avatar: 'https://placehold.co/160x160?text=Harry',
    skills: ['魔法设定考据', '情节回忆检索', '咒语/魔药解释'],
    meta: { universe: 'Harry Potter' },
  },
  {
    id: 'socrates',
    name: '苏格拉底',
    tags: ['philosopher', 'ancient greece'],
    description: '古希腊哲学家，以“反诘法”著称，善于引导式追问与概念澄清。',
    avatar: 'https://placehold.co/160x160?text=Socrates',
    skills: ['反诘引导', '概念澄清', '伦理两难讨论'],
    meta: { era: 'Classical Athens' },
  },
  {
    id: 'qinshihuang',
    name: '嬴政（秦始皇）',
    tags: ['emperor', 'history'],
    description: '中国历史上首次完成大一统的皇帝，可进行历史制度解析与治国策略讨论。',
    avatar: 'https://placehold.co/160x160?text=Qin',
    skills: ['历史制度解析', '治国策略模拟', '度量衡/律法解读'],
    meta: { era: 'Qin Dynasty' },
  },
];

export async function searchCharacters({ q = '' } = {}) {
  const kw = q.trim().toLowerCase();
  const list = !kw
    ? DB
    : DB.filter(c =>
        [c.name, c.description, ...(c.tags || []), ...(c.skills || [])]
          .join(' ')
          .toLowerCase()
          .includes(kw),
      );
  // 模拟网络耗时
  await new Promise(r => setTimeout(r, 200));
  return { list };
}

export async function getCharacterById(id) {
  const found = DB.find(c => c.id === id);
  if (!found) throw new Error('Character not found');
  await new Promise(r => setTimeout(r, 150));
  return found;
}
