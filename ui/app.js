const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => [...root.querySelectorAll(s)];
const paths = {
  nodes: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
  folder: '<path d="M3 7V5a1 1 0 0 1 1-1h5l2 3h9a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z"/>',
  image: '<rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8" cy="8" r="1.5"/><path d="m3 17 5-5 4 4 4-7 5 7"/>',
  help: '<circle cx="12" cy="12" r="9"/><path d="M9 9a3 3 0 0 1 6 0c0 2-3 2-3 4m0 3v.1"/>',
  settings: '<path d="m9 3-1 3-3 1-2 3 2 2-1 3 3 2 2-1 3 2 3-2 2 1 3-2-1-3 2-2-2-3-3-1-1-3z"/><circle cx="12" cy="11" r="3"/>',
  save: '<path d="M4 3h13l4 4v14H3V3z"/><path d="M7 3v6h9V3M7 21v-8h10v8"/>',
  export: '<path d="M12 15V3m-4 4 4-4 4 4M4 13v7h16v-7"/>',
  import: '<path d="M12 3v12m-4-4 4 4 4-4M4 15v5h16v-5"/>',
  panel: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M9 4v16m7-11-3 3 3 3"/>',
  'panel-right': '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M15 4v16"/>',
  workflow: '<rect x="3" y="3" width="6" height="6" rx="1"/><rect x="15" y="15" width="6" height="6" rx="1"/><path d="M6 9v9h9M9 6h9v9"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  minus: '<path d="M5 12h14"/>',
  play: '<path d="m8 5 11 7-11 7z"/>',
  pause: '<path d="M8 5v14M16 5v14"/>',
  stop: '<rect x="6" y="6" width="12" height="12" rx="1"/>',
  fit: '<path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5"/><rect x="7" y="7" width="10" height="10" rx="1"/>',
  map: '<path d="m3 5 6-2 6 2 6-2v16l-6 2-6-2-6 2zM9 3v16M15 5v16"/>',
  mouse: '<rect x="6" y="2" width="12" height="20" rx="6"/><path d="M12 6v4"/>',
  shield: '<path d="m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6z"/><path d="m8 11 3 3 5-5"/>',
  search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>',
  text: '<path d="M4 5h16M12 5v15M8 20h8M4 5v3M20 5v3"/>',
  film: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M7 3v18M17 3v18M3 8h4m-4 8h4m10-8h4m-4 8h4"/>',
  audio: '<path d="M4 10v4m4-8v12m4-15v18m4-15v12m4-8v4"/>',
  model: '<path d="m12 2 9 5v10l-9 5-9-5V7zM3 7l9 5 9-5M12 12v10m-5-17 9 5"/>',
  sparkles: '<path d="m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5zM20 3v4m-2-2h4"/>',
  monitor: '<rect x="3" y="3" width="18" height="14" rx="2"/><path d="M12 17v4m-5 0h10"/>',
  chevron: '<path d="m9 5 7 7-7 7"/>',
  more: '<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>',
  close: '<path d="m6 6 12 12M6 18 18 6"/>',
  dice: '<rect x="3" y="3" width="18" height="18" rx="4"/><path d="M7 7h.01M17 7h.01M12 12h.01M7 17h.01M17 17h.01"/>',
  download: '<path d="M12 3v12m-4-4 4 4 4-4M4 16v5h16v-5"/>',
  queue: '<path d="M4 6h16M4 12h10M4 18h8m5-4 4 3-4 3z"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  undo: '<path d="m8 4-5 5 5 5M3 9h12a6 6 0 0 1 0 12"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6m0-10v.1"/>',
};
const icon = name => `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">${paths[name] || paths.nodes}</svg>`;
function hydrateIcons(root = document) { $$('i[data-icon]', root).forEach(el => el.outerHTML = icon(el.dataset.icon)); }
const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const sample = '/assets/i2va.mp4';
const STORAGE = 'minimax-flow-v1';
const TYPE = {
  prompt: { title: '文本提示词', english: 'Text prompt', icon: 'text', color: '#b6a1ed', inputs: [], outputs: ['text'] },
  image: { title: '加载参考图像', english: 'Load image', icon: 'image', color: '#88b5df', inputs: [], outputs: ['image'] },
  model: { title: 'MiniMax 模型', english: 'Model loader', icon: 'model', color: '#b2d991', inputs: [], outputs: ['model'] },
  generate: { title: 'H3 视频生成', english: 'Video generation', icon: 'sparkles', color: '#b4ee91', inputs: ['model', 'text', 'image'], outputs: ['video'] },
  output: { title: '视频预览', english: 'Preview video', icon: 'monitor', color: '#e2b58f', inputs: ['video'], outputs: [] },
};
const PORT = { text: ['文本', '#b6a1ed'], image: ['图像', '#88b5df'], model: ['模型', '#b2d991'], video: ['视频', '#e2b58f'] };
const initialPrompt = '温暖的日式餐厅，前景是一碗热气腾腾的拉面，金色的汤汁与翠绿的葱花细节清晰。\n\n镜头保持静止，焦点从拉面缓缓移向背景中围坐的一家人。柔和的自然光，浅景深，温馨的电影质感。';
function defaultNode(type, id, x, y) {
  const data = type === 'prompt' ? { text: initialPrompt } : type === 'image' ? { image: '', filename: '日式餐厅 · 仓库示例首帧' } : type === 'model' ? { model: 'H3-Base-FL2VA' } : type === 'generate' ? { duration: 8, resolution: '768p', ratio: '16:9', seed: 42, audio: true } : {};
  return { id, type, x, y, data };
}
function defaultWorkflow(kind = 'image') {
  const nodes = [defaultNode('prompt', 'n1', 30, 30), defaultNode('image', 'n2', 30, 375), defaultNode('model', 'n3', 365, 30), defaultNode('generate', 'n4', 365, 275), defaultNode('output', 'n5', 715, 165)];
  const edges = [{ from: 'n1', to: 'n4', port: 'text' }, { from: 'n2', to: 'n4', port: 'image' }, { from: 'n3', to: 'n4', port: 'model' }, { from: 'n4', to: 'n5', port: 'video' }];
  return { version: 1, name: kind === 'text' ? '灵感成片 · 文生视频' : '光影之间 · 图生视频', nodes: kind === 'text' ? nodes.filter(n => n.type !== 'image') : nodes, edges: kind === 'text' ? edges.filter(e => e.port !== 'image') : edges };
}
let workflow = defaultWorkflow();
let selected = 'n4', panel = 'nodes', inspectorTab = 'queue', pending = null, toastTimer, saveTimer, saveFailed = false, imageTarget = null;
let view = { x: 20, y: 145, zoom: .8 }, gesture = null, run = null, history = [], undoStack = [], dirty = false;
let preferences = { snap: false, animate: true };
function validateWorkflow(value) {
  if (!value || value.version !== 1 || typeof value.name !== 'string' || !Array.isArray(value.nodes) || !Array.isArray(value.edges) || value.nodes.length > 100 || value.edges.length > 400) throw new Error('请选择有效的 MiniMax Flow 工作流 JSON（最多 100 个节点）。');
  const ids = new Set();
  const clean = { version: 1, name: value.name.trim().slice(0, 80) || '未命名工作流', nodes: [], edges: [] };
  for (const n of value.nodes) {
    if (!TYPE[n.type] || typeof n.id !== 'string' || !/^[a-zA-Z0-9_-]{1,64}$/.test(n.id) || ids.has(n.id) || !Number.isFinite(n.x) || !Number.isFinite(n.y) || Math.abs(n.x) > 50000 || Math.abs(n.y) > 50000) throw new Error('工作流包含无效节点。');
    ids.add(n.id);
    const node = defaultNode(n.type, n.id, n.x, n.y), d = n.data || {};
    if (n.type === 'prompt') node.data.text = String(d.text ?? '').slice(0, 10000);
    if (n.type === 'image') {
      if (d.image && (typeof d.image !== 'string' || !/^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/.test(d.image) || d.image.length > 2800000)) throw new Error('参考图像格式无效或超过 2 MB。');
      node.data = { image: d.image || '', filename: String(d.filename || '参考图像').slice(0, 120) };
    }
    if (n.type === 'model') {
      if (!['H3-Base-FL2VA', 'H3-Base-Ref2VA'].includes(d.model)) throw new Error('工作流包含不支持的模型。');
      node.data.model = d.model;
    }
    if (n.type === 'generate') {
      if (![4, 6, 8, 10, 12, 15].includes(Number(d.duration)) || !['768p', '2K'].includes(d.resolution) || !['16:9', '9:16', '1:1'].includes(d.ratio) || !Number.isInteger(Number(d.seed)) || Number(d.seed) < 0 || Number(d.seed) > 2147483647 || typeof d.audio !== 'boolean') throw new Error('生成参数无效。');
      node.data = { duration: Number(d.duration), resolution: d.resolution, ratio: d.ratio, seed: Number(d.seed), audio: d.audio };
    }
    clean.nodes.push(node);
  }
  const sockets = new Set();
  for (const e of value.edges) {
    const from = clean.nodes.find(n => n.id === e.from), to = clean.nodes.find(n => n.id === e.to);
    if (!from || !to || !TYPE[from.type].outputs.includes(e.port) || !TYPE[to.type].inputs.includes(e.port) || sockets.has(`${e.to}:${e.port}`)) throw new Error('工作流连线无效，或一个输入连接了多个输出。');
    sockets.add(`${e.to}:${e.port}`);
    clean.edges.push({ from: e.from, to: e.to, port: e.port });
  }
  return clean;
}
try {
  const saved = localStorage.getItem(STORAGE);
  if (saved) workflow = validateWorkflow(JSON.parse(saved));
  preferences = { ...preferences, ...JSON.parse(localStorage.getItem(`${STORAGE}-preferences`) || '{}') };
} catch { queueMicrotask(() => toast('本机存档无法读取，已打开默认工作流。')); }
function toast(message) { clearTimeout(toastTimer); $('#toast').textContent = message; $('#toast').classList.add('visible'); toastTimer = setTimeout(() => $('#toast').classList.remove('visible'), 3400); }
function checkpoint() { undoStack.push(JSON.stringify(workflow)); if (undoStack.length > 30) undoStack.shift(); }
function save(manual = false) {
  clearTimeout(saveTimer);
  try {
    localStorage.setItem(STORAGE, JSON.stringify(workflow)); dirty = false; saveFailed = false;
    $('#save-status').textContent = `已保存到本机 · ${new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}`;
    if (manual) toast('工作流已保存到当前浏览器。');
  } catch { $('#save-status').textContent = '本机存储已满，请导出工作流'; if (manual || !saveFailed) toast('无法自动保存，请导出 JSON 以保留工作流。'); saveFailed = true; }
}
function changed() { dirty = true; $('#save-status').textContent = '正在保存…'; clearTimeout(saveTimer); saveTimer = setTimeout(save, 450); updateCounts(); }
function updateCounts() { $('#node-total').textContent = `${workflow.nodes.length} 个节点`; $('#graph-count').textContent = `${workflow.nodes.length} 节点 · ${workflow.edges.length} 连接`; }
const option = (value, current, label = value) => `<option value="${esc(value)}" ${String(value) === String(current) ? 'selected' : ''}>${esc(label)}</option>`;
function nodeBody(n) {
  const d = n.data;
  if (n.type === 'prompt') return `<p class="node-subtitle">描述画面、镜头与声音</p><textarea data-field="text" aria-label="视频提示词" maxlength="10000" spellcheck="false">${esc(d.text)}</textarea><div class="prompt-footer"><span>${icon('sparkles')} H3 多模态提示词</span><span class="char-count">${d.text.length} 字</span></div><div class="port-space"></div>`;
  if (n.type === 'image') return `${d.image ? `<img class="reference-preview" src="${esc(d.image)}" alt="上传的参考图像">` : `<video class="reference-preview reference-frame" src="${sample}#t=0.01" preload="auto" muted playsinline aria-label="仓库示例视频首帧"></video>`}<div class="reference-caption"><span>${esc(d.filename)}</span><span>${d.image ? 'IMAGE' : '示例'}</span></div><button class="upload-button" data-upload="${n.id}">${icon('import')}上传参考图像</button><div class="port-space"></div>`;
  if (n.type === 'model') return `<label class="field-label" for="model-${n.id}">模型名称</label><select class="model-select" id="model-${n.id}" data-field="model">${option('H3-Base-FL2VA', d.model)}${option('H3-Base-Ref2VA', d.model)}</select><div class="model-meta"><span><i class="tiny-dot"></i>MiniMax H3</span><span>模型配置 · 未加载</span></div><div class="port-space"></div>`;
  if (n.type === 'generate') return `<div style="height:54px"></div><div class="field-divider"></div><label class="form-row"><span>生成时长</span><select data-field="duration" aria-label="生成时长">${[4, 6, 8, 10, 12, 15].map(v => option(v, d.duration, `${v} 秒`)).join('')}</select></label><label class="form-row"><span>分辨率</span><select data-field="resolution" aria-label="分辨率">${option('768p', d.resolution)}${option('2K', d.resolution, '2K · 需云端重生成')}</select></label><span class="field-label">画面比例</span><div class="segmented" aria-label="画面比例">${['16:9', '9:16', '1:1'].map(v => `<button class="${v === d.ratio ? 'active' : ''}" data-ratio="${v}" aria-pressed="${v === d.ratio}">${v}</button>`).join('')}</div><label class="form-row"><span>随机种子</span><span class="seed-field"><input type="number" min="0" max="2147483647" step="1" value="${d.seed}" data-field="seed" aria-label="随机种子"><button class="icon-button" data-random="${n.id}" aria-label="随机生成种子">${icon('dice')}</button></span></label><div class="field-divider"></div><div class="form-row"><span>原生音频</span><label class="toggle"><input type="checkbox" data-field="audio" aria-label="生成原生音频" ${d.audio ? 'checked' : ''}><span></span></label></div><p class="toggle-caption">同步生成环境声、对白与背景音乐</p><div class="port-space"></div>`;
  return `<div style="height:14px"></div><div class="output-video-wrap"><video class="output-video" src="${sample}" preload="metadata" muted playsinline aria-label="MiniMax H3 仓库示例视频"></video><span class="preview-badge">仓库示例 · 非本次生成</span></div><div class="video-controls"><button class="icon-button" data-video-toggle="${n.id}" aria-label="播放示例视频">${icon('play')}</button><span class="video-time">00:00</span><div class="video-track"><div class="video-progress"></div></div><span class="video-duration">00:08</span><button class="icon-button" data-preview aria-label="放大视频">${icon('fit')}</button></div><div class="output-meta"><span>日式餐厅 · 焦点转移</span><span>H3 示例</span></div><div class="output-actions"><button class="button subtle" data-download>${icon('download')} 下载示例</button><button class="button subtle" data-preview>${icon('fit')} 大屏预览</button></div><p class="sample-note">${icon('info')}演示运行会验证节点连接并播放此示例。<br>修改参数不会生成新视频。</p>`;
}
function portPosition(n, direction, index) {
  if (direction === 'input') return n.type === 'generate' ? 60 + index * 23 : 56;
  if (n.type === 'generate') return 106;
  const element = document.getElementById(n.id);
  return (element?.offsetHeight || 180) - 28;
}
function renderNodes() {
  $('#nodes').innerHTML = workflow.nodes.map(n => {
    const t = TYPE[n.type];
    return `<article id="${n.id}" class="node ${n.type === 'output' ? 'output-node' : ''} ${selected === n.id ? 'selected' : ''}" data-node="${n.id}" style="left:${n.x}px;top:${n.y}px;--node-color:${t.color}" aria-label="${t.title}节点"><header class="node-header">${icon(t.icon)}<strong>${t.title}</strong><span class="node-id">#${n.id.replace(/^n/, '')}</span><button class="icon-button" data-node-menu="${n.id}" aria-label="${t.title}节点选项">${icon('more')}</button></header><div class="node-content">${nodeBody(n)}</div>${['input', 'output'].map(dir => t[dir === 'input' ? 'inputs' : 'outputs'].map((p, i) => `<button class="node-port ${dir}" data-direction="${dir}" data-port="${p}" data-index="${i}" style="--port-color:${PORT[p][1]}" aria-label="${t.title} ${PORT[p][0]}${dir === 'input' ? '输入' : '输出'}端口"><span class="socket"></span><span class="port-label">${PORT[p][0]}</span></button>`).join('')).join('')}</article>`;
  }).join('');
  workflow.nodes.forEach(n => $$('.node-port', document.getElementById(n.id)).forEach(p => p.style.top = `${portPosition(n, p.dataset.direction, Number(p.dataset.index))}px`));
  $$('.output-video').forEach(v => {
    v.addEventListener('timeupdate', () => { const node = v.closest('.node'); $('.video-time', node).textContent = time(v.currentTime); $('.video-progress', node).style.width = `${v.duration ? v.currentTime / v.duration * 100 : 0}%`; });
    v.addEventListener('loadedmetadata', () => $('.video-duration', v.closest('.node')).textContent = time(v.duration));
    ['play', 'pause', 'ended'].forEach(event => v.addEventListener(event, () => { const button = $('[data-video-toggle]', v.closest('.node')); button.innerHTML = icon(v.paused ? 'play' : 'pause'); button.setAttribute('aria-label', v.paused ? '播放示例视频' : '暂停示例视频'); }));
  });
  renderEdges(); updateCounts(); renderMinimap();
}
function time(seconds) { return `${Math.floor(seconds / 60).toString().padStart(2, '0')}:${Math.floor(seconds % 60).toString().padStart(2, '0')}`; }
function socketPoint(id, direction, port) {
  const n = workflow.nodes.find(v => v.id === id);
  if (!n) return { x: 0, y: 0 };
  const element = document.getElementById(id), ports = TYPE[n.type][direction === 'output' ? 'outputs' : 'inputs'];
  return { x: n.x + (direction === 'output' ? element.offsetWidth : 0), y: n.y + portPosition(n, direction, ports.indexOf(port)) + 11 };
}
function curve(a, b) { const offset = Math.max(55, Math.abs(b.x - a.x) * .46); return `M ${a.x} ${a.y} C ${a.x + offset} ${a.y}, ${b.x - offset} ${b.y}, ${b.x} ${b.y}`; }
function renderEdges() {
  $('#connections').innerHTML = workflow.edges.map((e, i) => `<path class="connection ${run && preferences.animate ? 'running' : ''}" d="${curve(socketPoint(e.from, 'output', e.port), socketPoint(e.to, 'input', e.port))}" stroke="${PORT[e.port][1]}" data-edge="${i}"><title>${PORT[e.port][0]}连线 · 双击删除</title></path>`).join('') + (pending ? `<path class="connection pending" d="${curve(socketPoint(pending.from, 'output', pending.port), pending.point)}"/>` : '');
}
function applyView() { $('#graph').style.transform = `translate(${view.x}px,${view.y}px) scale(${view.zoom})`; $('#zoom-reset').textContent = `${Math.round(view.zoom * 100)}%`; const grid = Math.max(14, 20 * view.zoom); $('#canvas').style.backgroundSize = `${grid}px ${grid}px`; $('#canvas').style.backgroundPosition = `${view.x}px ${view.y}px`; renderMinimap(); }
function fit() {
  const canvas = $('#canvas');
  if (!workflow.nodes.length) { view = { x: 25, y: 145, zoom: 1 }; applyView(); return; }
  const left = Math.min(...workflow.nodes.map(n => n.x)), top = Math.min(...workflow.nodes.map(n => n.y));
  const right = Math.max(...workflow.nodes.map(n => n.x + document.getElementById(n.id).offsetWidth)), bottom = Math.max(...workflow.nodes.map(n => n.y + document.getElementById(n.id).offsetHeight));
  const upper = 130, lower = 78;
  const zoom = Math.min(1, (canvas.clientWidth - 52) / (right - left), (canvas.clientHeight - upper - lower) / (bottom - top));
  view = { zoom: Math.max(.25, zoom), x: (canvas.clientWidth - (right - left) * zoom) / 2 - left * zoom, y: upper - top * zoom };
  applyView();
}
function zoomAt(factor, cx = $('#canvas').clientWidth / 2, cy = $('#canvas').clientHeight / 2) { const next = Math.max(.25, Math.min(1.6, view.zoom * factor)); const ratio = next / view.zoom; view.x = cx - (cx - view.x) * ratio; view.y = cy - (cy - view.y) * ratio; view.zoom = next; applyView(); }
function worldPoint(event) { const box = $('#canvas').getBoundingClientRect(); return { x: (event.clientX - box.left - view.x) / view.zoom, y: (event.clientY - box.top - view.y) / view.zoom }; }
function renderMinimap() {
  const nodes = workflow.nodes;
  if (!nodes.length) { $('#minimap-svg').innerHTML = ''; return; }
  const minX = Math.min(...nodes.map(n => n.x)) - 40, minY = Math.min(...nodes.map(n => n.y)) - 40;
  const width = Math.max(...nodes.map(n => n.x + 300)) - minX + 40, height = Math.max(...nodes.map(n => n.y + (document.getElementById(n.id)?.offsetHeight || 200))) - minY + 40;
  $('#minimap-svg').setAttribute('viewBox', `${minX} ${minY} ${width} ${height}`);
  $('#minimap-svg').innerHTML = nodes.map(n => `<rect x="${n.x}" y="${n.y}" width="270" height="${document.getElementById(n.id)?.offsetHeight || 200}" rx="14" fill="${TYPE[n.type].color}" opacity="${n.id === selected ? '.65' : '.23'}"/>`).join('');
}
function renderLibrary(filter = '') {
  $('#library-title').textContent = { nodes: '节点库', workflows: '工作流', assets: '素材库' }[panel];
  $$('.rail-button[data-panel]').forEach(b => b.classList.toggle('active', b.dataset.panel === panel));
  if (panel === 'nodes') {
    const groups = [['输入', ['prompt', 'image']], ['模型与生成', ['model', 'generate']], ['输出', ['output']]];
    const items = groups.map(([label, types]) => {
      types = types.filter(t => `${TYPE[t].title} ${TYPE[t].english} ${t} MiniMax H3`.toLowerCase().includes(filter.toLowerCase()));
      return types.length ? `<div class="library-section-label"><span>${label}</span><b>${String(types.length).padStart(2, '0')}</b></div>${types.map(t => `<button class="library-item" data-add="${t}" draggable="true" style="--node-color:${TYPE[t].color}"><span class="library-icon">${icon(TYPE[t].icon)}</span><span><strong>${TYPE[t].title}</strong><small>${TYPE[t].english}</small></span><span class="add-symbol">+</span></button>`).join('')}` : '';
    }).join('');
    if ($('#node-search')) { $('#library-results').innerHTML = items || '<p class="library-empty">没有匹配的节点</p>'; return; }
    $('#library-content').innerHTML = `<label class="search">${icon('search')}<input id="node-search" placeholder="搜索节点…" aria-label="搜索节点"><kbd>/</kbd></label><div id="library-results">${items}</div><p class="library-hint">点击或拖入画布添加节点。<br>连接节点，让创意开始流动。</p>`;
  } else if (panel === 'workflows') {
    $('#library-content').innerHTML = `<div class="library-section-label"><span>开始创作</span><b>02</b></div><button class="workflow-card" data-template="image">${icon('image')}<strong>光影之间 · 图生视频</strong><p>参考图像 + 文本 → H3 → 视频预览</p></button><button class="workflow-card" data-template="text">${icon('text')}<strong>灵感成片 · 文生视频</strong><p>文本提示词 → H3 → 视频预览</p></button><button class="button subtle full-button" data-import>${icon('import')}导入工作流 JSON</button><p class="library-hint">当前工作流自动保存在本机。<br>导出 JSON 可备份或迁移到其他设备。</p>`;
  } else {
    $('#library-content').innerHTML = `<div class="library-section-label"><span>仓库示例</span><b>03</b></div>${[['i2va.mp4', '日式餐厅 · 图生视频'], ['t2va.mp4', '文生视频 · H3 示例'], ['ref2va.mp4', '全参考 · H3 示例']].map(([src, label]) => `<button class="asset-item" data-asset="${src}" data-label="${label}"><video src="/assets/${src}#t=0.01" preload="metadata" muted playsinline></video><span>${label}</span><small>仓库原始样片 · 点击预览</small></button>`).join('')}`;
  }
}
function renderInspector() {
  $$('.inspector-tabs button').forEach(b => b.classList.toggle('active', b.dataset.inspector === inspectorTab));
  $('#queue-count').textContent = run ? '1' : '0';
  if (inspectorTab === 'details') {
    const gen = workflow.nodes.find(n => n.type === 'generate'), model = workflow.nodes.find(n => n.type === 'model');
    $('#inspector-content').innerHTML = `<h2 class="detail-heading">${esc(workflow.name.split(' · ')[0])}</h2><p class="dialog-description">节点与生成参数</p>${[['节点数量', workflow.nodes.length], ['连接数量', workflow.edges.length], ['模型', model?.data.model || '未设置'], ['时长', gen ? `${gen.data.duration} 秒` : '未设置'], ['分辨率', gen?.data.resolution || '未设置'], ['画面比例', gen?.data.ratio || '未设置'], ['运行方式', '本地演示']].map(([a, b]) => `<div class="detail-row"><span>${a}</span><span>${esc(b)}</span></div>`).join('')}<button class="button subtle full-button" data-rename>${icon('text')}重命名工作流</button><button class="button subtle full-button" data-export>${icon('export')}导出 JSON</button><div class="helper-card"><h3>${icon('info')} 关于生成</h3><p>当前为可交互的界面演示。模型配置会保存到工作流，真实生成需要接入 H3 推理服务或 MiniMax API。</p></div>`;
    return;
  }
  $('#inspector-content').innerHTML = `<div class="queue-heading"><span>当前任务</span><span class="muted" style="font-size:10px">${run ? '1 个任务' : '暂无运行'}</span></div>${run ? `<div class="queue-item"><strong>正在演示 · ${esc(workflow.name.split(' · ')[0])}</strong><p id="queue-step">${esc(run.label)}</p><div class="queue-progress"><div id="queue-progress-bar" style="width:${run.progress}%"></div></div></div>` : `<div class="queue-empty"><div>${icon('queue')}</div><strong>画布已就绪</strong><p>连接你的灵感<br>点击「演示运行」预览工作流</p></div>`}<div class="section-label"><span>${history.length ? '本次会话' : '精选示例'}</span><span>${history.length ? `${history.length} 次演示` : '01'}</span></div>${history.map(h => `<div class="queue-item"><strong>${icon('check')} 演示完成</strong><p>${esc(h.name)} · ${h.time}<br>使用仓库示例，未调用生成 API</p></div>`).join('')}<div class="sample-card"><div class="sample-card-image"><video src="${sample}#t=0.01" preload="metadata" muted playsinline aria-label="日式餐厅示例封面"></video><span>MADE WITH MINIMAX H3</span></div><div class="sample-card-content"><strong>光影之间，一餐一刻</strong><p>从热气腾腾的拉面，到家人相聚的温暖。用一次焦点转移讲述故事。</p><div><span>图生视频 · 原生音频</span><button data-preview>预览 ${icon('chevron')}</button></div></div></div><div class="helper-card"><h3>${icon('sparkles')} 一个小灵感</h3><p>试试在提示词中写下镜头如何移动、光线如何变化。具体的描述，让每一帧更接近你的想象。</p></div>`;
}
function renderAll() {
  pending = null;
  $('#project-title').textContent = workflow.name; $('#tab-title').textContent = workflow.name;
  $('#canvas-title').textContent = workflow.name.split(' · ')[0];
  const hasImage = workflow.nodes.some(n => n.type === 'image');
  $('#canvas-subtitle').textContent = hasImage ? '从一帧画面，开始一段故事。' : '把想象连接成画面。';
  $('.canvas-context .tag').textContent = hasImage ? '图生视频' : '文生视频';
  renderNodes(); renderInspector(); applyView();
}
function addNode(type, point) {
  if (!TYPE[type]) return;
  if (run) { toast('请先停止演示，再编辑工作流。'); return; }
  if (workflow.nodes.length >= 100) { toast('一个工作流最多支持 100 个节点。'); return; }
  checkpoint();
  const p = point || { x: ($('#canvas').clientWidth / 2 - view.x) / view.zoom - 130, y: ($('#canvas').clientHeight / 2 - view.y) / view.zoom - 80 };
  const n = defaultNode(type, `n${crypto.randomUUID().slice(0, 8)}`, Math.round(p.x), Math.round(p.y));
  workflow.nodes.push(n); selected = n.id; renderNodes(); changed(); toast(`已添加${TYPE[type].title}`);
}
function deleteNode(id) { if (run) return; checkpoint(); workflow.nodes = workflow.nodes.filter(n => n.id !== id); workflow.edges = workflow.edges.filter(e => e.from !== id && e.to !== id); selected = null; pending = null; renderAll(); changed(); }
function connect(node, port, direction) {
  if (run) return;
  if (direction === 'output') { pending = { from: node.id, port, point: socketPoint(node.id, direction, port) }; toast(`点击另一节点的「${PORT[port][0]}」输入端口完成连接；Esc 取消。`); }
  else if (pending) {
    if (pending.port !== port || pending.from === node.id) { toast('端口类型不匹配，请连接同色端口。'); return; }
    checkpoint(); workflow.edges = workflow.edges.filter(e => !(e.to === node.id && e.port === port)); workflow.edges.push({ from: pending.from, to: node.id, port }); pending = null; changed(); renderEdges(); renderMinimap(); toast('节点已连接。');
  } else toast('先点击一个输出端口，再点击这里完成连接。');
}
function downloadFile(content, name, type = 'application/json') { const url = URL.createObjectURL(new Blob([content], { type })); const a = document.createElement('a'); a.href = url; a.download = name; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); }
function exportWorkflow() { downloadFile(JSON.stringify(workflow, null, 2), `${workflow.name.replace(/[<>:"/\\|?*]/g, '-')}.json`); toast('工作流已导出，包含节点、连线和参数。'); }
function openDialog(title, body, actions = '') { $('#dialog').classList.remove('wide-dialog'); $('#dialog-content').innerHTML = `<div class="dialog-heading"><h2>${title}</h2><button class="icon-button" data-close aria-label="关闭对话框">${icon('close')}</button></div>${body}${actions ? `<div class="dialog-actions">${actions}</div>` : ''}`; if (!$('#dialog').open) $('#dialog').showModal(); }
function preview(src = sample, label = '日式餐厅 · 仓库示例') { openDialog(esc(label), `<video class="modal-video" src="${esc(src)}" controls autoplay playsinline></video><p class="dialog-description" style="margin-top:13px;margin-bottom:0">这是仓库随附的 H3 示例视频，并非根据当前提示词生成。</p>`); $('#dialog').classList.add('wide-dialog'); }
function confirmReplace(next) {
  if (run) { toast('请先停止演示，再切换工作流。'); return; }
  openDialog('切换工作流', '<p class="dialog-description">当前工作流会被替换。你可以先导出备份，切换后也可按 Ctrl Z 撤销。</p>', '<button class="button subtle" data-export>导出当前工作流</button><button class="button primary" id="confirm-replace">切换工作流</button>');
  $('#confirm-replace').onclick = () => { checkpoint(); workflow = next; selected = null; renderAll(); fit(); changed(); $('#dialog').close(); toast('工作流已切换。'); };
}
function settings() {
  openDialog('工作台设置', `<p class="dialog-description">MiniMax Flow · 本地节点工作台</p><label class="dialog-row"><span>拖动节点时吸附网格</span><input type="checkbox" id="snap-setting" ${preferences.snap ? 'checked' : ''}></label><label class="dialog-row"><span>演示运行时显示连线动画</span><input type="checkbox" id="animate-setting" ${preferences.animate ? 'checked' : ''}></label><div class="detail-row"><span>运行方式</span><span>演示模式 · 未连接 API</span></div><p class="dialog-description" style="margin-top:16px;margin-bottom:0">演示运行仅检查工作流并播放仓库视频。工作流自动保存在当前浏览器，清除浏览器数据前请导出 JSON。</p>`, '<button class="button primary" id="save-preferences">保存设置</button>');
  $('#save-preferences').onclick = () => { preferences = { snap: $('#snap-setting').checked, animate: $('#animate-setting').checked }; try { localStorage.setItem(`${STORAGE}-preferences`, JSON.stringify(preferences)); toast('设置已保存。'); } catch { toast('设置已应用，本机存储不可用。'); } $('#dialog').close(); };
}
function help() { openDialog('画布操作与快捷键', `<p class="dialog-description">像搭积木一样连接你的 MiniMax 工作流。</p>${[['拖动节点标题', '移动节点'], ['拖动空白画布', '平移视图'], ['滚轮 / 触控板缩放', '缩放画布'], ['输出端口 → 同色输入端口', '创建连接'], ['双击连线', '删除连接'], ['双击画布 / /', '搜索节点'], ['F', '适应画布'], ['Delete / Backspace', '删除所选节点'], ['Ctrl / ⌘ Z', '撤销编辑'], ['Ctrl / ⌘ S', '保存工作流'], ['Ctrl / ⌘ Enter', '开始 / 停止演示']].map(([a, b]) => `<div class="dialog-row"><span>${b}</span><kbd>${a}</kbd></div>`).join('')}`); }
function rename() { openDialog('重命名工作流', `<label class="field-label" for="workflow-name">工作流名称</label><input type="text" id="workflow-name" maxlength="80" value="${esc(workflow.name)}">`, '<button class="button primary" id="confirm-rename">保存名称</button>'); $('#confirm-rename').onclick = () => { const name = $('#workflow-name').value.trim(); if (!name) { toast('请输入工作流名称。'); return; } checkpoint(); workflow.name = name; renderAll(); changed(); $('#dialog').close(); }; }
function validateRun() {
  validateWorkflow(workflow);
  const outputs = workflow.nodes.filter(n => n.type === 'output');
  if (!outputs.length) throw new Error('请添加一个视频预览节点，并连接生成节点。');
  const steps = [], visited = new Set();
  function visit(n) {
    if (visited.has(n.id)) return; visited.add(n.id);
    const incoming = workflow.edges.filter(e => e.to === n.id);
    for (const p of n.type === 'generate' ? ['model', 'text'] : TYPE[n.type].inputs) if (!incoming.some(e => e.port === p)) throw new Error(`${TYPE[n.type].title}缺少「${PORT[p][0]}」输入连接。`);
    if (n.type === 'prompt' && !n.data.text.trim()) throw new Error('请先填写视频提示词。');
    incoming.forEach(e => visit(workflow.nodes.find(node => node.id === e.from)));
    steps.push(n.id);
  }
  outputs.forEach(visit);
  return steps;
}
function setRunUI() {
  $('#run-button').innerHTML = `${icon(run ? 'stop' : 'play')}<span>${run ? '停止演示' : '演示运行'}</span><kbd>Ctrl ↵</kbd>`;
  $('#run-button').classList.toggle('is-running', !!run);
  $('#run-status').textContent = run ? '演示中' : '准备就绪';
  $$('#nodes input, #nodes select, #nodes textarea, #nodes [data-ratio], #nodes [data-upload], #nodes [data-random]').forEach(el => el.disabled = !!run);
  renderInspector(); renderEdges();
}
function stopRun(completed = false) {
  if (!run) return;
  clearTimeout(run.timer); run = null;
  $$('.node.executing').forEach(n => n.classList.remove('executing'));
  setRunUI(); $('#dock-detail').textContent = completed ? '演示完成' : '演示已停止';
  if (!completed) toast('演示已停止。');
}
function startRun() {
  if (run) { stopRun(); return; }
  let steps;
  try { steps = validateRun(); } catch (error) { toast(error.message); return; }
  pending = null; run = { steps, index: 0, progress: 0, label: '检查工作流连接…', timer: null }; inspectorTab = 'queue';
  setRunUI();
  function advance() {
    if (!run) return;
    $$('.node.executing').forEach(n => n.classList.remove('executing'));
    if (run.index >= steps.length) {
      history.unshift({ name: workflow.name, time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }) }); history = history.slice(0, 4);
      stopRun(true); $$('.output-video').forEach(v => { v.currentTime = 0; v.play().catch(() => {}); }); toast('演示完成：正在播放仓库样片，未调用生成 API。'); return;
    }
    const n = workflow.nodes.find(node => node.id === steps[run.index]); document.getElementById(n.id).classList.add('executing');
    run.label = { prompt: '检查文本提示词…', image: '检查参考图像配置…', model: '读取模型配置（不加载权重）…', generate: '演示生成步骤（不调用 API）…', output: '准备播放仓库示例…' }[n.type];
    run.progress = Math.round((run.index + 1) / steps.length * 100); run.index++;
    $('#queue-step').textContent = run.label; $('#queue-progress-bar').style.width = `${run.progress}%`; $('#dock-detail').textContent = `${run.progress}%`;
    run.timer = setTimeout(advance, n.type === 'generate' ? 1700 : 650);
  }
  advance();
}

hydrateIcons(); renderLibrary(); renderAll(); requestAnimationFrame(fit);
$('#nodes').addEventListener('focusin', e => { if (e.target.matches('textarea,input,select')) checkpoint(); });
$('#nodes').addEventListener('input', e => {
  const field = e.target.dataset.field, n = workflow.nodes.find(v => v.id === e.target.closest('.node')?.id);
  if (!field || !n || run) return;
  if (e.target.type === 'number' && !e.target.validity.valid) { e.target.setAttribute('aria-invalid', 'true'); return; }
  e.target.removeAttribute('aria-invalid');
  n.data[field] = e.target.type === 'checkbox' ? e.target.checked : ['seed', 'duration'].includes(field) ? Number(e.target.value) : e.target.value;
  if (field === 'text') $('.char-count', e.target.closest('.node')).textContent = `${n.data.text.length} 字`;
  changed(); if (inspectorTab === 'details') renderInspector();
});
$('#nodes').addEventListener('change', e => { if (e.target.type === 'number' && !e.target.validity.valid) { const n = workflow.nodes.find(v => v.id === e.target.closest('.node').id); e.target.value = n.data[e.target.dataset.field]; e.target.removeAttribute('aria-invalid'); toast('随机种子需为 0 到 2147483647 之间的整数。'); } });
document.addEventListener('click', e => {
  const button = e.target.closest('button'); if (!button) return;
  const d = button.dataset;
  if (d.close !== undefined) $('#dialog').close();
  if (d.export !== undefined) exportWorkflow();
  if (d.import !== undefined) $('#workflow-file').click();
  if (d.rename !== undefined) rename();
  if (d.preview !== undefined) preview();
  if (d.download !== undefined) { const a = document.createElement('a'); a.href = sample; a.download = 'MiniMax-H3-仓库示例.mp4'; a.click(); toast('正在下载仓库原始示例视频。'); }
  if (d.asset) preview(`/assets/${d.asset}`, d.label);
  if (d.template) confirmReplace(defaultWorkflow(d.template));
  if (d.panel) { panel = d.panel; $('#library-content').innerHTML = ''; renderLibrary(); if (window.innerWidth <= 760) $('.workspace').classList.add('library-collapsed'); else $('.workspace').classList.remove('library-collapsed'); requestAnimationFrame(fit); }
  if (d.inspector) { inspectorTab = d.inspector; renderInspector(); }
  if (d.add) addNode(d.add);
  if (d.upload && !run) { imageTarget = d.upload; $('#image-file').click(); }
  if (d.videoToggle) { const v = $('.output-video', document.getElementById(d.videoToggle)); if (v.paused) v.play().catch(() => toast('视频暂时无法播放，请检查本地示例文件。')); else v.pause(); }
  if (d.ratio && !run) { const n = workflow.nodes.find(n => n.id === button.closest('.node').id); checkpoint(); n.data.ratio = d.ratio; $$('.segmented button', button.closest('.node')).forEach(b => { b.classList.toggle('active', b === button); b.setAttribute('aria-pressed', String(b === button)); }); changed(); if (inspectorTab === 'details') renderInspector(); }
  if (d.random && !run) { const n = workflow.nodes.find(n => n.id === d.random); checkpoint(); n.data.seed = crypto.getRandomValues(new Uint32Array(1))[0] % 2147483648; $('[data-field="seed"]', document.getElementById(n.id)).value = n.data.seed; changed(); }
  if (d.nodeMenu && !run) {
    const n = workflow.nodes.find(n => n.id === d.nodeMenu);
    openDialog(TYPE[n.type].title, `<p class="dialog-description">节点 #${esc(n.id.replace(/^n/, ''))} · ${TYPE[n.type].english}</p>`, '<button class="button danger" id="delete-node">删除节点</button><button class="button subtle" id="duplicate-node">复制节点</button>');
    $('#delete-node').onclick = () => { deleteNode(n.id); $('#dialog').close(); };
    $('#duplicate-node').onclick = () => { if (workflow.nodes.length >= 100) { toast('一个工作流最多支持 100 个节点。'); return; } checkpoint(); const copy = structuredClone(n); copy.id = `n${crypto.randomUUID().slice(0, 8)}`; copy.x += 35; copy.y += 35; workflow.nodes.push(copy); selected = copy.id; renderAll(); changed(); $('#dialog').close(); };
  }
  if (d.direction) connect(workflow.nodes.find(n => n.id === button.closest('.node').id), d.port, d.direction);
});
$('#library-content').addEventListener('input', e => { if (e.target.id === 'node-search') renderLibrary(e.target.value); });
$('#library-content').addEventListener('dragstart', e => { const item = e.target.closest('[data-add]'); if (item) { e.dataTransfer.setData('application/minimax-node', item.dataset.add); e.dataTransfer.effectAllowed = 'copy'; } });
$('#canvas').addEventListener('dragover', e => { if ([...e.dataTransfer.types].includes('application/minimax-node')) { e.preventDefault(); e.dataTransfer.dropEffect = 'copy'; } });
$('#canvas').addEventListener('drop', e => { const type = e.dataTransfer.getData('application/minimax-node'); if (TYPE[type]) { e.preventDefault(); addNode(type, worldPoint(e)); } });
$('#canvas').addEventListener('pointerdown', e => {
  if (e.button !== 0 && e.button !== 1) return;
  if (e.target.closest('button,input,textarea,select,video,.canvas-tools,.run-dock,.minimap')) return;
  const node = e.target.closest('.node');
  if (node) { selected = node.id; $$('.node').forEach(n => n.classList.toggle('selected', n.id === selected)); renderMinimap(); }
  else if (!pending) { selected = null; $$('.node.selected').forEach(n => n.classList.remove('selected')); }
  const dragNode = e.target.closest('.node-header') && !run ? workflow.nodes.find(n => n.id === node.id) : null;
  if (node && !dragNode) return;
  if (dragNode) checkpoint();
  gesture = { id: e.pointerId, x: e.clientX, y: e.clientY, node: dragNode, startX: dragNode?.x ?? view.x, startY: dragNode?.y ?? view.y };
  $('#canvas').setPointerCapture(e.pointerId); if (!dragNode) $('#canvas').classList.add('panning'); e.preventDefault();
});
$('#canvas').addEventListener('pointermove', e => {
  if (pending) { pending.point = worldPoint(e); renderEdges(); }
  if (!gesture || gesture.id !== e.pointerId) return;
  const dx = e.clientX - gesture.x, dy = e.clientY - gesture.y;
  if (gesture.node) {
    const n = gesture.node, grid = preferences.snap ? 20 : 1;
    n.x = Math.max(-50000, Math.min(50000, Math.round((gesture.startX + dx / view.zoom) / grid) * grid)); n.y = Math.max(-50000, Math.min(50000, Math.round((gesture.startY + dy / view.zoom) / grid) * grid));
    const el = document.getElementById(n.id); el.style.left = `${n.x}px`; el.style.top = `${n.y}px`; renderEdges(); renderMinimap();
  } else { view.x = gesture.startX + dx; view.y = gesture.startY + dy; applyView(); }
});
function endGesture(e) { if (gesture?.id !== e.pointerId) return; if (gesture.node) changed(); gesture = null; $('#canvas').classList.remove('panning'); if ($('#canvas').hasPointerCapture(e.pointerId)) $('#canvas').releasePointerCapture(e.pointerId); }
$('#canvas').addEventListener('pointerup', endGesture); $('#canvas').addEventListener('pointercancel', endGesture);
$('#canvas').addEventListener('wheel', e => { if (e.target.closest('textarea,select,input')) return; e.preventDefault(); const r = $('#canvas').getBoundingClientRect(); zoomAt(Math.exp(-e.deltaY * .0012), e.clientX - r.left, e.clientY - r.top); }, { passive: false });
function focusSearch() { panel = 'nodes'; $('#library-content').innerHTML = ''; renderLibrary(); $('.workspace').classList.toggle('library-collapsed', window.innerWidth <= 760); $('#node-search').focus(); }
$('#canvas').addEventListener('dblclick', e => { if (e.target.matches('.connection') && !run) { checkpoint(); workflow.edges.splice(Number(e.target.dataset.edge), 1); renderEdges(); changed(); toast('连接已删除，可按 Ctrl Z 撤销。'); } else if (!e.target.closest('.node,button,.minimap,.run-dock')) focusSearch(); });
$('#zoom-in').onclick = () => zoomAt(1.15); $('#zoom-out').onclick = () => zoomAt(1 / 1.15); $('#zoom-reset').onclick = () => zoomAt(1 / view.zoom); $('#fit-button').onclick = fit; $('#minimap').onclick = fit;
$('#minimap-button').onclick = () => $('#minimap').classList.toggle('hidden');
$('#collapse-library').onclick = () => { $('.workspace').classList.toggle('library-collapsed'); requestAnimationFrame(fit); };
$('#toggle-inspector').onclick = () => { $('.workspace').classList.toggle('inspector-collapsed'); requestAnimationFrame(fit); };
$('#save-button').onclick = () => save(true); $('#export-button').onclick = exportWorkflow; $('#run-button').onclick = startRun;
$('#settings-button').onclick = settings; $('#preferences-button').onclick = settings; $('#help-button').onclick = help;
$('#new-workflow').onclick = () => confirmReplace({ version: 1, name: '未命名工作流', nodes: [], edges: [] });
$('#dialog').addEventListener('close', () => { const video = $('.modal-video'); if (video) video.pause(); });
$('#dialog').addEventListener('click', e => { if (e.target === $('#dialog')) { const r = $('#dialog').getBoundingClientRect(); if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) $('#dialog').close(); } });
$('#workflow-file').onchange = async e => {
  const file = e.target.files[0]; e.target.value = ''; if (!file) return;
  if (file.size > 8 * 1024 * 1024) { toast('工作流文件不能超过 8 MB。'); return; }
  try { confirmReplace(validateWorkflow(JSON.parse(await file.text()))); } catch (error) { toast(error instanceof SyntaxError ? '无法读取 JSON，请检查文件格式。' : error.message); }
};
$('#image-file').onchange = async e => {
  const file = e.target.files[0], target = imageTarget; e.target.value = ''; if (!file) return;
  if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type) || file.size > 2 * 1024 * 1024) { toast('请选择小于 2 MB 的 PNG、JPEG 或 WebP 图像。'); return; }
  const reader = new FileReader(); reader.onload = async () => {
    const n = workflow.nodes.find(n => n.id === target); if (!n || run) return;
    const img = new Image(); img.src = reader.result;
    try { await img.decode(); } catch { toast('图像文件损坏或无法读取。'); return; }
    checkpoint(); n.data = { image: reader.result, filename: file.name }; renderNodes(); changed(); toast('参考图像已添加并保存在工作流中。');
  }; reader.onerror = () => toast('图像读取失败。'); reader.readAsDataURL(file);
};
document.addEventListener('keydown', e => {
  if ($('#dialog').open) return;
  const typing = e.target.matches('input,textarea,select,[contenteditable]'), mod = e.ctrlKey || e.metaKey;
  if (mod && e.key.toLowerCase() === 's') { e.preventDefault(); save(true); return; }
  if (mod && e.key === 'Enter') { e.preventDefault(); startRun(); return; }
  if (e.key === 'Escape') { pending = null; renderEdges(); return; }
  if (typing) return;
  if (mod && e.key.toLowerCase() === 'z' && !run) { e.preventDefault(); if (undoStack.length) { workflow = JSON.parse(undoStack.pop()); renderAll(); changed(); toast('已撤销上一步编辑。'); } return; }
  if (['Delete', 'Backspace'].includes(e.key) && selected && !run) { e.preventDefault(); deleteNode(selected); }
  if (e.key.toLowerCase() === 'f') fit();
  if (e.key === '/') { e.preventDefault(); focusSearch(); }
});
window.addEventListener('resize', () => requestAnimationFrame(fit));
window.addEventListener('beforeunload', e => { if (dirty) save(); if (saveFailed) { e.preventDefault(); e.returnValue = ''; } });
