import React from 'react';

export default function ComingSoon({ title = 'Coming soon' }) {
  return (
    <div style={{ maxWidth: 960, margin: '48px auto', padding: '0 16px' }}>
      <h2>{title}</h2>
      <p style={{ marginTop: 8, opacity: 0.8 }}>
        该页面稍后实现。当前项目仅提供首页与角色展示示例。
      </p>
    </div>
  );
}
