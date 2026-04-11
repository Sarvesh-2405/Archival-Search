# Intelligent Archival Search System

A production-quality, single-page React application for searching and exploring historical archival documents. Inspired by the Qatar Digital Library (QDL), this application features intelligent full-text search with relevance ranking, advanced filtering, and a beautiful, responsive interface.

## ✨ Features

### 🔍 Smart Search Engine
- **Multi-field relevance scoring**: Searches across title (weight: 10), subjects (7), tags (7), keywords (5), description (3), author (3), and place/region (2)
- **Partial matching**: Find "navy" when searching for "nav"
- **Case-insensitive** and **diacritic-tolerant** matching
- **Term highlighting**: Matched search terms highlighted in gold in result cards
- **Multi-word search**: Each word scored independently; total = sum of all word scores

### 🎛️ Faceted Filtering
- **Document Type** — checkbox list (dynamically generated)
- **Date Range** — "From Year" and "To Year" with negative year support (BC)
- **Region** — dynamically generated
- **Language** — dynamically generated
- **Holding Institution** — dynamically generated
- **Subjects** — all unique subjects
- **Live count badges** reflecting filtered dataset

### 📄 Results Display
- Grid layout: 2–3 columns on desktop, responsive for tablet/mobile
- Rich cards with type badges, titles, dates (BC-aware), places, descriptions, languages, authors, institutions, tags, and type-specific emoji icons

### 📑 Pagination
- 12 results per page
- Smart pagination controls with ellipsis
- Auto-scroll and auto-reset to page 1

### 🔃 Sorting
- Relevance (default)
- Date: Newest/Oldest First
- Title: A→Z / Z→A

### 📊 Timeline Visualization (Bonus)
- Toggle button to show results grouped by century
- Clickable nodes with document counts
- Highlights corresponding cards on click

### 🎨 Design
- **Professional archival aesthetic** with smooth transitions
- **Color palette**: Navy header, cream backgrounds, gold accents
- **Typography**: Playfair Display (headings), Inter (body)
- **Fully responsive**: Mobile drawer, tablet overlay, desktop sidebar

## 🚀 Quick Start

### Prerequisites
- Node.js 14+

### Installation & Run

```bash
cd archival-search
npm install
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
```

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── Header.jsx
│   ├── SearchBar.jsx
│   ├── FilterSidebar.jsx
│   ├── FilterGroup.jsx
│   ├── ResultsGrid.jsx
│   ├── ResultCard.jsx
│   ├── Pagination.jsx
│   ├── SortDropdown.jsx
│   ├── TimelineView.jsx
│   └── SkeletonCard.jsx
├── hooks/               # Custom React hooks
│   ├── useSearch.js      # Core search + filter + pagination
│   └── useDebounce.js    # Debounce hook
├── utils/               # Pure utility functions
│   ├── searchEngine.js   # Search scoring & highlighting
│   ├── filterEngine.js   # Facet counting & filtering
│   └── dateUtils.js      # Date formatting & BC handling
├── styles/              # CSS Modules
│   ├── global.css
│   ├── Header.module.css
│   ├── SearchBar.module.css
│   ├── FilterSidebar.module.css
│   ├── ResultCard.module.css
│   └── Pagination.module.css
├── data/
│   └── documents.json    # 100 archival records
├── App.jsx              # Main component
└── index.js
```

## 💡 Usage Examples

### Search for documents
1. Type "navigation" in the search bar
2. Press Enter or click Search
3. Results sorted by relevance (title matches rank higher)

### Filter results
1. Select "Map" from Document Type
2. Select "English" from Language
3. Set date range 1800–1900
4. Remove individual filters with × chips or "Clear All"

### Sort & Timeline
- Use dropdown to sort by date, title, or relevance
- Toggle timeline to see results grouped by century
- Click timeline nodes to highlight cards

## 🛠 Tech Stack

- **React 18** with functional components & hooks
- **CSS Modules** (no Tailwind, no UI libraries)
- **Client-side only** — 100% browser-based
- **JSON dataset** — 100 archival records

## 📊 Data Format

Each document has:
- `id`, `title`, `description`
- `type` (painting, map, letter, manuscript, etc.)
- `date` (YYYY-MM-DD or null or negative for BC like "-2000-01-01")
- `place`, `region`, `language`
- `subjects`, `tags`, `keywords` (arrays)
- `author`, `holdingInstitution`, `collection`, `format`

**100 diverse records** spanning 2000 BC to 1960 AD across Europe, Asia, Middle East, Americas, and Africa.

## ✅ Key Features Implemented

✅ Multi-field relevance scoring with configurable weights  
✅ Partial matching ("nav" → "navy", "navigation")  
✅ Diacritic-tolerant search (Unicode normalization)  
✅ Term highlighting in results  
✅ Dynamic filter generation from dataset  
✅ Live facet counts reflecting current filters  
✅ Date range filtering with BC support  
✅ 12-item pagination with smart controls  
✅ Sort by relevance, date, or title  
✅ Responsive mobile/tablet/desktop layout  
✅ Timeline visualization by century  
✅ Skeleton loaders for perceived performance  
✅ Empty states with suggestions  
✅ Debounced search (300ms)  
✅ Memoization for expensive ops  
✅ Color-coded type badges  

## 🎯 Acceptance Criteria Met

✅ Search "nav" returns "navy", "navigation" results  
✅ "map" in title ranks higher than "map" in tags  
✅ Type + Language filters work together (AND logic)  
✅ Date range excludes ancient & null dates correctly  
✅ Pagination: 12 items/page  
✅ Mobile sidebar drawer via hamburger button  
✅ Filter chips removable individually  
✅ "-2000 BC" record sorts first (oldest first)  
✅ Matched terms highlighted gold/amber  
✅ Works on Chrome, Firefox, Safari, mobile browsers  

## 🔐 Edge Cases Handled

- Null/missing fields (descriptions, authors, empty arrays)
- Unicode characters & diacritics in names
- Negative years (BC dates)
- Upper/mixed-case matching
- No results found (friendly message)
- Long institution names (truncation)
- Multiple tags (show first 3 + count)
- Unknown/null authors & dates

## 📱 Responsive Breakpoints

| Breakpoint | Layout |
|-----------|--------|
| < 640px | Single column, hamburger menu, sidebar drawer |
| 640–1024px | Two-column grid, sidebar overlay |
| > 1024px | Three-column grid, sticky sidebar |

## 🚀 Performance

- Search: ~300ms (debounced)
- Pagination: Instant
- Sorting: Instant
- 100 documents render smoothly
- CSS Modules prevent style conflicts
- Memoized search/filter/sort computations

## 🎨 Design Notes

- **Header**: Deep navy gradient
- **Backgrounds**: Warm cream (#f5f0e8)
- **Accents**: Gold buttons, highlights, badges
- **Fonts**: Playfair Display (serif, headings), Inter (sans, body)
- **Cards**: Subtle shadow, lift on hover, smooth transitions
- **Mobile**: Touch-friendly (48px+ targets), full-width inputs

## 📚 Component Highlights

### useSearch Hook
- Manages query, filters, pagination, sorting state
- Returns all needed data for UI
- Handles page reset on filter/search changes

### searchEngine.js
- Pure function: `searchDocuments(docs, query, filters)` → scored results
- `highlightText(text, positions)` → HTML with `<mark>` tags
- Unicode normalization for matching

### ResultCard Component
- Type-specific emoji icons (🗺️ for map, 🖼️ for painting, etc.)
- Highlights matched terms in title & description
- Truncates description to 120 chars
- Shows first 3 tags with +N count

### FilterSidebar
- Dynamic options from dataset
- Live counts as filters change
- Collapsible groups (open by default)
- Date range inputs with blur handling

## 🌐 Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile Safari (iOS 13+)
- ✅ Mobile Chrome

## 📖 Learn More

- [React Documentation](https://react.dev)
- [CSS Modules](https://github.com/css-modules/css-modules)
- [Archival Search Patterns](https://en.wikipedia.org/wiki/Digital_library)

---

**Built with ❤️ for archival researchers**  
A modern React showcase featuring hooks, memoization, utility functions, and responsive design.
