# ⚡ NexFlow Moçambique — Landing Page

## Estrutura do Projecto

```
nexflow/
├── index.html          # Página principal (HTML5 + SEO + Schema.org)
├── css/
│   └── style.css       # Todos os estilos (CSS3 + Custom Properties)
├── js/
│   └── main.js         # JavaScript (Vanilla JS, sem dependências)
├── images/             # (adicionar imagens aqui)
│   ├── og-image.png    # Imagem para redes sociais (1200×630px)
│   └── logo.png        # Logo para schema.org
└── README.md           # Este ficheiro
```

## Stack Técnica

| Tecnologia | Uso |
|---|---|
| **HTML5** | Estrutura semântica, acessibilidade (ARIA), SEO |
| **CSS3** | Estilos, animações, glassmorphism, responsivo |
| **Vanilla JS** | Interactividade, scroll reveal, FAQ accordion |

**Sem frameworks. Sem dependências. Carregamento ultrarrápido.**

## Funcionalidades SEO

- Meta tags completas (title, description, keywords)
- Open Graph para redes sociais (Facebook, LinkedIn)
- Twitter Card
- Schema.org (LocalBusiness, FAQPage, Offer)
- Canonical URL
- `lang="pt-MZ"` para localização correcta
- Semântica HTML correcta (h1→h2→h3, sections, articles)
- Atributos `aria-label`, `role`, `aria-expanded` para acessibilidade
- Velocidade optimizada (fontes com `preconnect`, JS com `defer`)

## Configuração

### 1. Actualizar URLs
Substituir todos os `https://nexflow.co.mz` pelo domínio real em `index.html`.

### 2. Links de Pagamento Zenofy
Substituir os links de pagamento no `index.html`:
```html
<!-- Linha actual (exemplo): -->
href="https://zenofy.com/pay/nexflow-starter"

<!-- Substituir pelo link real gerado no Zenofy: -->
href="https://zenofy.com/pay/SEU_LINK_REAL_AQUI"
```

### 3. Contactos
- Email: substituir `info@nexflow.co.mz` pelo email real
- WhatsApp: substituir `258840000000` pelo número real em:
  ```html
  href="https://wa.me/258840000000"
  ```

### 4. Imagens
Adicionar na pasta `images/`:
- `og-image.png` — 1200×630px (para partilha em redes sociais)
- `logo.png` — versão quadrada do logo (512×512px)

### 5. Google Analytics (opcional)
Adicionar antes do `</head>` no `index.html`:
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

## Fluxo de Pagamento

```
Utilizador vê página
       ↓
Clica em "Pagar com Zenofy"
       ↓
Redirecionado para Zenofy (link externo)
       ↓
Completa pagamento (Zenofy / M-Pesa / Banco)
       ↓
Zenofy confirma pagamento → NexFlow recebe notificação
       ↓
NexFlow envia acesso ao WhatsApp de suporte (manual ou automático)
```

## Deployment

### Opção 1: Hosting estático (recomendado)
- **Netlify**: arrastar pasta para netlify.com/drop
- **Vercel**: `vercel deploy`
- **cPanel**: fazer upload via FTP para `public_html/`

### Opção 2: GitHub Pages
```bash
git init
git add .
git commit -m "NexFlow landing page"
git remote add origin https://github.com/SEU_USER/nexflow.git
git push -u origin main
# Activar Pages em Settings > Pages
```

## Performance

- **Fontes**: carregadas via Google Fonts com `preconnect`
- **JS**: carregado com `defer` (não bloqueia renderização)
- **CSS**: inline onde possível, ficheiro externo optimizado
- **Imagens**: usar WebP sempre que possível
- **Animações**: desactivadas se `prefers-reduced-motion: reduce`

## Acessibilidade

- Contraste mínimo WCAG 2.1 AA
- Navegação por teclado completa
- ARIA labels em todos os elementos interactivos
- Skip link para conteúdo principal
- FAQ accordion com `aria-expanded` correcto
- Imagens decorativas com `aria-hidden="true"`

---

**Versão**: 1.0.0  
**Língua**: Português (Moçambique)  
**Moeda**: Metical (MZN / MT)  
**Contacto**: info@nexflow.co.mz
