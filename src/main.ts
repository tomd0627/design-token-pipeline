import {
  Activity,
  ArrowDown,
  ArrowRight,
  Circle,
  Copy,
  FileCode,
  FileCode2,
  FileJson,
  FileType,
  GitBranch,
  type IconNode,
  Layers,
  Package2,
  Palette,
  Ruler,
  Settings2,
  Type,
  Zap,
} from "lucide";

import tokensCssRaw from "../dist/tokens.css?raw";
import tokensDtsRaw from "../dist/tokens.d.ts?raw";
import tokensJsRaw from "../dist/tokens.js?raw";

import { initCopyButtons } from "./components/copy-button";
import { initDownloadButtons } from "./components/download-button";
import { initLiveEditor } from "./components/live-editor";
import { initTabs } from "./components/tabs";

// ─── Icon utilities ──────────────────────────────────────────────────────────

function iconToSvg(icon: IconNode, size = 16): string {
  const attrs: Record<string, string | number> = {
    xmlns: "http://www.w3.org/2000/svg",
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    "stroke-width": "2",
    "stroke-linecap": "round",
    "stroke-linejoin": "round",
    "aria-hidden": "true",
    focusable: "false",
  };

  const attrStr = Object.entries(attrs)
    .map(([k, v]) => `${k}="${v}"`)
    .join(" ");

  const childStr = icon
    .map(([tag, childAttrs]) => {
      const cAttrStr = Object.entries(childAttrs)
        .map(([k, v]) => `${k}="${v}"`)
        .join(" ");
      return `<${tag} ${cAttrStr}/>`;
    })
    .join("");

  return `<svg ${attrStr}>${childStr}</svg>`;
}

const iconMap: Record<string, IconNode> = {
  activity: Activity,
  "arrow-down": ArrowDown,
  "arrow-right": ArrowRight,
  circle: Circle,
  copy: Copy,
  "file-code": FileCode,
  "file-code-2": FileCode2,
  "file-json": FileJson,
  "file-type": FileType,
  figma: FileJson, // closest available icon for Figma
  github: GitBranch,
  layers: Layers,
  "package-2": Package2,
  palette: Palette,
  pipeline: Layers,
  ruler: Ruler,
  "settings-2": Settings2,
  type: Type,
  zap: Zap,
};

function injectIcons(): void {
  const targets = document.querySelectorAll<HTMLElement>("[data-icon]");
  targets.forEach((el) => {
    const iconName = el.getAttribute("data-icon");
    if (!iconName) return;
    const icon = iconMap[iconName];
    if (!icon) return;
    el.innerHTML = iconToSvg(icon, 16);
  });
}

// ─── Gallery renderers ───────────────────────────────────────────────────────

interface ColorSwatch {
  token: string;
  cssVar: string;
  hex: string;
}

interface ColorGroup {
  label: string;
  swatches: ColorSwatch[];
}

const colorGroups: ColorGroup[] = [
  {
    label: "Orange",
    swatches: [
      { token: "color.orange.300", cssVar: "--token-color-orange-300", hex: "#fdba74" },
      { token: "color.orange.400", cssVar: "--token-color-orange-400", hex: "#fb923c" },
      { token: "color.orange.500", cssVar: "--token-color-orange-500", hex: "#f97316" },
      { token: "color.orange.600", cssVar: "--token-color-orange-600", hex: "#ea6c0a" },
      { token: "color.orange.700", cssVar: "--token-color-orange-700", hex: "#c2510a" },
    ],
  },
  {
    label: "Sky",
    swatches: [
      { token: "color.sky.300", cssVar: "--token-color-sky-300", hex: "#7dd3fc" },
      { token: "color.sky.400", cssVar: "--token-color-sky-400", hex: "#38bdf8" },
      { token: "color.sky.500", cssVar: "--token-color-sky-500", hex: "#0ea5e9" },
      { token: "color.sky.600", cssVar: "--token-color-sky-600", hex: "#28a8e0" },
    ],
  },
  {
    label: "Text",
    swatches: [
      { token: "color.text.primary", cssVar: "--token-color-text-primary", hex: "#f5f0ea" },
      { token: "color.text.secondary", cssVar: "--token-color-text-secondary", hex: "#cfc5b8" },
      { token: "color.text.muted", cssVar: "--token-color-text-muted", hex: "#a09585" },
    ],
  },
  {
    label: "Background",
    swatches: [
      {
        token: "color.background.base",
        cssVar: "--token-color-background-base",
        hex: "#12100e",
      },
      {
        token: "color.background.surface",
        cssVar: "--token-color-background-surface",
        hex: "#1e1b17",
      },
      {
        token: "color.background.elevated",
        cssVar: "--token-color-background-elevated",
        hex: "#2a2520",
      },
    ],
  },
  {
    label: "Border",
    swatches: [
      { token: "color.border.default", cssVar: "--token-color-border-default", hex: "#3a3530" },
      { token: "color.border.subtle", cssVar: "--token-color-border-subtle", hex: "#2a2520" },
    ],
  },
];

function renderColors(): void {
  const container = document.getElementById("gallery-colors");
  if (!container) return;

  container.innerHTML = colorGroups
    .map(
      (group) => `
      <div class="color-group">
        <p class="color-group__label">${group.label}</p>
        <div class="color-swatches">
          ${group.swatches
            .map(
              (s) => `
            <div class="color-swatch">
              <div
                class="color-swatch__block"
                style="--swatch-color: ${s.hex}"
                role="img"
                aria-label="${s.token}: ${s.hex}"
              ></div>
              <p class="color-swatch__name">${s.cssVar}</p>
              <p class="color-swatch__value">${s.hex}</p>
            </div>
          `,
            )
            .join("")}
        </div>
      </div>
    `,
    )
    .join("");
}

interface TypeScale {
  token: string;
  value: string;
  size: string;
}

const typeScale: TypeScale[] = [
  { token: "font.size.xs", value: "0.75rem / 12px", size: "0.75rem" },
  { token: "font.size.sm", value: "0.875rem / 14px", size: "0.875rem" },
  { token: "font.size.base", value: "1rem / 16px", size: "1rem" },
  { token: "font.size.lg", value: "1.125rem / 18px", size: "1.125rem" },
  { token: "font.size.xl", value: "1.25rem / 20px", size: "1.25rem" },
  { token: "font.size.2xl", value: "1.5rem / 24px", size: "1.5rem" },
  { token: "font.size.3xl", value: "1.875rem / 30px", size: "1.875rem" },
  { token: "font.size.4xl", value: "2.25rem / 36px", size: "2.25rem" },
  { token: "font.size.5xl", value: "3rem / 48px", size: "3rem" },
];

function renderTypography(): void {
  const container = document.getElementById("gallery-typography");
  if (!container) return;

  container.innerHTML = typeScale
    .map(
      (t) => `
      <div class="type-row">
        <div class="type-row__meta">
          <span class="type-row__token">${t.token}</span>
          <span class="type-row__value">${t.value}</span>
        </div>
        <p class="type-row__sample" style="font-size: ${t.size}">The quick brown fox</p>
      </div>
    `,
    )
    .join("");
}

interface SpacingToken {
  token: string;
  value: string;
  px: string;
  widthPercent: number;
}

const spacingTokens: SpacingToken[] = [
  { token: "spacing.1", value: "0.25rem", px: "4px", widthPercent: 1 },
  { token: "spacing.2", value: "0.5rem", px: "8px", widthPercent: 2 },
  { token: "spacing.3", value: "0.75rem", px: "12px", widthPercent: 3 },
  { token: "spacing.4", value: "1rem", px: "16px", widthPercent: 5 },
  { token: "spacing.5", value: "1.25rem", px: "20px", widthPercent: 6 },
  { token: "spacing.6", value: "1.5rem", px: "24px", widthPercent: 8 },
  { token: "spacing.8", value: "2rem", px: "32px", widthPercent: 11 },
  { token: "spacing.10", value: "2.5rem", px: "40px", widthPercent: 14 },
  { token: "spacing.12", value: "3rem", px: "48px", widthPercent: 17 },
  { token: "spacing.16", value: "4rem", px: "64px", widthPercent: 22 },
  { token: "spacing.20", value: "5rem", px: "80px", widthPercent: 28 },
  { token: "spacing.24", value: "6rem", px: "96px", widthPercent: 33 },
  { token: "spacing.32", value: "8rem", px: "128px", widthPercent: 44 },
  { token: "spacing.40", value: "10rem", px: "160px", widthPercent: 56 },
  { token: "spacing.48", value: "12rem", px: "192px", widthPercent: 67 },
  { token: "spacing.64", value: "16rem", px: "256px", widthPercent: 78 },
  { token: "spacing.80", value: "20rem", px: "320px", widthPercent: 89 },
  { token: "spacing.96", value: "24rem", px: "384px", widthPercent: 100 },
];

function renderSpacing(): void {
  const container = document.getElementById("gallery-spacing");
  if (!container) return;

  container.innerHTML = spacingTokens
    .map(
      (s) => `
      <div class="spacing-row">
        <div class="spacing-row__meta">
          <span class="spacing-row__token">${s.token}</span>
          <span class="spacing-row__value">${s.value} · ${s.px}</span>
        </div>
        <div
          class="spacing-row__bar"
          style="--spacing-width: ${s.widthPercent}%"
          role="img"
          aria-label="${s.token}: ${s.value}"
        ></div>
      </div>
    `,
    )
    .join("");
}

interface ShadowToken {
  token: string;
  cssVar: string;
  value: string;
}

const shadowTokens: ShadowToken[] = [
  {
    token: "shadow.sm",
    cssVar: "--token-shadow-sm",
    value: "0 1px 2px 0 rgba(0,0,0,0.4)",
  },
  {
    token: "shadow.base",
    cssVar: "--token-shadow-base",
    value: "0 2px 6px 0 rgba(0,0,0,0.4)",
  },
  {
    token: "shadow.md",
    cssVar: "--token-shadow-md",
    value: "0 4px 12px -2px rgba(0,0,0,0.5)",
  },
  {
    token: "shadow.lg",
    cssVar: "--token-shadow-lg",
    value: "0 8px 24px -4px rgba(0,0,0,0.6)",
  },
  {
    token: "shadow.xl",
    cssVar: "--token-shadow-xl",
    value: "0 16px 40px -8px rgba(0,0,0,0.7)",
  },
  {
    token: "shadow.glow-orange",
    cssVar: "--token-shadow-glow-orange",
    value: "0 0 20px 0 rgba(249,115,22,0.3)",
  },
  {
    token: "shadow.glow-sky",
    cssVar: "--token-shadow-glow-sky",
    value: "0 0 20px 0 rgba(56,189,248,0.3)",
  },
];

function renderShadows(): void {
  const container = document.getElementById("gallery-shadows");
  if (!container) return;

  container.innerHTML = shadowTokens
    .map(
      (s) => `
      <div class="shadow-card" style="--shadow-value: var(${s.cssVar})">
        <span class="shadow-card__token">${s.token}</span>
        <span class="shadow-card__value">${s.value}</span>
      </div>
    `,
    )
    .join("");
}

interface RadiusToken {
  token: string;
  value: string;
}

const radiusTokens: RadiusToken[] = [
  { token: "borderRadius.none", value: "0rem" },
  { token: "borderRadius.sm", value: "0.125rem" },
  { token: "borderRadius.base", value: "0.25rem" },
  { token: "borderRadius.md", value: "0.375rem" },
  { token: "borderRadius.lg", value: "0.5rem" },
  { token: "borderRadius.xl", value: "0.75rem" },
  { token: "borderRadius.2xl", value: "1rem" },
  { token: "borderRadius.3xl", value: "1.5rem" },
  { token: "borderRadius.full", value: "9999px" },
];

function renderRadii(): void {
  const container = document.getElementById("gallery-radii");
  if (!container) return;

  container.innerHTML = radiusTokens
    .map(
      (r) => `
      <div class="radius-item">
        <div
          class="radius-item__box"
          style="--radius-value: ${r.value}"
          role="img"
          aria-label="${r.token}: ${r.value}"
        ></div>
        <span class="radius-item__token">${r.token}</span>
        <span class="radius-item__value">${r.value}</span>
      </div>
    `,
    )
    .join("");
}

interface MotionToken {
  token: string;
  value: string;
}

const durationTokens: MotionToken[] = [
  { token: "motion.duration.instant", value: "50ms" },
  { token: "motion.duration.fast", value: "100ms" },
  { token: "motion.duration.base", value: "200ms" },
  { token: "motion.duration.slow", value: "300ms" },
  { token: "motion.duration.slower", value: "500ms" },
  { token: "motion.duration.slowest", value: "700ms" },
];

const easingTokens: MotionToken[] = [
  { token: "motion.easing.linear", value: "cubic-bezier(0, 0, 1, 1)" },
  { token: "motion.easing.ease-in", value: "cubic-bezier(0.4, 0, 1, 1)" },
  { token: "motion.easing.ease-out", value: "cubic-bezier(0, 0, 0.2, 1)" },
  { token: "motion.easing.ease-in-out", value: "cubic-bezier(0.4, 0, 0.2, 1)" },
  { token: "motion.easing.spring", value: "cubic-bezier(0.34, 1.56, 0.64, 1)" },
];

function renderMotion(): void {
  const container = document.getElementById("gallery-motion");
  if (!container) return;

  const renderItems = (tokens: MotionToken[], isDuration: boolean): string =>
    tokens
      .map(
        (t) => `
        <div class="motion-item">
          <span class="motion-item__token">${t.token}</span>
          <span class="motion-item__value">${t.value}</span>
          ${
            isDuration
              ? `<div
                class="motion-item__demo"
                style="--motion-duration: ${t.value}; --motion-easing: ease-in-out"
                role="img"
                aria-label="Animation preview for ${t.value}"
                tabindex="0"
              ></div>`
              : `<div
                class="motion-item__demo"
                style="--motion-duration: 600ms; --motion-easing: ${t.value}"
                role="img"
                aria-label="Animation preview for ${t.value}"
                tabindex="0"
              ></div>`
          }
        </div>
      `,
      )
      .join("");

  container.innerHTML = `
    <div class="motion-section">
      <p class="motion-section__label">Duration</p>
      <div class="motion-items">${renderItems(durationTokens, true)}</div>
    </div>
    <div class="motion-section">
      <p class="motion-section__label">Easing</p>
      <div class="motion-items">${renderItems(easingTokens, false)}</div>
    </div>
  `;

  // Update track width for animation calculation after render
  container.querySelectorAll<HTMLElement>(".motion-item__demo").forEach((demo) => {
    const width = demo.getBoundingClientRect().width;
    demo.style.setProperty("--motion-track-width", `${width}px`);
  });
}

// ─── Populate code output panels ─────────────────────────────────────────────

function populateCodeOutput(): void {
  const cssEl = document.getElementById("output-css-code");
  const jsEl = document.getElementById("output-js-code");
  const dtsEl = document.getElementById("output-dts-code");

  if (cssEl) cssEl.textContent = tokensCssRaw;
  if (jsEl) jsEl.textContent = tokensJsRaw;
  if (dtsEl) dtsEl.textContent = tokensDtsRaw;
}

// ─── Motion demo resize observer ─────────────────────────────────────────────

function observeMotionDemos(): void {
  const motionPanel = document.getElementById("tab-motion");
  if (!motionPanel) return;

  const observer = new ResizeObserver(() => {
    motionPanel.querySelectorAll<HTMLElement>(".motion-item__demo").forEach((demo) => {
      const width = demo.getBoundingClientRect().width;
      if (width > 0) {
        demo.style.setProperty("--motion-track-width", `${width}px`);
      }
    });
  });

  observer.observe(motionPanel);
}

// ─── Mobile nav ──────────────────────────────────────────────────────────────

function initMobileNav(): void {
  const toggle = document.querySelector<HTMLButtonElement>(".nav-toggle");
  const nav = document.getElementById("site-nav");
  if (!toggle || !nav) return;

  function close(): void {
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open navigation menu");
    nav.classList.remove("is-open");
  }

  toggle.addEventListener("click", () => {
    const isOpen = toggle.getAttribute("aria-expanded") === "true";
    if (isOpen) {
      close();
    } else {
      toggle.setAttribute("aria-expanded", "true");
      toggle.setAttribute("aria-label", "Close navigation menu");
      nav.classList.add("is-open");
    }
  });

  // Close when a link is tapped on mobile
  nav.querySelectorAll<HTMLAnchorElement>(".nav-link").forEach((link) => {
    link.addEventListener("click", close);
  });
}

// ─── Nav scroll highlighting ─────────────────────────────────────────────────

function initScrollHighlight(): void {
  const sectionIds = ["pipeline", "try-it", "gallery", "output", "usage"];
  const sections = sectionIds
    .map((id) => document.getElementById(id))
    .filter((el): el is HTMLElement => el !== null);

  if (sections.length === 0) return;

  function setActive(id: string | null): void {
    document.querySelectorAll<HTMLElement>(".nav-link").forEach((link) => {
      link.classList.toggle("nav-link--active", link.getAttribute("href") === `#${id}`);
    });
  }

  // Track which sections are intersecting; activate the topmost visible one
  const visible = new Set<string>();

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          visible.add(entry.target.id);
        } else {
          visible.delete(entry.target.id);
        }
      });

      // Pick the first section (in DOM order) that is currently visible
      const active = sectionIds.find((id) => visible.has(id)) ?? null;
      setActive(active);
    },
    { rootMargin: "0px 0px -60% 0px", threshold: 0 },
  );

  sections.forEach((section) => {
    observer.observe(section);
  });
}

// ─── Init ────────────────────────────────────────────────────────────────────

function init(): void {
  injectIcons();
  initTabs();
  initCopyButtons();
  initDownloadButtons();
  initLiveEditor();
  renderColors();
  renderTypography();
  renderSpacing();
  renderShadows();
  renderRadii();
  renderMotion();
  populateCodeOutput();
  observeMotionDemos();
  initMobileNav();
  initScrollHighlight();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
