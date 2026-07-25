import { AppState } from '../types';

export interface ObjectiveTransitionStep {
  // Teks yang ditambahkan ke notebook sebelum popup muncul. Kosongin kalau
  // chapter ini gak nambah catatan di objective ini.
  notebookAppend?: string;
  // true = appState pindah ke 'NOTEBOOK' dulu (popup muncul di atasnya).
  // false/kosong = appState langsung ke 'TERM' (popup muncul di atasnya).
  showNotebookFirst?: boolean;
  // Delay (ms) sebelum popup muncul. Cuma dipakai 1 kasus di seluruh CASE #001
  // (Chapter 1 Objective 3, delay 3 detik) — biarkan kosong buat kasus normal.
  popupDelayMs?: number;
  // true = begitu popup ditutup, appState otomatis balik ke 'TERM' + query
  // dikosongin. false/kosong = popup ditutup, layar tetap di appState
  // sebelumnya (biasanya NOTEBOOK) — pemain navigasi manual balik ke TERM.
  returnToTermAfterPopup?: boolean;
}

type ChapterTransitions = Record<number, ObjectiveTransitionStep>;

// Data lookup transisi objective per chapter, keyed by nextIdx.
// PENTING: kalau kombinasi (chapterId, nextIdx) TIDAK ada di sini, runner
// otomatis jalanin default behavior (popup + langsung TERM, tanpa notebook,
// tanpa delay) — ini PERSIS sama seperti fallback `else` yang sudah ada di
// App.tsx dari awal. Jadi chapter yang gak didaftar sama sekali (termasuk
// Ch7, Ch8, dan objective mana pun di chapter manapun yang gak disebut di
// sini) otomatis tetap jalan seperti sebelumnya, gak perlu didaftar eksplisit.
//
// Chapter yang PUNYA sequence bespoke (multi-popup chain, ubah contacts,
// unlock app baru, dsb — bukan cuma "notebook+popup+pindah state biasa")
// SENGAJA TIDAK didaftar di sini. Chapter-chapter itu (2, 3 sebagian, 5, 6,
// 10 sebagian, 11, 12) tetap pakai kode custom yang sudah ada di App.tsx —
// registry ini cuma nanganin pola yang seragam.
export const OBJECTIVE_TRANSITIONS: Record<number, ChapterTransitions> = {
  1: {
    3: { showNotebookFirst: true, popupDelayMs: 3000 }
  },
  4: {
    1: { notebookAppend: 'Data terlalu banyak. Perlu difilter.\nAda dua orang lain yang berada di lokasi hampir bersamaan.', showNotebookFirst: true },
    2: { notebookAppend: 'Rudi juga mengunjungi Rizky.', showNotebookFirst: true },
    3: { notebookAppend: 'Data Rudi tidak lengkap.', showNotebookFirst: true },
    4: { notebookAppend: 'Rudi tidak memiliki kendaraan.', showNotebookFirst: true },
    5: { notebookAppend: 'Ada tiga kendaraan.', showNotebookFirst: true }
  },
  9: {
    1: { notebookAppend: 'Lead Investigator ID: 52', showNotebookFirst: true, returnToTermAfterPopup: true },
    2: { notebookAppend: 'ID 52 tidak ditemukan di persons.', showNotebookFirst: true, returnToTermAfterPopup: true },
    3: { notebookAppend: 'Record person benar-benar hilang.', showNotebookFirst: true, returnToTermAfterPopup: true },
    4: { notebookAppend: 'Notebook Polisi masih ada di Evidence.', showNotebookFirst: true, returnToTermAfterPopup: true }
  }
};

const DEFAULT_STEP: ObjectiveTransitionStep = {};

export function getObjectiveTransition(chapterId: number, nextIdx: number): ObjectiveTransitionStep {
  return OBJECTIVE_TRANSITIONS[chapterId]?.[nextIdx] ?? DEFAULT_STEP;
}

// true kalau (chapterId, nextIdx) ini AMAN dihandle generic runner —
// dipakai App.tsx buat mutusin apakah harus fallback ke switch custom lama
// atau cukup panggil runObjectiveTransition. Chapter yang gak disebut di
// OBJECTIVE_TRANSITIONS tapi TIDAK termasuk daftar "chapter custom" di bawah
// juga dianggap aman (bakal pakai DEFAULT_STEP, sama kayak fallback lama).
const CHAPTERS_WITH_CUSTOM_LOGIC = new Set([2, 3, 5, 6, 10, 11, 12]);

export function hasCustomLogic(chapterId: number): boolean {
  return CHAPTERS_WITH_CUSTOM_LOGIC.has(chapterId);
}

export interface TransitionContext {
  appendNotebook: (text: string) => void;
  setAppState: (s: AppState) => void;
  setQueryString: (s: string) => void;
  showSupervisorPopup: (message: string, onConfirm?: () => void) => void;
}

export function runObjectiveTransition(
  chapterId: number,
  nextIdx: number,
  nextStory: string | undefined,
  ctx: TransitionContext
): void {
  const step = getObjectiveTransition(chapterId, nextIdx);

  if (step.notebookAppend) {
    ctx.appendNotebook(step.notebookAppend);
  }

  ctx.setAppState(step.showNotebookFirst ? 'NOTEBOOK' : 'TERM');
  ctx.setQueryString('');

  const showPopup = () => {
    if (!nextStory) return;
    if (step.returnToTermAfterPopup) {
      ctx.showSupervisorPopup(nextStory, () => {
        ctx.setAppState('TERM');
        ctx.setQueryString('');
      });
    } else {
      ctx.showSupervisorPopup(nextStory);
    }
  };

  if (step.popupDelayMs) {
    setTimeout(showPopup, step.popupDelayMs);
  } else {
    showPopup();
  }
}
