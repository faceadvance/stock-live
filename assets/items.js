// StockItems — ตรรกะหลายสินค้า (ฟังก์ชันล้วน · เทส: node tools/tests/items.test.js)
(function (g) {
  const S = {
    sortItems(items) { return items.slice().sort((a, b) => ((a.sort ?? 100) - (b.sort ?? 100)) || (a.id - b.id)); },
    // ลำดับเลือกตอนเปิด: ?item= → ตัวที่ดูล่าสุด → ตัวแรก
    pickInitial(items, urlSlug, savedSlug) {
      const has = s => !!s && items.some(i => i.slug === s);
      return has(urlSlug) ? urlSlug : has(savedSlug) ? savedSlug : (items[0] ? items[0].slug : null);
    },
    // ตัวถัดไป (วนรอบ) ที่ยังมีของ · ไม่มี → null
    nextInStock(items, slug) {
      const n = items.length, i = items.findIndex(x => x.slug === slug);
      for (let k = 1; k <= n; k++) { const it = items[(i + k + n) % n]; if (it.slug !== slug && it.qty_left > 0) return it.slug; }
      return null;
    },
    step(items, slug, dir) {
      if (!items.length) return null;
      const i = items.findIndex(x => x.slug === slug);
      if (i < 0) return items[0].slug;
      return items[(i + dir + items.length) % items.length].slug;
    },
    // realtime: แทน/เพิ่มแถว · ถูกปิด (active=false) → ตัดออก
    upsert(items, row) {
      const rest = items.filter(i => i.slug !== row.slug);
      return row.active === false ? rest : S.sortItems([...rest, row]);
    },
    // ทิศปัด: ซ้าย = +1 (ตัวถัดไป) · สั้นกว่า min หรือแนวตั้งมากกว่า = 0
    swipeDir(dx, dy, min = 50) {
      if (Math.abs(dx) < min || Math.abs(dx) <= Math.abs(dy)) return 0;
      return dx < 0 ? 1 : -1;
    },
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = S; else g.StockItems = S;
})(this);
