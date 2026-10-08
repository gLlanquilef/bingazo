import { LETTERS, MAX_NUMBER, columnOf, label, letterOf, parseCalls } from '../lib/bingo';
import { DEFAULT_PATTERN_ID, getPattern } from '../lib/patterns';

interface State {
  /** Números en el orden en que salieron. */
  called: number[];
  patternId: string;
}

const STORAGE_KEY = 'bingazo:v1';
const RECENT_COUNT = 8;
const FIGURE_CYCLE_MS = 1400;

const $ = <T extends HTMLElement>(id: string): T => document.getElementById(id) as T;

const isNumberList = (v: unknown): v is number[] =>
  Array.isArray(v) && v.every((n) => Number.isInteger(n) && n >= 1 && n <= MAX_NUMBER);

const load = (): State => {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null');
    return {
      called: isNumberList(saved?.called) ? [...new Set<number>(saved.called)] : [],
      patternId: getPattern(String(saved?.patternId ?? DEFAULT_PATTERN_ID)).id,
    };
  } catch {
    return { called: [], patternId: DEFAULT_PATTERN_ID };
  }
};

const state = load();
const save = () => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Almacenamiento no disponible (modo privado, etc.): el juego sigue funcionando sin persistir.
  }
};

const callInput = $<HTMLInputElement>('call-input');
const msg = $('msg');
let variantIndex = 0;

const renderBoard = () => {
  const called = new Set(state.called);
  const last = state.called.at(-1);
  document.querySelectorAll<HTMLButtonElement>('.num').forEach((btn) => {
    const n = Number(btn.dataset.n);
    btn.classList.toggle('called', called.has(n));
    btn.classList.toggle('latest', n === last);
    btn.setAttribute('aria-pressed', String(called.has(n)));
  });
};

const renderLast = () => {
  const last = state.called.at(-1);
  $('last').dataset.col = last ? String(columnOf(last)) : '';
  $('last-letter').textContent = last ? letterOf(last) : '';
  $('last-number').textContent = last ? String(last) : '—';
  $('count').textContent = String(state.called.length);
  $('recent').innerHTML = state.called
    .slice(-RECENT_COUNT - 1, -1)
    .reverse()
    .map((n) => `<li data-col="${columnOf(n)}">${label(n)}</li>`)
    .join('');
};

/** Dibuja la figura en una matriz con encabezado B-I-N-G-O; si hay varias formas, las va alternando. */
const renderFigure = () => {
  const pattern = getPattern(state.patternId);
  const shown = new Set(pattern.variants[variantIndex % pattern.variants.length]);
  const header = LETTERS.map((l, c) => `<div class="hd" data-col="${c}">${l}</div>`).join('');
  const cells = Array.from({ length: 25 }, (_, i) => {
    const cls = ['cell', shown.has(i) && 'on', i === 12 && 'free'].filter(Boolean).join(' ');
    return `<div class="${cls}">${i === 12 ? '★' : ''}</div>`;
  }).join('');
  $('figure').innerHTML = header + cells;
  $('figure-name').textContent = pattern.name;
  $('figure-note').textContent =
    pattern.variants.length > 1 ? `${pattern.variants.length} formas posibles` : '';
};

const render = () => {
  renderBoard();
  renderLast();
  renderFigure();
};

const toggleCall = (n: number) => {
  const i = state.called.indexOf(n);
  if (i >= 0) state.called.splice(i, 1);
  else state.called.push(n);
};

// --- Eventos ---

$('call-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const results = parseCalls(callInput.value);
  if (!results.length) {
    msg.textContent = 'Escribe un número del 1 al 75.';
    return;
  }
  const problems: string[] = [];
  for (const r of results) {
    if (!r.ok) problems.push(r.error);
    else if (state.called.includes(r.n)) problems.push(`${label(r.n)} ya había salido`);
    else state.called.push(r.n);
  }
  msg.textContent = problems.join(' · ');
  callInput.value = '';
  save();
  render();
  callInput.focus();
});

$('board').addEventListener('click', (e) => {
  const btn = (e.target as HTMLElement).closest<HTMLButtonElement>('.num');
  if (!btn) return;
  toggleCall(Number(btn.dataset.n));
  msg.textContent = '';
  save();
  render();
});

$('undo').addEventListener('click', () => {
  const removed = state.called.pop();
  msg.textContent = removed ? `Se quitó el ${label(removed)}` : '';
  save();
  render();
});

$('reset').addEventListener('click', () => {
  if (!state.called.length || !confirm('¿Borrar todos los números cantados?')) return;
  state.called = [];
  msg.textContent = '';
  save();
  render();
});

document.querySelectorAll<HTMLInputElement>('input[name="pattern"]').forEach((radio) => {
  radio.checked = radio.value === state.patternId;
  radio.addEventListener('change', () => {
    state.patternId = radio.value;
    variantIndex = 0;
    save();
    renderFigure();
  });
});

// Pantalla completa: solo el escenario, para proyectar sin los controles.
const presentBtn = $<HTMLButtonElement>('present');
if (document.fullscreenEnabled) {
  presentBtn.hidden = false;
  presentBtn.addEventListener('click', () => void $('stage').requestFullscreen());
}

// Segunda pestaña/ventana (la proyectada): se mantiene sincronizada con la del operador.
window.addEventListener('storage', (e) => {
  if (e.key !== STORAGE_KEY) return;
  Object.assign(state, load());
  document.querySelectorAll<HTMLInputElement>('input[name="pattern"]').forEach((radio) => {
    radio.checked = radio.value === state.patternId;
  });
  render();
});

setInterval(() => {
  if (getPattern(state.patternId).variants.length > 1) {
    variantIndex++;
    renderFigure();
  }
}, FIGURE_CYCLE_MS);

render();
