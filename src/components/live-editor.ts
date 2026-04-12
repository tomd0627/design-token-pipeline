import { transformToCSS, transformToJS, transformToTS } from "./token-transformer";

const STARTER_JSON = `{
  "color": {
    "brand": {
      "primary": { "$type": "color", "$value": "#f97316" },
      "secondary": { "$type": "color", "$value": "#0ea5e9" }
    },
    "text": {
      "primary": { "$type": "color", "$value": "#111827" },
      "muted": { "$type": "color", "$value": "#6b7280" }
    }
  },
  "spacing": {
    "sm": { "$type": "dimension", "$value": "0.5rem" },
    "md": { "$type": "dimension", "$value": "1rem" },
    "lg": { "$type": "dimension", "$value": "1.5rem" },
    "xl": { "$type": "dimension", "$value": "2rem" }
  },
  "typography": {
    "size": {
      "sm": { "$type": "dimension", "$value": "0.875rem" },
      "base": { "$type": "dimension", "$value": "1rem" },
      "lg": { "$type": "dimension", "$value": "1.25rem" }
    }
  }
}`;

type OutputFormat = "css" | "js" | "ts";

interface EditorState {
  lastValidJson: Record<string, unknown>;
  activeTab: OutputFormat;
}

export function initLiveEditor(): void {
  const textarea = document.getElementById("live-editor__input") as HTMLTextAreaElement | null;
  const errorEl = document.getElementById("live-editor__error");
  const resetBtn = document.getElementById("live-editor__reset") as HTMLButtonElement | null;
  const outputEl = document.getElementById("live-editor__output-code");

  if (!textarea || !errorEl || !resetBtn || !outputEl) return;

  const state: EditorState = {
    lastValidJson: JSON.parse(STARTER_JSON) as Record<string, unknown>,
    activeTab: "css",
  };

  // ── Tab switching ──────────────────────────────────────────────────────────
  const tabBtns = document.querySelectorAll<HTMLButtonElement>("[data-editor-tab]");
  tabBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const tab = btn.getAttribute("data-editor-tab") as OutputFormat;
      state.activeTab = tab;
      tabBtns.forEach((b) => {
        const isActive = b === btn;
        b.setAttribute("aria-selected", String(isActive));
        b.classList.toggle("editor-tabs__btn--active", isActive);
      });
      renderOutput(state, outputEl);
    });
  });

  // ── Copy button inside live editor ────────────────────────────────────────
  const copyBtn = document.getElementById("live-editor__copy") as HTMLButtonElement | null;
  copyBtn?.addEventListener("click", async () => {
    const text = outputEl.textContent ?? "";
    try {
      await navigator.clipboard.writeText(text);
      showCopied(copyBtn);
    } catch {
      // silently ignore in portfolio context
    }
  });

  // ── Reset ──────────────────────────────────────────────────────────────────
  resetBtn.addEventListener("click", () => {
    textarea.value = STARTER_JSON;
    clearError(errorEl);
    state.lastValidJson = JSON.parse(STARTER_JSON) as Record<string, unknown>;
    renderOutput(state, outputEl);
  });

  // ── Live input (debounced) ─────────────────────────────────────────────────
  let debounceTimer: ReturnType<typeof setTimeout>;
  textarea.addEventListener("input", () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      const raw = textarea.value.trim();
      try {
        const parsed = JSON.parse(raw) as Record<string, unknown>;
        state.lastValidJson = parsed;
        clearError(errorEl);
      } catch (err) {
        const msg = err instanceof SyntaxError ? err.message : "Invalid JSON";
        showError(errorEl, msg);
        // keep last valid output shown — don't update
        return;
      }
      renderOutput(state, outputEl);
    }, 250);
  });

  // ── Initial render ─────────────────────────────────────────────────────────
  textarea.value = STARTER_JSON;
  renderOutput(state, outputEl);
}

function renderOutput(
  state: EditorState,
  outputEl: HTMLElement,
): void {
  // TokenTree type used in transformer — cast through unknown for the dynamic JSON
  type TokenTree = Parameters<typeof transformToCSS>[0];
  const tree = state.lastValidJson as unknown as TokenTree;

  let result: string;
  if (state.activeTab === "css") result = transformToCSS(tree);
  else if (state.activeTab === "js") result = transformToJS(tree);
  else result = transformToTS(tree);

  outputEl.textContent = result;
}

function showError(el: HTMLElement, message: string): void {
  el.textContent = `JSON error: ${message}`;
  el.hidden = false;
}

function clearError(el: HTMLElement): void {
  el.hidden = true;
  el.textContent = "";
}

function showCopied(btn: HTMLButtonElement): void {
  const label = btn.querySelector<HTMLElement>(".copy-btn__label");
  const originalLabel = label?.textContent ?? "Copy";
  const originalAriaLabel = btn.getAttribute("aria-label") ?? "";

  btn.classList.add("copy-btn--copied");
  btn.setAttribute("aria-label", "Copied to clipboard");
  if (label) label.textContent = "Copied!";

  setTimeout(() => {
    btn.classList.remove("copy-btn--copied");
    btn.setAttribute("aria-label", originalAriaLabel);
    if (label) label.textContent = originalLabel;
  }, 2000);
}
