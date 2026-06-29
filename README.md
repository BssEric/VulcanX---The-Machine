# VULCAN X — Premium Laptop Landing Page

## 📋 Visão Geral

VULCAN X é um site premium de apresentação de produto com animações avançadas, video scrubbing interativo e experiência mobile-first otimizada. Construído com vanilla HTML/CSS/JavaScript sem dependências de framework.

**Principais Características:**
- ✨ Animações GSAP com ScrollTrigger e Flip
- 🎬 Vídeo hero com transição cinematográfica
- 🎮 Scrubbing interativo (S02) controlado por scroll
- ♿ Acessibilidade completa (A11y)
- 📱 Mobile-first responsivo
- 🚀 Performance otimizada (lazy loading, schema.org)

---

## 🏗️ Estrutura do Projeto

```
Notebook - Vulcan/
├── vulcanx.html        # HTML principal
├── style.css           # Estilos (design system monochrome)
├── script.js           # Lógica GSAP/Lenis/módulos
├── assets/             # Imagens, vídeos, ícones
│   ├── hero-video.mp4
│   ├── explodevideo.mp4
│   ├── *.png          # Imagens dos produtos
│   └── fav1.png       # Favicon
├── .vscode/            # Configurações VS Code (opcional)
└── README.md           # Este arquivo
```

### 📄 Páginas e Seções

| Seção | ID | Descrição |
|-------|----|-|
| **Hero** | `#hero` | Vídeo fullscreen + título VULCAN |
| **Máquina** | `#s01` | Galeria de detalhes + specs |
| **Anatomia** | `#s02` | Vídeo scrub (exploração interna) |
| **Unboxing** | `#s03` | Abertura 3D da caixa |
| **Configurador** | `#s04` | E-commerce (setup customizável) |

---

## 🚀 Como Rodar

### Desenvolvimento Local

1. **Abrir com Live Server (VS Code)**
   - Instale a extensão "Live Server" (Five Server, Live Server)
   - Clique com botão direito em `vulcanx.html`
   - Selecione "Open with Live Server"
   - Navegador abrirá em `http://localhost:5500`

2. **Python SimpleHTTPServer**
   ```bash
   cd "Notebook - Vulcan"
   python -m http.server 8000
   # Abra http://localhost:8000/vulcanx.html
   ```

3. **Node.js http-server**
   ```bash
   npm install -g http-server
   http-server
   ```

### Requisitos

- **Browser moderno**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Conexão de internet**: Para Google Fonts e CDNs (GSAP, Lenis)
- **Resolução mínima**: 320px (mobile)

---

## 📦 Dependências Externas

### CDNs Inclusos

1. **Google Fonts**
   - `Barlow` (300, 400, 500)
   - `Barlow Condensed` (100-900, italic)

2. **GSAP (GreenSock Animation Platform)**
   - ScrollTrigger: Scroll-driven animations
   - Flip: Layout morphing (video travel)
   - *Incluídos via CDN no `<head>`*

3. **Lenis**
   - Smooth scroll com inércia
   - *Incluído via CDN*

### Nenhuma dependência npm necessária
Todo o código é vanilla JS — nenhum build ou transpilação necessária.

---

## 🎨 Design System

### Tokens CSS (`:root`)

```css
--void:       #000000   /* Fundo preto profundo */
--carbon:     #0f0f0f
--steel:      #2a2a2a
--fog:        #6a6a6a
--ice:        #f0f0f0
--white:      #ffffff
--accent:     #ff2a2a   /* Vermelho vivo — CTA interativo */

--ff-display: 'Barlow Condensed'  /* Títulos */
--ff-body:    'Barlow'            /* Corpo */

--ease-expo:  cubic-bezier(.19,1,.22,1)   /* Power out */
--ease-back:  cubic-bezier(.34,1.56,.64,1) /* Bounce */
```

### Paleta
- **Monochrome + Red**: Preto/branco com acento vermelho (#ff2a2a)
- **Grain Overlay**: Textura de ruído SVG 4.5% opacity
- **Modo Noturno**: Nativo (sem light mode)

---

## 🎬 Módulos JavaScript

### 1. **Lenis Smooth Scroll**
- Lerp: 0.08 (inércia suave)
- Integrado com GSAP ScrollTrigger
- Respeitando `prefers-reduced-motion`

### 2. **Cursor Magnético**
- Cursor custom (dot + ring)
- Grow ao hover em `<a>`, `<button>`, `.cfg-btn`, `.spec-card`
- Hide ao sair da janela

### 3. **Preloader**
- Animação clip-path
- Progresso visual (%)
- Reveal cinematográfico do hero

### 4. **Hero Entrance**
- Título em linhas (staggered)
- Sub-título + scroll indicator
- Duração: ~2.5s total

### 5. **Video Travel (Hero → S01)**
- Fase 1: Detach hero video → fixed
- Fase 2: Vôo suavizado com keyframes
- Fase 3: Flip landing em #vid-anchor
- Bidirecional (scroll up/down)

### 6. **Video Scrub (S02)**
- Controle de `currentTime` via scroll
- Suporta mobile (swipe/scroll alternativo)
- Progresso visual lateral

### 7. **Unboxing (S03)**
- Reveal de metades de caixa
- Transição para produto
- Texto animado

### 8. **Configurador (S04)**
- Grid de opções de customização
- Preço em tempo real
- Mobile: sticky CTA no rodapé

### 9. **Mobile Module**
- Viewport height fix (iOS Safari)
- Hamburger + drawer com GSAP
- Touch feedback
- Reduced motion support

---

## ♿ Acessibilidade

### A11y Implementadas

- ✅ **Skip Link**: Pular para conteúdo (#s01)
- ✅ **aria-hidden**: Cursor custom, decorativos
- ✅ **aria-label**: Buttons (hambúrguer, etc)
- ✅ **aria-expanded**: Mobile drawer toggle
- ✅ **role="status"**: Preloader com `aria-live="polite"`
- ✅ **Keyboard navigation**: Tab, Enter, Esc
- ✅ **Focus visible**: Outline customizado (vermelho)
- ✅ **prefers-reduced-motion**: Animations desabilitadas
- ✅ **Contraste**: WCAG AA (4.5:1 mínimo)
- ✅ **Screen reader**: Semântica HTML válida

### Teste Manual

1. **Teclado**: Tab → Shift+Tab, Enter em CTAs
2. **Screen Reader**: NVDA (Windows), JAWS, VoiceOver (macOS)
3. **DevTools**: Lighthouse → Accessibility > 90

---

## 🚄 Performance

### Otimizações Implementadas

1. **Lazy Loading**
   - `loading="lazy"` em imagens S01-S04
   - Vídeo scrub: `preload="metadata"` (não `auto`)

2. **CSS Crítico**
   - Grain overlay otimizado
   - Will-change apenas em elementos animados
   - Backdrop-filter com fallback

3. **Code Splitting**
   - Try-catch em cada módulo (Lenis, GSAP, Mobile)
   - CONFIG centralizado
   - Error logging em console

4. **Network**
   - Google Fonts: preconnect + display=swap
   - CDNs: GSAP, Lenis (versões Latest)
   - Favicon: múltiplos formatos

### Lighthouse Targets

- **LCP**: < 2.5s (hero video carregado)
- **FID**: < 100ms (scroll suave)
- **CLS**: < 0.1 (sem layout shifts)
- **Accessibility**: 90+
- **Best Practices**: 85+

---

## 🔍 SEO & Meta

### Implementado

- ✅ `meta name="description"` (160 chars)
- ✅ Open Graph (og:title, og:image, og:description, og:url)
- ✅ Twitter Card (twitter:card, twitter:image)
- ✅ Schema.org JSON-LD (Product)
- ✅ `meta name="robots"` (index, follow)
- ✅ `theme-color` + `color-scheme: dark`

### TODO (Futuro)

- [ ] Sitemap.xml
- [ ] robots.txt
- [ ] Canonical tags
- [ ] Breadcrumb schema
- [ ] Analytics (GA4)

---

## 🔒 Segurança

### Headers Recomendados (via servidor)

```
Content-Security-Policy: script-src 'self' https://cdnjs.cloudflare.com https://cdn.jsdelivr.net
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
```

### Checklist

- ✅ Nenhum `eval()` ou `innerHTML` com user input
- ✅ Eventos via `addEventListener` (XSS safe)
- ✅ Favicon e assets com versioning (cache busting)
- [ ] Audit npm (GSAP, Lenis) → `npm audit`

---

## 📱 Responsividade

### Breakpoints

- **Mobile**: 320px - 767px
  - Stack layout
  - Touch targets ≥ 44×44px
  - Hambúrguer menu
  - Sticky bottom CTA

- **Tablet**: 768px - 1023px
  - Grid 2 colunas
  - Drawer normal
  - Specs simplificados

- **Desktop**: 1024px+
  - Grid full
  - Sticky nav
  - Animações full power

### Testado em

- ✅ iPhone SE, 12, 14 (Safari)
- ✅ Chrome Android 12+
- ✅ iPad Air/Pro
- ✅ Desktop: Chrome, Firefox, Safari, Edge

---

## 🛠️ Troubleshooting

### "Vídeo não carrega"
1. Verificar caminho: `assets/hero-video.mp4` existe?
2. Verificar MIME type: `.mp4` é `video/mp4`?
3. Testar em rede local vs online (CORS?)

### "Scroll scrolling não smooth"
1. Verificar se Lenis inicializou (console: sem erro)
2. Testar com `lerp: 0.1` (mais rápido) em mobile
3. Desabilitar extensões de browser (conflito?)

### "Cursor custom não aparece"
1. Verificar CSS: `body { cursor: none; }`
2. Verificar se `#cur-dot` e `#cur-ring` existem no DOM
3. Console: `typeof gsap !== 'undefined'`?

### "Mobile drawer não fecha"
1. Verificar classe `.open` aplicada/removida
2. Testar ESC key em console: `document.body.dispatchEvent(new KeyboardEvent('keydown', {key: 'Escape'}))`
3. Verificar `aria-expanded` toggle

---

## 📚 Referências

- [GSAP Docs](https://greensock.com/docs/)
- [Lenis Docs](https://lenis.darkroom.engineering/)
- [MDN - Web Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- [Web.dev Performance](https://web.dev/performance/)
- [Schema.org](https://schema.org/)

---

## 📝 License & Attribution

- Design: Premium luxury aesthetic (Awwwards-inspired)
- Code: Vanilla (HTML5, CSS3, JS ES6+)
- Fonts: Google Fonts (open source)
- Libraries: GSAP (comercial), Lenis (MIT)

---

## 👨‍💻 Changelog

### v1.0 (Initial Release)
- ✅ Hero video + preloader
- ✅ Video travel animation (Flip)
- ✅ Video scrub (S02)
- ✅ Unboxing reveal (S03)
- ✅ Mobile responsive
- ✅ A11y + SEO

### v1.1 (Optimization Update)
- ✅ Meta tags + schema.org
- ✅ Lazy loading imagens
- ✅ Error handling JS
- ✅ prefers-reduced-motion support
- ✅ Skip link + aria-hidden dinâmico
- ✅ CONFIG centralizado

### v1.2 (Planned)
- [ ] Internacionalization (i18n)
- [ ] Dark/light theme toggle
- [ ] Analytics integration
- [ ] PWA (manifest, service worker)
- [ ] Build tool (Vite/Webpack)

---

## 📞 Suporte

Dúvidas? Problemas?
1. Verificar console do navegador (F12)
2. Testar em outro browser
3. Limpar cache (Ctrl+Shift+Delete)
4. Verificar network tab (Assets carregando?)

---

**Última atualização**: Junho 2026  
**Mantido por**: Tim Copilot  
**Status**: ✅ Production-Ready
