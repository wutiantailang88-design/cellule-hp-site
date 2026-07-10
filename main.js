'use strict';

/* ============================================================
   メニューデータ
   imgUrl: loremflickr.com でキーワード一致の料理写真を取得
   ============================================================ */

/* images.unsplash.com CDN — 特定フォトIDで確実に料理写真を取得 */
const UNS = (id, w = 600, h = 400) =>
  `https://images.unsplash.com/${id}?w=${w}&h=${h}&fit=crop&q=80`;

const MENU_DATA = {
  cake: [
    {
      name: 'いちごのショートケーキ',
      desc: '米粉を使ったふわっとしたスポンジに、甘みを抑えたクリームと新鮮ないちごを重ねた定番の一品。',
      price: '¥580〜',
      imgUrl: UNS('photo-1488477181946-6428a0291777'), // colorful pastries / macarons
    },
    {
      name: '洋梨のショートケーキ',
      desc: '旬の洋梨をふんだんに使ったショートケーキ。白砂糖不使用の優しい甘さが特徴です。',
      price: '¥620〜',
      imgUrl: UNS('photo-1551024506-0bccd828d307'), // elegant cream pastry
    },
    {
      name: 'クレームブリュレエクレア',
      desc: 'グルテンフリー生地で作ったエクレアにたっぷりのカスタードクリームを詰めた人気商品。',
      price: '¥480〜',
      imgUrl: UNS('photo-1571115177098-24ec42ed204d'), // eclair / choux pastry
    },
    {
      name: 'モンブラン（季節限定）',
      desc: '栗の風味豊かなモンブラン。季節限定でご提供するCelluleの自信作です。',
      price: '¥650〜',
      imgUrl: UNS('photo-1578985545062-69928b1d9587'), // layered cake / dessert
    },
  ],
  lunch: [
    {
      name: 'グルテンフリーランチプレート',
      desc: '旬の野菜をたっぷり使ったメインディッシュにスープが付いた体に優しいランチセット。',
      price: '¥1,200〜',
      imgUrl: UNS('photo-1547592166-23ac45744acd'), // healthy food plate
    },
    {
      name: 'グルテンフリーキッシュ',
      desc: '米粉のパイ生地で作ったキッシュ。野菜と卵の優しい味わいが楽しめます。',
      price: '¥1,000〜',
      imgUrl: UNS('photo-1499028344343-cd173ffc68a9'), // savory tart / quiche
    },
  ],
  drink: [
    {
      name: '季節のハーブティー',
      desc: '国産のハーブを使った自家製ブレンドティー。ケーキとの相性も抜群です。',
      price: '¥500',
      imgUrl: UNS('photo-1544787219-7f47ccb76574'), // herbal tea in cup
    },
    {
      name: 'オーガニックコーヒー',
      desc: '厳選したオーガニック豆を丁寧にハンドドリップ。深みのある香りをお楽しみください。',
      price: '¥480',
      imgUrl: UNS('photo-1495214783159-3503fd1b572d'), // latte art
    },
    {
      name: 'フレッシュジュース',
      desc: '旬のフルーツを搾りたてで。砂糖不使用の自然な甘さをどうぞ。',
      price: '¥520',
      imgUrl: UNS('photo-1556679343-c7306c1976bc'), // fresh juice / smoothie
    },
  ],
};

/* ============================================================
   1. 画像設定
   ============================================================ */

function setImage(imgEl, url, fallbackSeed, alt = '') {
  if (!imgEl) return;
  imgEl.alt = alt;
  imgEl.src = url;
  imgEl.onerror = () => {
    const fallback = `https://picsum.photos/seed/${fallbackSeed}/600/400`;
    if (imgEl.src !== fallback) imgEl.src = fallback;
  };
}

function initHeroImage() {
  const heroBg = document.getElementById('heroBg');
  if (!heroBg) return;

  const url      = 'https://loremflickr.com/1920/1080/patisserie,cake,bakery,sweet?lock=1';
  const fallback = 'https://picsum.photos/seed/patisserie/1920/1080';

  const probe = new Image();
  probe.onload = () => {
    heroBg.style.backgroundImage = `url("${probe.src}")`;
    heroBg.classList.add('is-loaded');
  };
  probe.onerror = () => {
    if (probe.src !== fallback) {
      probe.src = fallback;
    } else {
      heroBg.style.background = 'linear-gradient(135deg, #2C1A0E 0%, #5a3825 100%)';
      heroBg.classList.add('is-loaded');
    }
  };
  probe.src = url;
}

function initAboutImage() {
  const aboutImg = document.getElementById('aboutImg');
  if (!aboutImg) return;
  setImage(
    aboutImg,
    UNS('photo-1495474472287-4d71bcdd2085', 800, 1000), // cafe interior / bakery
    43,
    'Cellule カフェの落ち着いた店内'
  );
}

/* ============================================================
   2. メニューカード生成
   ============================================================ */

let currentTab = 'cake';

async function renderMenuCards(tab) {
  const grid = document.getElementById('menuGrid');
  if (!grid) return;

  const items = MENU_DATA[tab] || [];
  grid.innerHTML = '';

  const cards = items.map((item) => {
    const card = document.createElement('article');
    card.className = 'menu-card reveal';
    card.innerHTML = `
      <div class="menu-card__img">
        <img src="${item.imgUrl}" alt="${item.name}" loading="lazy">
      </div>
      <div class="menu-card__body">
        <h3 class="menu-card__name">${item.name}</h3>
        <p class="menu-card__desc">${item.desc}</p>
        <p class="menu-card__price">${item.price}</p>
      </div>
    `;
    grid.appendChild(card);

    const imgEl = card.querySelector('img');
    const seed  = Math.abs(item.name.split('').reduce((a, c) => a + c.charCodeAt(0), 0));
    imgEl.onerror = () => {
      const fallback = `https://picsum.photos/seed/${seed}/600/400`;
      if (imgEl.src !== fallback) imgEl.src = fallback;
    };

    return card;
  });

  requestAnimationFrame(() => {
    cards.forEach((card) => observeReveal(card));
    cards.forEach((card) => {
      const rect = card.getBoundingClientRect();
      if (rect.top < window.innerHeight) card.classList.add('is-visible');
    });
  });
}

function initMenuTabs() {
  const tabs = document.querySelectorAll('.menu__tab');
  tabs.forEach((tab) => {
    tab.addEventListener('click', async () => {
      tabs.forEach((t) => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      currentTab = tab.dataset.tab;
      await renderMenuCards(currentTab);
    });
  });
}

/* ============================================================
   4. Intersection Observer（スクロールアニメーション）
   ============================================================ */

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px',
  }
);

function observeReveal(el) {
  revealObserver.observe(el);
}

function initRevealObserver() {
  document.querySelectorAll('.reveal, .fade-in').forEach((el) => {
    observeReveal(el);
  });
}

/* ============================================================
   5. ナビゲーション
   ============================================================ */

function initNavScroll() {
  const nav = document.getElementById('nav');
  if (!nav) return;

  const onScroll = () => {
    nav.classList.toggle('is-scrolled', window.scrollY > 60);
  };

  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

function initHamburger() {
  const toggle = document.getElementById('navToggle');
  const menu   = document.getElementById('navMenu');
  if (!toggle || !menu) return;

  toggle.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('is-open');
    toggle.classList.toggle('is-open', isOpen);
    toggle.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      menu.classList.remove('is-open');
      toggle.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });
}

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href').slice(1);
      const target   = document.getElementById(targetId);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

/* ============================================================
   エントリーポイント
   ============================================================ */
async function main() {
  initNavScroll();
  initHamburger();
  initSmoothScroll();
  initRevealObserver();

  initHeroImage();
  initAboutImage();

  await renderMenuCards(currentTab);

  initMenuTabs();
}

document.addEventListener('DOMContentLoaded', main);
