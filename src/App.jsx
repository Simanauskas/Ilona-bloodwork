import { useState } from "react";

// ── Patient & Meta ────────────────────────────────────────────────────────────
const PATIENT = { name: "Ilona Radavičiūtė", dob: "1992-05-02", age: 33 };
const LAST_UPDATED = "2026-05-31";

// ── Conditions (from clinical notes) ─────────────────────────────────────────
const CONDITIONS = [
  { code: "E28.2", label: "PCOS", detail: "Polycystic ovary syndrome — confirmed on ultrasound" },
  { code: "E22.1", label: "Hyperprolactinaemia", detail: "Elevated prolactin ×3 over years; pituitary MRI normal (2022, 2025)" },
  { code: "E28.1", label: "Androgen Excess", detail: "Testosterone 2.67 nmol/L (Sep 2023, ref <2.6)" },
  { code: "E04.2", label: "Multinodular Goitre", detail: "Non-toxic; monitored by endocrinologist, function normal" },
  { code: "E09.9", label: "Impaired Glucose Tolerance", detail: "GTT Oct 2024: fasting 5.35 mmol/L; on Metformin 850 mg ×2/day from May 2025" },
  { code: "E61.1", label: "Iron Deficiency", detail: "Recurrent low ferritin; heavy menstruation (N92.0)" },
];

// ── Medications & Supplements ─────────────────────────────────────────────────
const MEDICATIONS = [
  { name: "Metformin 850 mg", freq: "2× daily", since: "May 2025", note: "For PCOS / impaired glucose tolerance" },
];
const SUPPLEMENTS = [
  "Vitamin D", "Vitamin B", "Vitamin C", "Omega-3", "Magnesium bisglycinate + malate",
  "Pre/probiotics",
];

// ── Lab Data ──────────────────────────────────────────────────────────────────
// Dates: ISO strings.  Values match units in MARKERS table.
// * = out of range when measured.
const LAB_DATA = {
  "2022-07-07": { WBC:5.64, RBC:3.94, HGB:119, HCT:35.4, MCV:89.8, MCH:30.2, MCHC:336, RDW:13.6, PLT:302, MPV:11.3,
    NEUT_pct:58, LYMPH_pct:24.1, MONO_pct:10.3, EOS_pct:6.9, BASO_pct:0.7, NEUT:3.27, LYMPH:1.36,
    GLU:5.06, CREA:55.7, UREA:2.89, CHOL:3.33, HDL:1.32, LDL:1.79, TRIG:0.48, TBIL:7.83,
    K:4.74, Na:138.9, Ca:2.36, TP:67.23, FE:7.87, MG:0.82, ALP:51.85, GGT:8.1, GFR:117.91,
    TSH:2.20, VITD:101, FERR:12.92 },

  "2022-10-06": { WBC:4.17, RBC:3.82, HGB:115, HCT:33.4, MCV:87.4, MCH:30.1, MCHC:344, RDW:12.9, PLT:327, MPV:9.7,
    NEUT_pct:53.8, LYMPH_pct:32.1, MONO_pct:8.4, EOS_pct:5.0, BASO_pct:0.7, NEUT:2.24, LYMPH:1.34,
    GLU:5.04, CREA:57.18, UREA:2.93, CHOL:3.46, HDL:1.19, LDL:2.06, TRIG:0.46, TBIL:10.87,
    K:4.06, Na:135.2, Ca:2.27, FE:19.59, MG:0.75, ALP:47.18, GGT:8.65, GFR:114.4, TSH:2.48, FERR:10.4 },

  "2022-11-14": { WBC:4.83, RBC:4.02, HGB:122, HCT:35.7, MCV:88.8, MCH:30.3, MCHC:342, RDW:12.9, PLT:283, MPV:10.1,
    NEUT_pct:60.6, LYMPH_pct:25.3, MONO_pct:8.5, EOS_pct:5.0, BASO_pct:0.6, NEUT:2.93, LYMPH:1.22,
    B12:390, FOLIC:24.33, FERR:183 },

  "2022-12-12": { WBC:4.43, RBC:3.99, HGB:123, HCT:34.6, MCV:86.7, MCH:30.8, MCHC:355, RDW:12.8, PLT:299, MPV:10.0,
    NEUT_pct:52.5, LYMPH_pct:33.9, MONO_pct:8.6, EOS_pct:4.1, BASO_pct:0.9, NEUT:2.33, LYMPH:1.5,
    FE:28.54, FERR:107 },

  "2023-01-04": { FERR:101 },

  "2023-05-04": { WBC:4.86, RBC:4.23, HGB:127, HCT:38.6, MCV:91.2, MCH:30.0, MCHC:329, RDW:14.5, PLT:349, MPV:8.59,
    NEUT_pct:49.87, LYMPH_pct:32.5, MONO_pct:11.09, EOS_pct:6.15, BASO_pct:0.39, NEUT:2.42, LYMPH:1.58,
    TSH:2.06, VITD:121, FERR:53.9, ATPO:0.17 },

  "2023-09-04": { WBC:5.77, RBC:4.14, HGB:126, HCT:38.0, MCV:91.9, MCH:30.5, MCHC:333, RDW:14.3, PLT:357, MPV:8.34,
    NEUT_pct:66.27, LYMPH_pct:21.12, MONO_pct:7.6, EOS_pct:4.47, BASO_pct:0.55, NEUT:3.82, LYMPH:1.22,
    GLU:4.17, CREA:53.24, UREA:2.55, TBIL:16.73, K:3.79, Na:136.2, Ca:2.18, MG:0.78,
    ALP:42.88, GGT:9.02, CHOL:3.75, HDL:1.40, LDL:2.11, TRIG:0.53, GFR:123.4,
    TSH:1.43, PROL:905.82, FERR:38.3, TESTO:2.67 },

  "2023-09-14": { HBA1C:5.4, HOMO:8.49 },

  "2024-01-25": { WBC:11.24, RBC:3.9, HGB:116, HCT:33.7, MCV:86.4, MCH:29.7, MCHC:344, RDW:12.7, PLT:425, MPV:9.8,
    NEUT_pct:83.7, LYMPH_pct:11.8, MONO_pct:3.0, EOS_pct:1.2, BASO_pct:0.3, NEUT:9.41, LYMPH:1.33,
    FE:10.53, VITD:5.3, FERR:99.8 },

  "2024-06-13": { WBC:4.2, RBC:4.12, HGB:121, HCT:36.5, MCV:88.6, MCH:29.4, MCHC:332, RDW:12.7, PLT:302, MPV:9.2,
    NEUT_pct:47.7, LYMPH_pct:38.8, MONO_pct:7.6, EOS_pct:5.2, BASO_pct:0.7, NEUT:2.0, LYMPH:1.63,
    FE:28.92, FOLIC:43.3, TSH:1.28, FERR:46.6, ATPO:0.25 },

  "2024-10-24": { GLU:5.35, INS:6.84 },

  "2024-12-02": { WBC:3.73, RBC:4.16, HGB:127, HCT:38.5, MCV:92.4, MCH:30.4, MCHC:329, RDW:12.2, PLT:252, MPV:9.1,
    NEUT_pct:44.8, LYMPH_pct:39.3, MONO_pct:7.2, EOS_pct:8.2, BASO_pct:0.5, NEUT:1.67, LYMPH:1.47,
    FE:20.69, FOLIC:29.67, FERR:56.3 },

  "2025-04-23": { WBC:3.87, RBC:4.15, HGB:129, HCT:38.1, MCV:91.7, MCH:31.0, MCHC:338, RDW:12.4, PLT:284, MPV:9.1,
    NEUT_pct:44.7, LYMPH_pct:42.6, MONO_pct:6.6, EOS_pct:5.7, BASO_pct:0.4, NEUT:1.73, LYMPH:1.65,
    FE:20.42, CHOL:4.88, HDL:1.40, LDL:3.23, TRIG:0.56, TSH:1.80,
    VITD:154, B12:589.58, GLU:4.31, FERR:31.55 },

  "2025-07-02": { WBC:5.25, RBC:4.03, HGB:125, HCT:36.8, MCV:91.2, MCH:31.0, MCHC:340, RDW:12.2, PLT:312, MPV:9.0,
    NEUT:3.0, NEUT_pct:57.1, LYMPH:1.59, LYMPH_pct:30.3, MONO_pct:7.3, EOS_pct:4.8, BASO_pct:0.5,
    CHOL:3.67, HDL:1.46, LDL:1.99, TRIG:0.49, TSH:1.649, PROL:1417.76, FERR:159.06 },

  "2025-07-07": { PROL:1342.06 },

  "2026-05-25": { WBC:5.44, RBC:4.12, HGB:126, HCT:37.7, MCV:91.4, MCH:30.5, MCHC:334, RDW:12.9, PLT:298, MPV:9.9,
    NEUT:2.99, NEUT_pct:54.9, LYMPH:1.63, LYMPH_pct:30.0, MONO_pct:6.8, EOS_pct:7.9, BASO_pct:0.4,
    K:3.9, Ca:2.23, ALP:55.2, TSH:1.787 },
};

// ── Marker definitions ────────────────────────────────────────────────────────
// [label, unit, refLow, refHigh, description]
const MARKERS = {
  HGB:      ["Haemoglobin",    "g/L",      117,   145,   "Oxygen-carrying protein in red blood cells"],
  FERR:     ["Ferritin",       "ng/mL",     15,   150,   "Iron storage protein; key indicator of iron reserves"],
  FE:       ["Iron (Fe)",      "µmol/L",  10.7,  32.2,  "Serum iron"],
  RBC:      ["Red Blood Cells","10¹²/L",   4.1,   5.1,  "RBC count"],
  VITD:     ["Vitamin D",      "nmol/L",    75,   250,   "25-OH vitamin D; optimal 75–200"],
  B12:      ["Vitamin B12",    "pmol/L",   145,   569,   "Cobalamin; critical for nerve function & DNA synthesis"],
  FOLIC:    ["Folate",         "nmol/L",    10,  42.4,  "Folic acid (B9); essential for cell division"],
  TSH:      ["TSH",            "mIU/L",   0.27,   4.2,  "Thyroid-stimulating hormone"],
  FT4:      ["Free T4",        "pmol/L",    12,    22,   "Free thyroxine"],
  FT3:      ["Free T3",        "pmol/L",   3.1,   6.8,  "Free triiodothyronine"],
  ATPO:     ["Anti-TPO",       "IU/mL",      0,    35,   "Thyroid peroxidase antibodies"],
  PROL:     ["Prolactin",      "mIU/L",    102,   496,   "Pituitary hormone; elevated → hyperprolactinaemia"],
  TESTO:    ["Testosterone",   "nmol/L",   0.1,   2.6,  "Female reference; elevated in PCOS"],
  DHEAS:    ["DHEA-S",         "µmol/L",   1.8,  12.2,  "Adrenal androgen"],
  LH:       ["LH",             "IU/L",    null,  null,   "Luteinising hormone (cycle-dependent)"],
  FSH:      ["FSH",            "IU/L",    null,  null,   "Follicle-stimulating hormone (cycle-dependent)"],
  GLU:      ["Glucose",        "mmol/L",   4.1,   5.9,  "Fasting blood glucose"],
  INS:      ["Insulin",        "mIU/L",      2,    25,   "Fasting insulin; high → insulin resistance"],
  HBA1C:    ["HbA1c",          "%",          0,   5.7,  "3-month average blood sugar"],
  CHOL:     ["Total Chol.",    "mmol/L",     0,   5.2,  "Total cholesterol"],
  LDL:      ["LDL",            "mmol/L",     0,   2.6,  "Low-density lipoprotein"],
  HDL:      ["HDL",            "mmol/L",   1.2,   9.9,  "High-density lipoprotein; higher is better"],
  TRIG:     ["Triglycerides",  "mmol/L",     0,   1.7,  "Blood fats; linked to metabolic health"],
  WBC:      ["Leukocytes",     "10⁹/L",    4.0,   9.8,  "White blood cell count"],
  PLT:      ["Platelets",      "10⁹/L",    140,   450,  "Clotting cells"],
  NEUT_pct: ["Neutrophils %",  "%",         40,    65,   "% of WBC; first responders to infection"],
  LYMPH_pct:["Lymphocytes %",  "%",         25,    37,   "% of WBC; adaptive immunity"],
  NEUT:     ["Neutrophils",    "10⁹/L",    1.5,   6.0,  "Absolute neutrophil count"],
  LYMPH:    ["Lymphocytes",    "10⁹/L",    1.0,   4.0,  "Absolute lymphocyte count"],
  EOS_pct:  ["Eosinophils %",  "%",          0,     5,  "Allergy / parasite marker"],
  CREA:     ["Creatinine",     "µmol/L",    45,    84,   "Kidney filtration marker"],
  GFR:      ["eGFR",           "mL/min",    90,  999,   "Estimated glomerular filtration rate"],
  ALT:      ["ALT",            "U/L",        0,    35,   "Liver enzyme; elevated → liver stress"],
  AST:      ["AST",            "U/L",        0,    35,   "Liver/muscle enzyme"],
  GGT:      ["GGT",            "U/L",        0,    38,   "Liver enzyme"],
  ALP:      ["ALP",            "U/L",       30,   120,  "Alkaline phosphatase"],
  HOMO:     ["Homocysteine",   "µmol/L",     0,    15,   "Cardiovascular & B-vitamin metabolism marker"],
  MG:       ["Magnesium",      "mmol/L",  0.77,  1.03,  "Intracellular mineral"],
  Ca:       ["Calcium",        "mmol/L",   2.2,  2.65,  "Serum calcium"],
  K:        ["Potassium",      "mmol/L",   3.5,   5.1,  "Electrolyte"],
};

// ── Helpers ───────────────────────────────────────────────────────────────────
const DATES = Object.keys(LAB_DATA).sort();

function getHistory(key) {
  return DATES.filter(d => LAB_DATA[d][key] != null)
    .map(d => ({ date: d, value: LAB_DATA[d][key] }));
}

function latest(key) {
  for (let i = DATES.length - 1; i >= 0; i--) {
    const v = LAB_DATA[DATES[i]][key];
    if (v != null) return { date: DATES[i], value: v };
  }
  return null;
}

function status(key, value) {
  const m = MARKERS[key];
  if (!m || m[2] == null) return "neutral";
  if (value < m[2]) return "low";
  if (value > m[3]) return "high";
  return "ok";
}

function fmt(v, key) {
  if (v == null) return "—";
  const decimals = v < 10 ? 2 : v < 100 ? 1 : 0;
  return v.toFixed(decimals);
}

// ── Sparkline ─────────────────────────────────────────────────────────────────
function Sparkline({ data, refLow, refHigh, color = "#60a5fa", height = 40 }) {
  if (!data || data.length < 2) return null;
  const vals = data.map(d => d.value);
  const lo = Math.min(...vals, refLow ?? Infinity);
  const hi = Math.max(...vals, refHigh ?? -Infinity);
  const pad = (hi - lo) * 0.1 || 1;
  const minY = lo - pad, maxY = hi + pad;
  const w = 200, h = height;
  const px = (i) => (i / (data.length - 1)) * w;
  const py = (v) => h - ((v - minY) / (maxY - minY)) * h;

  const pts = data.map((d, i) => `${px(i)},${py(d.value)}`).join(" ");

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ height }}>
      {/* ref band */}
      {refLow != null && refHigh != null && (
        <rect
          x={0} y={py(refHigh)} width={w} height={py(refLow) - py(refHigh)}
          fill="#22c55e" fillOpacity={0.08}
        />
      )}
      {/* ref lines */}
      {refLow != null && <line x1={0} y1={py(refLow)} x2={w} y2={py(refLow)} stroke="#22c55e" strokeWidth={0.8} strokeDasharray="3,3" />}
      {refHigh != null && <line x1={0} y1={py(refHigh)} x2={w} y2={py(refHigh)} stroke="#f97316" strokeWidth={0.8} strokeDasharray="3,3" />}
      {/* line */}
      <polyline points={pts} fill="none" stroke={color} strokeWidth={1.8} />
      {/* dots */}
      {data.map((d, i) => {
        const s = status(null, d.value); // color by range
        const inRange = refLow != null && refHigh != null
          ? d.value >= refLow && d.value <= refHigh
          : true;
        return (
          <circle key={i} cx={px(i)} cy={py(d.value)} r={3}
            fill={inRange ? color : (d.value < (refLow ?? 0) ? "#f97316" : "#ef4444")}
            stroke="white" strokeWidth={0.8}
          />
        );
      })}
    </svg>
  );
}

// ── Marker Card ───────────────────────────────────────────────────────────────
function MarkerCard({ mkey, showHistory = true }) {
  const [expanded, setExpanded] = useState(false);
  const def = MARKERS[mkey];
  if (!def) return null;
  const [label, unit, refLow, refHigh, desc] = def;
  const hist = getHistory(mkey);
  const lat = hist[hist.length - 1];

  if (!lat) return null;

  const s = status(mkey, lat.value);
  const statusColor = s === "ok" ? "text-green-400" : s === "low" ? "text-orange-400" : s === "high" ? "text-red-400" : "text-slate-400";
  const statusBg   = s === "ok" ? "border-green-500/30" : s === "low" ? "border-orange-500/40" : s === "high" ? "border-red-500/40" : "border-slate-600/40";
  const badge      = s === "ok" ? "bg-green-500/20 text-green-300" : s === "low" ? "bg-orange-500/20 text-orange-300" : s === "high" ? "bg-red-500/20 text-red-300" : "bg-slate-700/50 text-slate-400";
  const sparkColor = s === "ok" ? "#4ade80" : s === "low" ? "#fb923c" : s === "high" ? "#f87171" : "#94a3b8";

  const fmtDate = (d) => {
    const [y, m, day] = d.split("-");
    return `${day}/${m}/${y.slice(2)}`;
  };

  return (
    <div
      className={`rounded-xl border bg-slate-800/50 p-3 cursor-pointer transition-all hover:bg-slate-800/80 ${statusBg}`}
      onClick={() => setExpanded(e => !e)}
    >
      <div className="flex justify-between items-start mb-1">
        <span className="text-xs text-slate-400 font-medium">{label}</span>
        <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${badge}`}>
          {s === "ok" ? "✓" : s === "low" ? "↓ low" : s === "high" ? "↑ high" : "—"}
        </span>
      </div>
      <div className={`text-xl font-bold tabular-nums ${statusColor}`}>
        {fmt(lat.value, mkey)}
        <span className="text-xs font-normal text-slate-400 ml-1">{unit}</span>
      </div>
      {refLow != null && <div className="text-xs text-slate-500 mt-0.5">ref {refLow}–{refHigh}</div>}
      <div className="text-xs text-slate-500 mt-0.5">{fmtDate(lat.date)} · {hist.length} tests</div>

      {showHistory && hist.length > 1 && (
        <div className="mt-2">
          <Sparkline data={hist} refLow={refLow} refHigh={refHigh} color={sparkColor} height={36} />
        </div>
      )}

      {expanded && (
        <div className="mt-3 pt-3 border-t border-slate-700/50">
          <div className="text-xs text-slate-400 mb-2">{desc}</div>
          <table className="w-full text-xs">
            <tbody>
              {hist.map(({ date, value }) => {
                const s2 = status(mkey, value);
                const c2 = s2 === "ok" ? "text-green-400" : s2 === "low" ? "text-orange-400" : s2 === "high" ? "text-red-400" : "text-slate-300";
                return (
                  <tr key={date} className="border-b border-slate-700/30">
                    <td className="py-0.5 text-slate-400">{fmtDate(date)}</td>
                    <td className={`py-0.5 text-right font-mono ${c2}`}>{fmt(value, mkey)}</td>
                    <td className="py-0.5 text-right text-slate-500 pl-1">{unit}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ── Panel ─────────────────────────────────────────────────────────────────────
function Panel({ title, emoji, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="mb-5">
      <button
        className="flex items-center gap-2 w-full text-left mb-3"
        onClick={() => setOpen(o => !o)}
      >
        <span className="text-lg">{emoji}</span>
        <span className="text-sm font-semibold text-slate-200 uppercase tracking-wider">{title}</span>
        <span className="ml-auto text-slate-500 text-xs">{open ? "▲" : "▼"}</span>
      </button>
      {open && <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">{children}</div>}
    </div>
  );
}

// ── Timeline Chart ────────────────────────────────────────────────────────────
function TimelineChart({ mkeys }) {
  const [selected, setSelected] = useState(mkeys[0]);
  const hist = getHistory(selected);
  const def = MARKERS[selected];
  if (!def || hist.length < 1) return null;
  const [label, unit, refLow, refHigh] = def;

  return (
    <div className="rounded-xl border border-slate-700/50 bg-slate-800/50 p-4 mb-5">
      <div className="flex flex-wrap gap-2 mb-3">
        {mkeys.map(k => {
          const l = latest(k);
          if (!l) return null;
          const s = status(k, l.value);
          const active = k === selected;
          return (
            <button
              key={k}
              onClick={() => setSelected(k)}
              className={`text-xs px-2 py-1 rounded-full border transition-all ${active
                ? "bg-blue-500/30 border-blue-500/60 text-blue-300"
                : "bg-slate-700/50 border-slate-600/40 text-slate-400 hover:text-slate-200"
              }`}
            >
              {MARKERS[k][0]}
            </button>
          );
        })}
      </div>
      <div className="text-xs text-slate-400 mb-1">{label} <span className="text-slate-600">({unit})</span></div>
      <Sparkline data={hist} refLow={refLow} refHigh={refHigh} height={80} />
      <div className="flex justify-between text-xs text-slate-600 mt-1">
        <span>{hist[0].date.slice(0, 7)}</span>
        <span>{hist[hist.length - 1].date.slice(0, 7)}</span>
      </div>
    </div>
  );
}

// ── Conditions Card ───────────────────────────────────────────────────────────
function ConditionsCard() {
  return (
    <div className="rounded-xl border border-slate-700/50 bg-slate-800/50 p-4 mb-5">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">🏥</span>
        <span className="text-sm font-semibold text-slate-200 uppercase tracking-wider">Active Conditions</span>
      </div>
      <div className="space-y-2">
        {CONDITIONS.map(c => (
          <div key={c.code} className="flex gap-3 items-start">
            <span className="text-xs font-mono text-slate-500 bg-slate-700/50 px-1.5 py-0.5 rounded shrink-0 mt-0.5">{c.code}</span>
            <div>
              <span className="text-sm font-medium text-slate-200">{c.label}</span>
              <p className="text-xs text-slate-400 mt-0.5">{c.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Meds Card ─────────────────────────────────────────────────────────────────
function MedsCard() {
  return (
    <div className="rounded-xl border border-slate-700/50 bg-slate-800/50 p-4 mb-5">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">💊</span>
        <span className="text-sm font-semibold text-slate-200 uppercase tracking-wider">Medications & Supplements</span>
      </div>
      <div className="mb-3">
        {MEDICATIONS.map(m => (
          <div key={m.name} className="flex items-start gap-2 mb-1">
            <span className="text-xs bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded px-1.5 py-0.5 shrink-0">Rx</span>
            <div>
              <span className="text-sm font-medium text-slate-200">{m.name}</span>
              <span className="text-xs text-slate-400 ml-2">{m.freq} · since {m.since}</span>
              <p className="text-xs text-slate-500">{m.note}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-1.5">
        {SUPPLEMENTS.map(s => (
          <span key={s} className="text-xs bg-slate-700/50 text-slate-400 border border-slate-600/40 rounded-full px-2 py-0.5">{s}</span>
        ))}
      </div>
    </div>
  );
}

// ── Summary Stats ─────────────────────────────────────────────────────────────
function SummaryBar() {
  const keys = Object.keys(MARKERS);
  let ok = 0, low = 0, high = 0, unknown = 0;
  keys.forEach(k => {
    const l = latest(k);
    if (!l) return;
    const s = status(k, l.value);
    if (s === "ok") ok++;
    else if (s === "low") low++;
    else if (s === "high") high++;
    else unknown++;
  });
  const total = ok + low + high;
  return (
    <div className="flex gap-3 mb-5 flex-wrap">
      <div className="flex-1 min-w-[80px] rounded-xl bg-green-500/10 border border-green-500/20 p-3 text-center">
        <div className="text-2xl font-bold text-green-400">{ok}</div>
        <div className="text-xs text-green-600">in range</div>
      </div>
      <div className="flex-1 min-w-[80px] rounded-xl bg-orange-500/10 border border-orange-500/20 p-3 text-center">
        <div className="text-2xl font-bold text-orange-400">{low}</div>
        <div className="text-xs text-orange-600">low</div>
      </div>
      <div className="flex-1 min-w-[80px] rounded-xl bg-red-500/10 border border-red-500/20 p-3 text-center">
        <div className="text-2xl font-bold text-red-400">{high}</div>
        <div className="text-xs text-red-600">high</div>
      </div>
      <div className="flex-1 min-w-[80px] rounded-xl bg-slate-700/30 border border-slate-600/30 p-3 text-center">
        <div className="text-2xl font-bold text-slate-400">{DATES.length}</div>
        <div className="text-xs text-slate-500">test dates</div>
      </div>
    </div>
  );
}

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState("overview");
  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "iron",     label: "Iron & Blood" },
    { id: "hormones", label: "Hormones" },
    { id: "metabolic",label: "Metabolic" },
    { id: "vitamins", label: "Vitamins" },
    { id: "lipids",   label: "Lipids" },
    { id: "cbc",      label: "CBC" },
    { id: "organs",   label: "Organ Function" },
    { id: "history",  label: "History" },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100" style={{ fontFamily: "system-ui, sans-serif" }}>
      {/* Header */}
      <div className="bg-slate-800/80 border-b border-slate-700/50 px-4 py-4 sticky top-0 z-10 backdrop-blur">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <div>
            <div className="text-lg font-bold text-slate-100">🩺 {PATIENT.name}</div>
            <div className="text-xs text-slate-400">DOB {PATIENT.dob} · {PATIENT.age}y · Female · Updated {LAST_UPDATED}</div>
          </div>
          <div className="text-xs text-slate-500 text-right">
            <span className="text-xs bg-slate-700/60 border border-slate-600/40 rounded px-2 py-1">
              {DATES.length} blood draws
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-slate-800/40 border-b border-slate-700/40 px-4 sticky top-[61px] z-10 backdrop-blur">
        <div className="max-w-lg mx-auto flex gap-0.5 overflow-x-auto scrollbar-hide py-1.5">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-3 py-1.5 text-xs rounded-lg whitespace-nowrap transition-all ${
                tab === t.id
                  ? "bg-blue-600/80 text-white font-medium"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-700/40"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-lg mx-auto px-4 py-5">

        {tab === "overview" && (
          <>
            <SummaryBar />
            <ConditionsCard />
            <MedsCard />
            {/* Key watch markers */}
            <div className="mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">Key Watch Markers</div>
            <div className="grid grid-cols-2 gap-2 mb-5">
              {["FERR","HGB","VITD","TSH","PROL","TESTO","GLU","LDL"].map(k => <MarkerCard key={k} mkey={k} />)}
            </div>
            <TimelineChart mkeys={["FERR","HGB","PROL","VITD","LDL","TSH"]} />
          </>
        )}

        {tab === "iron" && (
          <>
            <div className="text-xs text-slate-400 bg-orange-500/10 border border-orange-500/20 rounded-xl p-3 mb-4">
              ⚠️ Recurrent iron deficiency (E61.1) driven by heavy menstruation (N92.0). Monitor ferritin &gt;40 ng/mL target.
            </div>
            <TimelineChart mkeys={["FERR","HGB","FE","RBC"]} />
            <Panel title="Iron & Blood" emoji="🩸" defaultOpen>
              {["HGB","FERR","FE","RBC"].map(k => <MarkerCard key={k} mkey={k} />)}
            </Panel>
          </>
        )}

        {tab === "hormones" && (
          <>
            <div className="text-xs text-slate-400 bg-purple-500/10 border border-purple-500/20 rounded-xl p-3 mb-4">
              🔬 Diagnosed PCOS (E28.2), elevated prolactin (E22.1) & androgen excess (E28.1). Pituitary MRI normal 2022 &amp; 2025.
            </div>
            <TimelineChart mkeys={["PROL","TESTO","TSH","ATPO"]} />
            <Panel title="Thyroid" emoji="🦋" defaultOpen>
              {["TSH","FT4","FT3","ATPO"].map(k => <MarkerCard key={k} mkey={k} />)}
            </Panel>
            <Panel title="Reproductive Hormones" emoji="⚡" defaultOpen>
              {["PROL","TESTO","DHEAS","LH","FSH"].map(k => <MarkerCard key={k} mkey={k} />)}
            </Panel>
          </>
        )}

        {tab === "metabolic" && (
          <>
            <div className="text-xs text-slate-400 bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-3 mb-4">
              ⚠️ Impaired glucose tolerance (E09.9). GTT Oct 2024: fasting 5.35 mmol/L. HOMA-IR 1.6. On Metformin from May 2025.
            </div>
            <TimelineChart mkeys={["GLU","INS","HBA1C","HOMO"]} />
            <Panel title="Glucose & Insulin" emoji="🍬" defaultOpen>
              {["GLU","INS","HBA1C","HOMO"].map(k => <MarkerCard key={k} mkey={k} />)}
            </Panel>
          </>
        )}

        {tab === "vitamins" && (
          <>
            <TimelineChart mkeys={["VITD","B12","FOLIC","MG"]} />
            <Panel title="Vitamins & Micronutrients" emoji="💊" defaultOpen>
              {["VITD","B12","FOLIC","MG","Ca","K"].map(k => <MarkerCard key={k} mkey={k} />)}
            </Panel>
          </>
        )}

        {tab === "lipids" && (
          <>
            <TimelineChart mkeys={["LDL","HDL","CHOL","TRIG"]} />
            <Panel title="Lipid Panel" emoji="🫀" defaultOpen>
              {["CHOL","LDL","HDL","TRIG"].map(k => <MarkerCard key={k} mkey={k} />)}
            </Panel>
          </>
        )}

        {tab === "cbc" && (
          <>
            <TimelineChart mkeys={["WBC","PLT","NEUT_pct","LYMPH_pct","EOS_pct"]} />
            <Panel title="Full Blood Count" emoji="🔬" defaultOpen>
              {["WBC","RBC","HGB","HCT","PLT","MPV","NEUT_pct","LYMPH_pct","MONO_pct","EOS_pct","NEUT","LYMPH"].map(k => <MarkerCard key={k} mkey={k} />)}
            </Panel>
          </>
        )}

        {tab === "organs" && (
          <>
            <TimelineChart mkeys={["ALT","AST","GGT","ALP","CREA","GFR"]} />
            <Panel title="Liver" emoji="🫁" defaultOpen>
              {["ALT","AST","GGT","ALP"].map(k => <MarkerCard key={k} mkey={k} />)}
            </Panel>
            <Panel title="Kidney" emoji="🫘" defaultOpen>
              {["CREA","GFR","UREA"].map(k => <MarkerCard key={k} mkey={k} />)}
            </Panel>
          </>
        )}

        {tab === "history" && (
          <>
            <div className="mb-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">All Test Dates</div>
            {[...DATES].reverse().map(date => {
              const row = LAB_DATA[date];
              const keys = Object.keys(row);
              return (
                <div key={date} className="mb-3 rounded-xl border border-slate-700/40 bg-slate-800/40 p-3">
                  <div className="text-sm font-semibold text-slate-200 mb-2">{date}</div>
                  <div className="flex flex-wrap gap-1.5">
                    {keys.map(k => {
                      const def = MARKERS[k];
                      if (!def) return null;
                      const s = status(k, row[k]);
                      const color = s === "ok" ? "text-green-400 bg-green-500/10 border-green-500/20"
                        : s === "low" ? "text-orange-400 bg-orange-500/10 border-orange-500/20"
                        : s === "high" ? "text-red-400 bg-red-500/10 border-red-500/20"
                        : "text-slate-400 bg-slate-700/40 border-slate-600/30";
                      return (
                        <span key={k} className={`text-xs border rounded-full px-2 py-0.5 ${color}`}>
                          {def[0]}: {fmt(row[k], k)} {def[1]}
                        </span>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-slate-600 pb-8 px-4">
        Data extracted from Rezus.lt lab reports & clinical records.<br />
        For medical decisions always consult your physician.
      </div>
    </div>
  );
}
