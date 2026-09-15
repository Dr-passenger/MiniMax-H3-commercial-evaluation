// Run: node check.mjs <absolute path to a Playwright installation>
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { writeFile, readFile, unlink } from 'node:fs/promises';
const require = createRequire(import.meta.url);
const { chromium } = require(process.argv[2] || 'playwright');
const browser = await chromium.launch({ headless: true, ...(process.env.BROWSER_PATH ? { executablePath: process.env.BROWSER_PATH } : process.platform === 'win32' ? { channel: 'msedge' } : {}) });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, acceptDownloads: true });
const errors = [];
page.on('pageerror', error => errors.push(error.message));
const base = process.env.TEST_URL || 'http://127.0.0.1:8188';
const waitSave = () => page.waitForFunction(() => document.querySelector('#save-status').textContent.startsWith('已保存'));
const stored = () => page.evaluate(() => JSON.parse(localStorage.getItem('minimax-flow-v1')));
try {
  await page.goto(base);
  await page.locator('.node').last().waitFor();
  assert.equal(await page.locator('.node').count(), 5);
  assert.equal(await page.locator('.connection').count(), 4);
  await page.locator('#n1 textarea').fill('晨光洒在森林中，镜头缓缓向前推进。');
  await page.locator('#n4 [data-field="duration"]').selectOption('10');
  await page.locator('#n4 [data-ratio="9:16"]').click();
  await waitSave();
  await page.reload();
  assert.equal(await page.locator('#n1 textarea').inputValue(), '晨光洒在森林中，镜头缓缓向前推进。');
  assert.equal(await page.locator('#n4 [data-field="duration"]').inputValue(), '10');
  assert.equal(await page.locator('#n4 [data-ratio="9:16"]').getAttribute('aria-pressed'), 'true');

  const beforeDrag = await page.locator('#n1').evaluate(n => n.style.left);
  const head = await page.locator('#n1 .node-header').boundingBox();
  await page.mouse.move(head.x + 40, head.y + 18); await page.mouse.down(); await page.mouse.move(head.x + 65, head.y + 35, { steps: 6 }); await page.mouse.up();
  assert.notEqual(await page.locator('#n1').evaluate(n => n.style.left), beforeDrag);
  await page.keyboard.press('Control+z');
  assert.equal(await page.locator('#n1').evaluate(n => n.style.left), beforeDrag);

  await page.locator('#node-search').fill('文本');
  assert.equal(await page.locator('.library-item').count(), 1);
  await page.locator('[data-add="prompt"]').click();
  assert.equal(await page.locator('.node').count(), 6);
  await page.locator('#canvas').focus(); await page.keyboard.press('Delete');
  assert.equal(await page.locator('.node').count(), 5);
  await page.locator('#node-search').fill('');

  await page.locator('#n1 .node-port.output').click();
  await page.locator('#n4 .node-port.input[data-port="image"]').click();
  assert.match(await page.locator('#toast').textContent(), /类型不匹配/);
  await page.locator('#n4 .node-port.input[data-port="text"]').click();
  assert.equal(await page.locator('.connection').count(), 4);
  assert.equal(await page.locator('.connection.pending').count(), 0);

  await page.locator('#n1 textarea').fill('');
  await page.locator('#run-button').click();
  assert.match(await page.locator('#toast').textContent(), /填写视频提示词/);
  assert.equal(await page.locator('#queue-count').textContent(), '0');
  await page.locator('#n1 textarea').fill('晨光洒在森林中，镜头缓缓向前推进。');
  await page.locator('#run-button').click();
  assert.equal(await page.locator('#queue-count').textContent(), '1');
  await page.waitForFunction(() => document.querySelector('#dock-detail').textContent === '演示完成', { timeout: 12000 });
  assert.equal(await page.locator('#queue-count').textContent(), '0');
  assert.match(await page.locator('#inspector-content').textContent(), /未调用生成 API/);
  await page.locator('#run-button').click(); await page.locator('#run-button').click();
  assert.equal(await page.locator('#queue-count').textContent(), '0');

  await waitSave();
  const downloadPromise = page.waitForEvent('download'); await page.locator('#export-button').click();
  const download = await downloadPromise; const exported = JSON.parse(await readFile(await download.path(), 'utf8'));
  assert.equal(exported.nodes.length, 5); assert.equal(exported.edges.length, 4);
  await writeFile('check-import.json', JSON.stringify({ ...exported, name: '导入校验工作流' }));
  await page.locator('#workflow-file').setInputFiles('check-import.json');
  await page.locator('#confirm-replace').click();
  assert.equal(await page.locator('#project-title').textContent(), '导入校验工作流');
  await waitSave(); assert.equal((await stored()).name, '导入校验工作流');
  await unlink('check-import.json');
  await writeFile('check-invalid.json', JSON.stringify({ ...exported, nodes: [{ ...exported.nodes[0], id: '"><script>alert(1)</script>' }] }));
  await page.locator('#workflow-file').setInputFiles('check-invalid.json');
  await page.waitForFunction(() => document.querySelector('#toast').textContent.includes('无效'));
  assert.equal(await page.locator('dialog[open]').count(), 0);
  await unlink('check-invalid.json');

  const image = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=', 'base64');
  const fileChooserPromise = page.waitForEvent('filechooser'); await page.locator('#n2 [data-upload]').click();
  await (await fileChooserPromise).setFiles({ name: 'reference.png', mimeType: 'image/png', buffer: image });
  await page.locator('#n2 img.reference-preview').waitFor(); await waitSave();
  assert.equal((await stored()).nodes.find(n => n.id === 'n2').data.filename, 'reference.png');

  await page.locator('[data-preview]').first().click();
  await page.locator('.modal-video').waitFor(); await page.keyboard.press('Escape');
  assert.equal(await page.locator('dialog[open]').count(), 0);
  await page.locator('#n1 .node-header').click(); await page.locator('#canvas').focus(); await page.keyboard.press('Delete');
  await page.locator('#run-button').click();
  assert.match(await page.locator('#toast').textContent(), /缺少/);
  await page.keyboard.press('Control+z');

  const desktopOverflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
  assert.equal(desktopOverflow, false);
  await waitSave();
  await page.evaluate(() => localStorage.clear()); await page.reload();
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'preview-desktop.png' });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(350);
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
  assert.equal(await page.locator('#run-button').isVisible(), true);
  await page.locator('[data-panel="nodes"]').click(); assert.equal(await page.locator('#node-search').isVisible(), true);
  await page.locator('#collapse-library').click();
  await page.screenshot({ path: 'preview-mobile.png' });
  const range = await page.request.get(`${base}/assets/i2va.mp4`, { headers: { Range: 'bytes=0-99' } });
  assert.equal(range.status(), 206); assert.equal((await range.body()).length, 100);
  assert.equal((await page.request.get(`${base}/server.mjs`)).status(), 403);
  assert.equal((await page.request.post(base)).status(), 405);
  assert.deepEqual(errors, []);
  console.log('PASS: persistence, parameters, drag, undo, search, nodes, connection validation, run/stop, import/export, invalid input, image upload, preview, responsive layout, static server.');
} finally { await browser.close(); }
