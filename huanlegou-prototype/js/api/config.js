/** @typedef {'mock' | 'remote'} ApiMode */

/**
 * 切换数据源：
 * - mock：本地 catalog.js（当前 demo）
 * - remote：对接后端时改 baseUrl，并实现 http-api.js
 *
 * 也可在控制台临时切换：ApiConfig.mode = 'remote'
 */
const ApiConfig = {
  mode: /** @type {ApiMode} */ ('mock'),
  baseUrl: '',
  /** @returns {Record<string, string>} */
  headers() {
    const h = { Accept: 'application/json' };
    // const token = localStorage.getItem('hlg_token');
    // if (token) h.Authorization = `Bearer ${token}`;
    return h;
  },
};
