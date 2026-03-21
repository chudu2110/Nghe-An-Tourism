import { destinations, dictionary, experiences, foodAndCulture } from '../data/ngheAnData';

export type SiteDoc = {
  id: string;
  title: string;
  path: string;
  kind: string;
  texts: string[];
};

export type SiteSearchResult = {
  doc: SiteDoc;
  score: number;
  snippet?: string;
};

type T = (key: string, params?: Record<string, string | number>) => string;

function fold(input: string) {
  return input
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'd')
    .toLowerCase()
    .trim();
}

function tokenize(query: string) {
  return fold(query)
    .split(/[\s,.;:!?()"'[\]{}<>/\\|_+=*&^%$#@~-]+/g)
    .map((t) => t.trim())
    .filter(Boolean);
}

function bestSnippet(texts: string[], tokens: string[]) {
  if (tokens.length === 0) return undefined;
  for (const text of texts) {
    const hay = fold(text);
    if (tokens.some((tk) => hay.includes(tk))) return text;
  }
  return texts[0];
}

export function buildSiteDocs(t: T): SiteDoc[] {
  const docs: SiteDoc[] = [];

  destinations.forEach((d) => {
    docs.push({
      id: `destination:${d.id}`,
      title: t(d.name),
      path: '/destinations',
      kind: t('Điểm đến'),
      texts: [t(d.description), t(d.festival), t(d.name)],
    });
  });

  experiences.forEach((e) => {
    docs.push({
      id: `experience:${e.id}`,
      title: t(e.name),
      path: '/experiences',
      kind: t('Trải nghiệm'),
      texts: [t(e.description), t(e.name)],
    });
  });

  foodAndCulture.forEach((f) => {
    docs.push({
      id: `foodcat:${f.id}`,
      title: t(f.name),
      path: '/food-culture',
      kind: t('Ẩm thực & Văn hóa'),
      texts: [t(f.description), t(f.name)],
    });
  });

  docs.push({
    id: 'food:nhut-thanh-chuong',
    title: t('Nhút Thanh Chương'),
    path: '/food-culture#nhut-thanh-chuong',
    kind: t('Ẩm thực & Văn hóa'),
    texts: [t('Món ăn dân dã làm từ xơ mít non, biểu tượng của sự chắt chiu.'), t('Nhút Thanh Chương')],
  });

  docs.push({
    id: 'food:banh-muot-thanh-chuong',
    title: t('Bánh Mướt Thanh Chương'),
    path: '/food-culture#banh-muot-thanh-chuong',
    kind: t('Ẩm thực & Văn hóa'),
    texts: [t('Món ăn sáng quốc dân'), t('Bánh Mướt Thanh Chương')],
  });

  docs.push({
    id: 'food:sup-luon-vinh',
    title: t('Súp Lươn Vinh -') + ' ' + t('Đánh thức mọi giác quan.'),
    path: '/food-culture#sup-luon-vinh',
    kind: t('Ẩm thực & Văn hóa'),
    texts: [
      t('Thịt lươn đồng béo ngậy, hành tăm thơm nồng và vị cay đặc trưng tạo nên một trải nghiệm ẩm thực không thể nào quên khi đặt chân đến thành phố Vinh.'),
      t('Súp Lươn Vinh -'),
    ],
  });

  docs.push({
    id: 'about:site-mission',
    title: t('Nghệ An Travel - Cổng thông tin du lịch toàn diện.'),
    path: '/about',
    kind: t('Giới thiệu'),
    texts: [
      t('Website này được xây dựng với mong muốn cung cấp cho du khách trong và ngoài nước những thông tin chính xác, đầy đủ và hấp dẫn nhất về du lịch Nghệ An.'),
      t('Từ những điểm đến nổi tiếng đến những góc khuất hoang sơ, chúng tôi hy vọng sẽ là người bạn đồng hành tin cậy trên mỗi bước chân của bạn.'),
      t('"Chúng tôi tin rằng Nghệ An có một sức hút kỳ lạ, một sự kết hợp hoàn hảo giữa thiên nhiên hùng vĩ và bề dày lịch sử văn hóa."'),
    ],
  });

  docs.push({
    id: 'planning:hero',
    title: t('Lên kế hoạch'),
    path: '/planning',
    kind: t('Kế hoạch'),
    texts: [t('Từ lịch trình chi tiết đến phương thức di chuyển, chúng tôi chuẩn bị mọi thứ để bạn có một chuyến đi Xứ Nghệ trọn vẹn nhất.')],
  });

  docs.push({
    id: 'dictionary:hero',
    title: t('Từ điển'),
    path: '/dictionary',
    kind: t('Thông tin'),
    texts: [t('Tiếng Nghệ không chỉ là ngôn ngữ, đó là một phần tâm hồn của người dân nơi đây. Khám phá sự thú vị và ấm áp của phương ngữ xứ Nghệ.')],
  });

  dictionary.forEach((w) => {
    docs.push({
      id: `dialect:${w.word}`,
      title: w.word,
      path: '/dictionary',
      kind: t('Từ điển'),
      texts: [w.meaning, w.example],
    });
  });

  docs.push({
    id: 'map:hero',
    title: t('Bản đồ'),
    path: '/map',
    kind: t('Thông tin'),
    texts: [t('Tìm điểm đến, món ăn, di tích...')],
  });

  return docs;
}

export function searchSite(docs: SiteDoc[], query: string, limit = 10): SiteSearchResult[] {
  const q = query.trim();
  if (!q) return [];
  const qFold = fold(q);
  const tokens = tokenize(q);

  const scored = docs
    .map((doc) => {
      const titleFold = fold(doc.title);
      const textsFold = doc.texts.map((x) => fold(x));
      let score = 0;

      if (qFold && titleFold.includes(qFold)) score += 20;
      if (qFold && textsFold.some((x) => x.includes(qFold))) score += 8;

      for (const tk of tokens) {
        if (!tk) continue;
        if (titleFold.includes(tk)) score += 6;
        if (textsFold.some((x) => x.includes(tk))) score += 2;
      }

      if (score <= 0) return null;
      const snippet = bestSnippet(doc.texts, tokens);
      const result: SiteSearchResult = { doc, score, ...(snippet ? { snippet } : {}) };
      return result;
    })
    .filter((x): x is SiteSearchResult => x !== null)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  return scored;
}
