import React, { useState, useRef } from "react";
import logoImg from "./assets/logo.png";


const PRIZES = [
    { label: "5%", sub: "DCTO", type: "pct", value: 5, weight: 27, color: "#e2a9ef", text: "#2a1f3d" },
    { label: "10%", sub: "DCTO", type: "pct", value: 10, weight: 8, color: "#5879d8", text: "#ffffff" },
    { label: "CASI", sub: "ganas", type: "lose", value: 0, weight: 16, color: "#bda9e5", text: "#2a1f3d" },
    { label: "5%", sub: "DCTO", type: "pct", value: 5, weight: 27, color: "#e2a9ef", text: "#2a1f3d" },
    { label: "10%", sub: "DCTO", type: "pct", value: 10, weight: 8, color: "#5879d8", text: "#ffffff" },
    { label: "CASI", sub: "ganas", type: "lose", value: 0, weight: 16, color: "#bda9e5", text: "#2a1f3d" },
];

const SEG = 360 / PRIZES.length;

const INSTAGRAM_URL = "https://www.instagram.com/bonitocielo__";
const WA_NUMBER = "5723476636";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&family=Nunito:wght@400;500;600;700;800&display=swap');

.bc-root *{ box-sizing:border-box; margin:0; padding:0; }
.bc-root{
  font-family:'Nunito',sans-serif;
  min-height:100dvh; width:100%;
  position:relative; overflow:hidden;
  color:#2a1f3d;
  display:flex; align-items:center; justify-content:center;
  padding:28px 18px;
  background: #f5e4ee;
}
.bc-bubbles{ position:absolute; inset:0; pointer-events:none; }
.bc-bubble{ position:absolute; border-radius:50%; animation:drift 6s ease-in-out infinite; }
@keyframes drift{ 0%,100%{opacity:.18; transform:translateY(0) scale(.85);} 50%{opacity:.45; transform:translateY(-14px) scale(1);} }

.bc-card{
  position:relative; z-index:2; width:100%; max-width:430px;
  display:flex; flex-direction:column; align-items:center; gap:20px;
  animation:rise .7s cubic-bezier(.16,1,.3,1) both;
}
@keyframes rise{ from{opacity:0; transform:translateY(18px);} to{opacity:1; transform:none;} }

.bc-brand{ text-align:center; user-select:none; }
.bc-kicker{ font-size:11px; letter-spacing:.42em; text-transform:uppercase; color:#5879d8; font-weight:700; }
.bc-logo{ display:block; width:180px; margin:6px auto 0; }
.bc-tag{ margin-top:6px; font-size:13.5px; color:#6b5b8a; font-weight:600; }

.bc-panel{
  width:100%; background:rgba(255,255,255,.85);
  border:1px solid rgba(88,121,216,.18);
  border-radius:24px; padding:24px 22px;
  backdrop-filter:blur(8px);
  box-shadow:0 20px 50px -22px rgba(88,121,216,.25), inset 0 1px 0 rgba(255,255,255,.9);
}
.bc-h2{ font-family:'Fredoka',sans-serif; font-size:24px; font-weight:600; line-height:1.15; color:#2a1f3d; }
.bc-sub{ font-size:13.5px; color:#6b5b8a; margin-top:6px; line-height:1.5; }

.bc-field{ margin-top:16px; }
.bc-lab{ font-size:12px; font-weight:700; letter-spacing:.04em; text-transform:uppercase; color:#8b7aac; margin-bottom:7px; display:block; }
.bc-input{
  width:100%; font-family:'Nunito',sans-serif; font-size:16px; font-weight:600; color:#2a1f3d;
  background:rgba(255,255,255,.7); border:1.5px solid #d4c4e0;
  border-radius:14px; padding:14px 15px; outline:none; transition:.18s;
}
.bc-input::placeholder{ color:#b5a8cb; font-weight:500; }
.bc-input:focus{ border-color:#5879d8; box-shadow:0 0 0 4px rgba(88,121,216,.18); background:#fff; }
.bc-input:focus-visible{ outline:none; }
.bc-phonewrap{ display:flex; align-items:stretch; gap:8px; }
.bc-flag{ display:flex; align-items:center; gap:6px; padding:0 13px; border-radius:14px; background:rgba(255,255,255,.7); border:1.5px solid #d4c4e0; font-weight:700; font-size:15px; color:#5879d8; white-space:nowrap; }
.bc-err{ color:#e24c04; font-size:12.5px; font-weight:700; margin-top:7px; }
.bc-news{ display:flex; align-items:center; gap:9px; margin-top:14px; padding:11px 13px; border-radius:13px;
  background:rgba(189,169,229,.3);
  border:1px solid rgba(189,169,229,.5); font-size:12.5px; color:#2a1f3d; line-height:1.4; }
.bc-news b{ color:#e24c04; }
.bc-news .dot{ width:8px; height:8px; flex:none; border-radius:50%; background:#e24c04; box-shadow:0 0 8px 2px rgba(226,76,4,.5); animation:drift 1.8s ease-in-out infinite; }

.bc-consent{ display:flex; gap:11px; align-items:flex-start; margin-top:16px; cursor:pointer; }
.bc-consent:focus-visible{ outline:2px solid #5879d8; outline-offset:3px; border-radius:8px; }
.bc-check{ width:22px; height:22px; flex:none; border-radius:7px; border:1.5px solid #d4c4e0; background:rgba(255,255,255,.7); display:flex; align-items:center; justify-content:center; transition:.15s; margin-top:1px; }
.bc-check.on{ background:#5879d8; border-color:#5879d8; }
.bc-consent span{ font-size:12px; color:#8b7aac; line-height:1.45; }

.bc-btn{
  width:100%; margin-top:20px; border:none; cursor:pointer;
  font-family:'Nunito',sans-serif; font-weight:800; font-size:16px; letter-spacing:.02em;
  color:#fff; padding:16px; border-radius:16px;
  background:#e24c04;
  box-shadow:0 14px 30px -10px rgba(226,76,4,.4);
  transition:transform .12s, box-shadow .2s, opacity .2s;
}
.bc-btn:hover{ transform:translateY(-2px); box-shadow:0 18px 36px -10px rgba(226,76,4,.55); }
.bc-btn:active{ transform:translateY(0); }
.bc-btn:disabled{ opacity:.45; cursor:not-allowed; transform:none; box-shadow:none; }
.bc-btn:focus-visible{ outline:3px solid #5879d8; outline-offset:3px; }
.bc-btn.ghost{ background:transparent; color:#6b5b8a; box-shadow:none; border:1.5px solid #d4c4e0; font-weight:700; }
.bc-btn.ghost:hover{ background:rgba(88,121,216,.06); transform:none; }

/* WHEEL */
.bc-wheelwrap{ position:relative; width:300px; height:300px; margin:4px auto 6px; }
.bc-pointer{ position:absolute; top:-6px; left:50%; transform:translateX(-50%); z-index:5; filter:drop-shadow(0 4px 6px rgba(0,0,0,.25)); }
.bc-wheel{ width:100%; height:100%; transition:transform 5.2s cubic-bezier(.12,.78,.16,1); }
.bc-rim{ position:absolute; inset:-10px; border-radius:50%; pointer-events:none;
  box-shadow:0 0 0 6px rgba(226,76,4,.2), 0 0 38px 6px rgba(226,76,4,.18), 0 24px 50px -16px rgba(88,121,216,.25); }
.bc-hub{
  position:absolute; top:50%; left:50%; width:78px; height:78px; transform:translate(-50%,-50%);
  border-radius:50%; z-index:4; border:none; cursor:pointer;
  background:#e24c04;
  box-shadow:0 8px 18px -4px rgba(226,76,4,.4);
  display:flex; align-items:center; justify-content:center; flex-direction:column;
  font-family:'Fredoka',sans-serif; font-weight:700; font-size:14px; color:#fff; letter-spacing:.04em;
  transition:transform .12s;
}
.bc-hub:hover:not(:disabled){ transform:translate(-50%,-50%) scale(1.05); }
.bc-hub:disabled{ cursor:default; }
.bc-hub:focus-visible{ outline:3px solid #2a1f3d; outline-offset:4px; }

.bc-greet{ text-align:center; }
.bc-greet .n{ color:#e24c04; }

/* RESULT */
.bc-prizebig{ font-family:'Fredoka',sans-serif; font-weight:700; font-size:62px; line-height:1; color:#e24c04; }
.bc-code{
  margin-top:16px; width:100%; text-align:center; padding:14px;
  border:1.5px dashed rgba(88,121,216,.5); border-radius:16px; background:rgba(88,121,216,.07);
}
.bc-code .lab{ font-size:11px; letter-spacing:.3em; text-transform:uppercase; color:#8b7aac; font-weight:700; }
.bc-code .val{ font-family:'Fredoka',sans-serif; font-weight:700; font-size:28px; letter-spacing:.12em; color:#e24c04; margin-top:4px; }
.bc-code .exp{ font-size:12px; font-weight:700; color:#8b7aac; margin-top:8px; letter-spacing:.02em; }

/* LINKTREE */
.bc-linktree{ width:100%; margin-top:18px; display:flex; flex-direction:column; gap:10px; }
.bc-linktree-head{ font-family:'Fredoka',sans-serif; font-size:18px; font-weight:600; color:#2a1f3d; text-align:center; margin-bottom:2px; }
.bc-link{
  display:flex; align-items:center; justify-content:center; gap:10px;
  width:100%; min-height:52px; padding:14px 18px; border-radius:14px;
  font-family:'Nunito',sans-serif; font-weight:700; font-size:15px;
  text-decoration:none; transition:transform .12s, box-shadow .2s;
  cursor:pointer; border:none;
}
.bc-link:hover{ transform:translateY(-2px); }
.bc-link:active{ transform:translateY(0); }
.bc-link:focus-visible{ outline:3px solid #2a1f3d; outline-offset:3px; }
.bc-link.wa{
  background:rgba(37,211,102,.12); border:1.5px solid rgba(37,211,102,.4);
  color:#1a6e3d;
  box-shadow:0 6px 20px -8px rgba(37,211,102,.3);
}
.bc-link.wa:hover{ box-shadow:0 10px 24px -8px rgba(37,211,102,.4); }
.bc-link.ig{
  background:rgba(226,169,239,.25);
  border:1.5px solid rgba(226,76,4,.25);
  color:#7d2a5e;
  box-shadow:0 6px 20px -8px rgba(226,76,4,.2);
}
.bc-link.ig:hover{ box-shadow:0 10px 24px -8px rgba(226,76,4,.3); }

.bc-confetti{ position:fixed; inset:0; pointer-events:none; z-index:30; overflow:hidden; }
.bc-conf{ position:absolute; top:-12px; width:9px; height:14px; border-radius:2px; animation:fall linear forwards; }
@keyframes fall{ to{ transform:translateY(108vh) rotate(720deg); opacity:.2; } }

@media (prefers-reduced-motion: reduce) {
  .bc-card{ animation:none; }
  .bc-bubble{ animation:none; opacity:.25; }
  .bc-wheel{ transition:none; }
  .bc-btn, .bc-link{ transition:none; }
}
`;

function segPath(cx, cy, r, startDeg, endDeg) {
    const s = startDeg * Math.PI / 180;
    const e = endDeg * Math.PI / 180;
    const x1 = cx + r * Math.sin(s), y1 = cy - r * Math.cos(s);
    const x2 = cx + r * Math.sin(e), y2 = cy - r * Math.cos(e);
    return `M ${cx} ${cy} L ${x1.toFixed(2)} ${y1.toFixed(2)} A ${r} ${r} 0 0 1 ${x2.toFixed(2)} ${y2.toFixed(2)} Z`;
}

function weightedPick() {
    const total = PRIZES.reduce((a, p) => a + p.weight, 0);
    let n = Math.random() * total;
    for (let i = 0; i < PRIZES.length; i++) { if (n < PRIZES[i].weight) return i; n -= PRIZES[i].weight; }
    return 0;
}

function genCode() {
    const c = "ACDEFGHJKLMNPQRTUVWXY3479";
    let s = "";
    for (let i = 0; i < 4; i++) s += c[Math.floor(Math.random() * c.length)];
    return "BC-" + s;
}

function buildWhatsappUrl(prize, form, code) {
    const fullName = `${form.name.trim()} ${form.lastName.trim()}`;
    const phone = form.phone.replace(/\D/g, "");
    let text;
    if (prize.type === "pct") {
        text = `Hola! Soy ${fullName} (+57 ${phone}). Me gané un ${prize.value}% de descuento en la ruleta de Bonito Cielo. Mi código es ${code}.`;
    } else {
        text = `Hola! Soy ${fullName} (+57 ${phone}). Participé en la ruleta de Bonito Cielo y quiero saber más sobre sus pandebonos.`;
    }
    return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;
}

const BUBBLES = Array.from({ length: 16 }).map(() => ({
    top: Math.random() * 100,
    left: Math.random() * 100,
    size: Math.random() * 28 + 12,
    color: ["#e2a9ef", "#bda9e5", "#5879d8", "#e24c04"][Math.floor(Math.random() * 4)],
    delay: Math.random() * 5,
    duration: Math.random() * 4 + 4,
}));

const WA_ICON = (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
    </svg>
);

const IG_ICON = (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
    </svg>
);

export default function App() {
    const [screen, setScreen] = useState("entry");
    const [form, setForm] = useState({ name: "", lastName: "", phone: "", consent: false });
    const [touched, setTouched] = useState(false);
    const [rotation, setRotation] = useState(0);
    const [spinning, setSpinning] = useState(false);
    const [result, setResult] = useState(null);
    const [showConf, setShowConf] = useState(false);

    const finalIdx = useRef(0);
    const finalCode = useRef("");

    const cleanPhone = form.phone.replace(/\D/g, "");
    const phoneOk = /^3\d{9}$/.test(cleanPhone);
    const nameOk = form.name.trim().length >= 2;
    const lastNameOk = form.lastName.trim().length >= 2;
    const canContinue = nameOk && lastNameOk && phoneOk && form.consent;

    function goWheel() {
        setTouched(true);
        if (!canContinue) return;
        setScreen("wheel");
    }

    function spin() {
        if (spinning) return;
        const idx = weightedPick();
        finalIdx.current = idx;
        finalCode.current = genCode();
        const spins = 5 + Math.floor(Math.random() * 3);
        const jitter = Math.random() * 30 - 15;
        const targetMod = (((360 - (idx * SEG + SEG / 2) + jitter) % 360) + 360) % 360;
        const currentMod = ((rotation % 360) + 360) % 360;
        let delta = targetMod - currentMod;
        if (delta < 0) delta += 360;
        setSpinning(true);
        setRotation(rotation + spins * 360 + delta);
    }

    function finishSpin() {
        if (!spinning) return;
        setSpinning(false);
        const prize = PRIZES[finalIdx.current];
        const isWin = prize.type === "pct";
        setResult({ prize, code: finalCode.current });
        if (isWin) {
            setShowConf(true);
            setTimeout(() => setShowConf(false), 2600);
        }
        setTimeout(() => setScreen("result"), 650);
    }

    return (
        <div className="bc-root">
            <style>{CSS}</style>

            <div className="bc-bubbles">
                {BUBBLES.map((b, i) => (
                    <span key={i} className="bc-bubble" style={{
                        top: b.top + "%", left: b.left + "%",
                        width: b.size, height: b.size,
                        background: b.color, opacity: .15,
                        animationDelay: b.delay + "s",
                        animationDuration: b.duration + "s",
                    }} />
                ))}
            </div>

            {showConf && (
                <div className="bc-confetti">
                    {Array.from({ length: 60 }).map((_, i) => {
                        const colors = ["#e2a9ef", "#bda9e5", "#5879d8", "#e24c04", "#ff8c4a"];
                        return <span key={i} className="bc-conf" style={{
                            left: Math.random() * 100 + "%",
                            background: colors[i % colors.length],
                            animationDuration: (Math.random() * 1.6 + 2) + "s",
                            animationDelay: (Math.random() * .4) + "s",
                            transform: `rotate(${Math.random() * 360}deg)`,
                        }} />;
                    })}
                </div>
            )}

            <div className="bc-card">
                <div className="bc-brand">
                    <div className="bc-kicker">Feria de Emprendimiento</div>
                    <img src={logoImg} alt="Bonito Cielo" className="bc-logo" />
                    <div className="bc-tag">Gira la ruleta y llévate tu descuento</div>
                </div>

                {/* ENTRY */}
                {screen === "entry" && (
                    <div className="bc-panel">
                        <div className="bc-h2">¡Participa y gana!</div>
                        <div className="bc-sub">Déjanos tus datos para girar la ruleta y obtener un descuento especial en tu próxima compra.</div>
                        <div className="bc-news">
                            <span className="dot" />
                            Novedad: tienes hasta el <b>30 de junio de 2026</b> para redimir tu cupón.
                        </div>

                        <div className="bc-field">
                            <label className="bc-lab" htmlFor="bc-nombre">Nombre</label>
                            <input id="bc-nombre" className="bc-input" placeholder="Tu nombre"
                                autoComplete="given-name"
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })} />
                            {touched && !nameOk && <div className="bc-err" role="alert">Escribe tu nombre.</div>}
                        </div>

                        <div className="bc-field">
                            <label className="bc-lab" htmlFor="bc-apellido">Apellido</label>
                            <input id="bc-apellido" className="bc-input" placeholder="Tu apellido"
                                autoComplete="family-name"
                                value={form.lastName}
                                onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
                            {touched && !lastNameOk && <div className="bc-err" role="alert">Escribe tu apellido.</div>}
                        </div>

                        <div className="bc-field">
                            <label className="bc-lab" htmlFor="bc-celular">Número</label>
                            <div className="bc-phonewrap">
                                <div className="bc-flag">🇨🇴 +57</div>
                                <input id="bc-celular" className="bc-input" inputMode="numeric" placeholder="300 000 0000"
                                    autoComplete="tel"
                                    value={form.phone}
                                    onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                            </div>
                            {touched && !phoneOk && <div className="bc-err" role="alert">Ingresa un celular válido (10 dígitos).</div>}
                        </div>

                        <div className="bc-consent" tabIndex={0}
                            onClick={() => setForm({ ...form, consent: !form.consent })}
                            onKeyDown={(e) => e.key === " " && setForm({ ...form, consent: !form.consent })}>
                            <div className={"bc-check" + (form.consent ? " on" : "")} aria-hidden="true">
                                {form.consent && (
                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                                )}
                            </div>
                            <span>Autorizo a Bonito Cielo el tratamiento de mis datos para recibir información y promociones.</span>
                        </div>
                        {touched && !form.consent && <div className="bc-err" role="alert">Necesitamos tu autorización para continuar.</div>}

                        <button className="bc-btn" onClick={goWheel}>Continuar a la ruleta →</button>
                    </div>
                )}

                {/* WHEEL */}
                {screen === "wheel" && (
                    <div className="bc-panel" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <div className="bc-greet">
                            <div className="bc-h2">¡Tu turno, <span className="n">{form.name.split(" ")[0]}</span>!</div>
                            <div className="bc-sub">Toca el centro o el botón para girar.</div>
                        </div>

                        <div className="bc-wheelwrap">
                            <div className="bc-rim" />
                            <div className="bc-pointer">
                                <svg width="34" height="40" viewBox="0 0 34 40" aria-hidden="true">
                                    <path d="M17 38 L2 8 Q17 -2 32 8 Z" fill="#e24c04" stroke="#fff" strokeWidth="2" />
                                </svg>
                            </div>
                            <svg className="bc-wheel" viewBox="0 0 300 300"
                                style={{ transform: `rotate(${rotation}deg)` }}
                                onTransitionEnd={finishSpin}
                                aria-label="Ruleta de descuentos">
                                {PRIZES.map((p, i) => (
                                    <path key={i} d={segPath(150, 150, 148, i * SEG, (i + 1) * SEG)}
                                        fill={p.color} stroke="#e8d4ea" strokeWidth="1.5" />
                                ))}
                                {PRIZES.map((p, i) => {
                                    const mid = (i * SEG + SEG / 2) * Math.PI / 180;
                                    const lr = 100;
                                    const x = 150 + lr * Math.sin(mid);
                                    const y = 150 - lr * Math.cos(mid);
                                    const rot = i * SEG + SEG / 2;
                                    return (
                                        <g key={"t" + i} transform={`rotate(${rot} ${x} ${y})`}>
                                            <text x={x} y={y - 6} textAnchor="middle"
                                                fontFamily="Fredoka, sans-serif" fontWeight="700" fontSize={p.type === "pct" ? 22 : 15}
                                                fill={p.text}>{p.label}</text>
                                            <text x={x} y={y + 11} textAnchor="middle"
                                                fontFamily="Nunito, sans-serif" fontWeight="700" fontSize="9"
                                                letterSpacing="1" fill={p.text} opacity="0.85">{p.sub.toUpperCase()}</text>
                                        </g>
                                    );
                                })}
                                <circle cx="150" cy="150" r="148" fill="none" stroke="rgba(226,76,4,.3)" strokeWidth="2" />
                            </svg>
                            <button className="bc-hub" onClick={spin} disabled={spinning} aria-label="Girar la ruleta">
                                {spinning ? "···" : "GIRAR"}
                            </button>
                        </div>

                        <button className="bc-btn" onClick={spin} disabled={spinning}>
                            {spinning ? "Girando…" : "¡Girar la ruleta!"}
                        </button>
                    </div>
                )}

                {/* RESULT */}
                {screen === "result" && result && (
                    <div className="bc-panel" style={{ textAlign: "center" }}>
                        {result.prize.type === "lose" ? (
                            <>
                                <div className="bc-kicker" style={{ color: "#8b7aac" }}>¡Uy, {form.name.split(" ")[0]}!</div>
                                <div className="bc-prizebig" style={{ fontSize: 44, marginTop: 12, lineHeight: 1.1 }}>¡Casi ganas!</div>
                                <div className="bc-sub" style={{ marginTop: 12 }}>Estuviste muy cerca. Ya quedaste en nuestra lista, así que pásate por el stand y vuelve a visitarnos pronto.</div>
                            </>
                        ) : (
                            <>
                                <div className="bc-kicker" style={{ color: "#e24c04" }}>¡Felicidades {form.name.split(" ")[0]}!</div>
                                <div className="bc-prizebig" style={{ marginTop: 8 }}>{result.prize.value}%</div>
                                <div className="bc-h2" style={{ marginTop: 2 }}>de descuento</div>
                                <div className="bc-sub" style={{ marginTop: 8 }}>Válido en tu próxima compra en Bonito Cielo.</div>
                                <div className="bc-code">
                                    <div className="lab">Tu código</div>
                                    <div className="val">{result.code}</div>
                                    <div className="exp">Redímelo hasta el 30 de junio de 2026</div>
                                </div>
                            </>
                        )}

                        <div className="bc-linktree">
                            <div className="bc-linktree-head">Hablemos</div>
                            <a className="bc-link wa"
                                href={buildWhatsappUrl(result.prize, form, result.code)}
                                target="_blank" rel="noopener noreferrer"
                                aria-label="Escríbenos por WhatsApp">
                                {WA_ICON}
                                Escríbenos por WhatsApp
                            </a>
                            <a className="bc-link ig"
                                href={INSTAGRAM_URL}
                                target="_blank" rel="noopener noreferrer"
                                aria-label="Síguenos en Instagram">
                                {IG_ICON}
                                Síguenos en Instagram
                            </a>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
