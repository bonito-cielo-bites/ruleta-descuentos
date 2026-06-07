import React, { useState, useEffect, useRef } from "react";

// ─────────────────────────────────────────────────────────────
//  RULETA DIGITAL · BONITO CIELO
//  Captura de datos (nombre + teléfono) y descuento aleatorio
// ─────────────────────────────────────────────────────────────

const STORE_KEY = "bonitocielo_leads_v1";
const ADMIN_PIN = "2468"; // ← cámbialo por tu PIN privado

// Premios en sentido horario desde arriba. "weight" controla la
// probabilidad (mayor = sale más seguido) para cuidar tu margen.
const PRIZES = [
    { label: "5%", sub: "DCTO", type: "pct", value: 5, weight: 23, color: "#E3A964", text: "#1B1840" },
    { label: "10%", sub: "DCTO", type: "pct", value: 10, weight: 15, color: "#2C2A5E", text: "#F4C879" },
    { label: "CASI", sub: "ganas", type: "lose", value: 0, weight: 12, color: "#6B5B95", text: "#FDF6EC" },
    { label: "5%", sub: "DCTO", type: "pct", value: 5, weight: 23, color: "#E3A964", text: "#1B1840" },
    { label: "10%", sub: "DCTO", type: "pct", value: 10, weight: 15, color: "#2C2A5E", text: "#F4C879" },
    { label: "CASI", sub: "ganas", type: "lose", value: 0, weight: 12, color: "#6B5B95", text: "#FDF6EC" },
];

const SEG = 360 / PRIZES.length;

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Manrope:wght@400;500;600;700;800&display=swap');

.bc-root *{ box-sizing:border-box; margin:0; padding:0; }
.bc-root{
  font-family:'Manrope',sans-serif;
  min-height:100vh; width:100%;
  position:relative; overflow:hidden;
  color:#FDF6EC;
  display:flex; align-items:center; justify-content:center;
  padding:28px 18px;
  background:
    radial-gradient(120% 80% at 50% -10%, #4a3f7d 0%, #2b2658 38%, #1a1640 70%, #120f30 100%);
}
/* horizon glow */
.bc-root::after{
  content:''; position:absolute; left:-10%; right:-10%; bottom:-14%;
  height:42%; pointer-events:none;
  background:radial-gradient(60% 100% at 50% 100%, rgba(244,169,136,.42) 0%, rgba(231,138,125,.16) 40%, transparent 72%);
  filter:blur(2px);
}
.bc-stars{ position:absolute; inset:0; pointer-events:none; }
.bc-star{ position:absolute; border-radius:50%; background:#fff; opacity:.7; animation:twinkle 3.6s ease-in-out infinite; }
@keyframes twinkle{ 0%,100%{opacity:.18; transform:scale(.7);} 50%{opacity:.9; transform:scale(1);} }

.bc-card{
  position:relative; z-index:2; width:100%; max-width:430px;
  display:flex; flex-direction:column; align-items:center; gap:22px;
  animation:rise .7s cubic-bezier(.16,1,.3,1) both;
}
@keyframes rise{ from{opacity:0; transform:translateY(18px);} to{opacity:1; transform:none;} }

.bc-brand{ text-align:center; user-select:none; }
.bc-kicker{ font-size:11px; letter-spacing:.42em; text-transform:uppercase; color:#E3A964; font-weight:700; }
.bc-logo{
  font-family:'Fraunces',serif; font-weight:600; font-size:42px; line-height:1;
  margin-top:6px; letter-spacing:-.01em;
  background:linear-gradient(180deg,#FDF6EC, #F4C879);
  -webkit-background-clip:text; background-clip:text; -webkit-text-fill-color:transparent;
}
.bc-tag{ margin-top:8px; font-size:13.5px; color:#cfc8e8; font-weight:500; }

.bc-panel{
  width:100%; background:rgba(255,255,255,.055);
  border:1px solid rgba(255,255,255,.12);
  border-radius:24px; padding:24px 22px;
  backdrop-filter:blur(10px);
  box-shadow:0 20px 50px -20px rgba(0,0,0,.6), inset 0 1px 0 rgba(255,255,255,.08);
}
.bc-h2{ font-family:'Fraunces',serif; font-size:24px; font-weight:600; line-height:1.15; }
.bc-sub{ font-size:13.5px; color:#c3bce0; margin-top:6px; line-height:1.5; }

.bc-field{ margin-top:18px; }
.bc-lab{ font-size:12px; font-weight:700; letter-spacing:.04em; text-transform:uppercase; color:#b8b0dc; margin-bottom:7px; display:block; }
.bc-input{
  width:100%; font-family:'Manrope',sans-serif; font-size:16px; font-weight:600; color:#fff;
  background:rgba(0,0,0,.22); border:1.5px solid rgba(255,255,255,.16);
  border-radius:14px; padding:14px 15px; outline:none; transition:.18s;
}
.bc-input::placeholder{ color:#8d86b0; font-weight:500; }
.bc-input:focus{ border-color:#E3A964; box-shadow:0 0 0 4px rgba(227,169,100,.18); background:rgba(0,0,0,.32); }
.bc-phonewrap{ display:flex; align-items:stretch; gap:8px; }
.bc-flag{ display:flex; align-items:center; gap:6px; padding:0 13px; border-radius:14px; background:rgba(0,0,0,.22); border:1.5px solid rgba(255,255,255,.16); font-weight:700; font-size:15px; color:#E3A964; white-space:nowrap; }
.bc-err{ color:#ff9fb0; font-size:12.5px; font-weight:600; margin-top:7px; }
.bc-news{ display:flex; align-items:center; gap:9px; margin-top:16px; padding:11px 13px; border-radius:13px;
  background:linear-gradient(135deg, rgba(244,200,121,.16), rgba(199,107,122,.12));
  border:1px solid rgba(244,200,121,.3); font-size:12.5px; color:#FDF6EC; line-height:1.4; }
.bc-news b{ color:#F4C879; }
.bc-news .dot{ width:8px; height:8px; flex:none; border-radius:50%; background:#F4C879; box-shadow:0 0 8px 2px rgba(244,200,121,.7); animation:twinkle 1.8s ease-in-out infinite; }

.bc-consent{ display:flex; gap:11px; align-items:flex-start; margin-top:18px; cursor:pointer; }
.bc-check{ width:22px; height:22px; flex:none; border-radius:7px; border:1.5px solid rgba(255,255,255,.3); background:rgba(0,0,0,.2); display:flex; align-items:center; justify-content:center; transition:.15s; margin-top:1px; }
.bc-check.on{ background:#E3A964; border-color:#E3A964; }
.bc-consent span{ font-size:12px; color:#b8b0dc; line-height:1.45; }

.bc-btn{
  width:100%; margin-top:22px; border:none; cursor:pointer;
  font-family:'Manrope',sans-serif; font-weight:800; font-size:16px; letter-spacing:.02em;
  color:#1B1840; padding:16px; border-radius:16px;
  background:linear-gradient(135deg,#F4C879 0%, #E3A964 60%, #d98f55 100%);
  box-shadow:0 14px 30px -10px rgba(227,169,100,.6), inset 0 1px 0 rgba(255,255,255,.4);
  transition:transform .12s, box-shadow .2s, opacity .2s;
}
.bc-btn:hover{ transform:translateY(-2px); box-shadow:0 18px 36px -10px rgba(227,169,100,.75); }
.bc-btn:active{ transform:translateY(0); }
.bc-btn:disabled{ opacity:.45; cursor:not-allowed; transform:none; box-shadow:none; }
.bc-btn.ghost{ background:transparent; color:#cfc8e8; box-shadow:none; border:1.5px solid rgba(255,255,255,.2); font-weight:700; }
.bc-btn.ghost:hover{ background:rgba(255,255,255,.06); transform:none; }

/* WHEEL */
.bc-wheelwrap{ position:relative; width:300px; height:300px; margin:4px auto 6px; }
.bc-pointer{ position:absolute; top:-6px; left:50%; transform:translateX(-50%); z-index:5; filter:drop-shadow(0 4px 6px rgba(0,0,0,.5)); }
.bc-wheel{ width:100%; height:100%; transition:transform 5.2s cubic-bezier(.12,.78,.16,1); }
.bc-rim{ position:absolute; inset:-10px; border-radius:50%; pointer-events:none;
  box-shadow:0 0 0 6px rgba(244,200,121,.22), 0 0 38px 6px rgba(244,200,121,.28), 0 24px 50px -16px rgba(0,0,0,.7); }
.bc-hub{
  position:absolute; top:50%; left:50%; width:78px; height:78px; transform:translate(-50%,-50%);
  border-radius:50%; z-index:4; border:none; cursor:pointer;
  background:radial-gradient(circle at 35% 30%, #fff6e6, #F4C879 55%, #d98f55 100%);
  box-shadow:0 8px 18px -4px rgba(0,0,0,.5), inset 0 1px 2px rgba(255,255,255,.7);
  display:flex; align-items:center; justify-content:center; flex-direction:column;
  font-family:'Fraunces',serif; font-weight:700; font-size:14px; color:#1B1840; letter-spacing:.04em;
  transition:transform .12s;
}
.bc-hub:hover:not(:disabled){ transform:translate(-50%,-50%) scale(1.05); }
.bc-hub:disabled{ cursor:default; }

.bc-greet{ text-align:center; }
.bc-greet .n{ color:#F4C879; }

/* RESULT */
.bc-prizebig{ font-family:'Fraunces',serif; font-weight:700; font-size:62px; line-height:1;
  background:linear-gradient(180deg,#FDF6EC,#F4C879); -webkit-background-clip:text; background-clip:text; -webkit-text-fill-color:transparent; }
.bc-code{
  margin-top:18px; width:100%; text-align:center; padding:16px;
  border:1.5px dashed rgba(244,200,121,.55); border-radius:16px; background:rgba(244,200,121,.07);
}
.bc-code .lab{ font-size:11px; letter-spacing:.3em; text-transform:uppercase; color:#b8b0dc; font-weight:700; }
.bc-code .val{ font-family:'Fraunces',serif; font-weight:700; font-size:30px; letter-spacing:.12em; color:#F4C879; margin-top:4px; }
.bc-code .exp{ font-size:12px; font-weight:700; color:#9b8fd0; margin-top:10px; letter-spacing:.02em; }

.bc-confetti{ position:fixed; inset:0; pointer-events:none; z-index:30; overflow:hidden; }
.bc-conf{ position:absolute; top:-12px; width:9px; height:14px; border-radius:2px; animation:fall linear forwards; }
@keyframes fall{ to{ transform:translateY(108vh) rotate(720deg); opacity:.2; } }

/* ADMIN */
.bc-admindot{ position:fixed; bottom:12px; right:12px; z-index:20; width:30px; height:30px; border-radius:50%;
  border:1px solid rgba(255,255,255,.18); background:rgba(255,255,255,.06); color:#8d86b0; cursor:pointer; font-size:13px; }
.bc-overlay{ position:fixed; inset:0; z-index:40; background:rgba(10,8,28,.82); backdrop-filter:blur(6px);
  display:flex; align-items:center; justify-content:center; padding:18px; animation:rise .3s both; }
.bc-modal{ width:100%; max-width:560px; max-height:88vh; overflow:auto; background:#1a1640;
  border:1px solid rgba(255,255,255,.14); border-radius:22px; padding:22px; }
.bc-row{ display:flex; justify-content:space-between; align-items:center; gap:10px; }
.bc-stat{ display:flex; gap:10px; flex-wrap:wrap; margin:16px 0; }
.bc-pill{ background:rgba(255,255,255,.07); border:1px solid rgba(255,255,255,.12); border-radius:12px; padding:10px 13px; flex:1; min-width:90px; }
.bc-pill .v{ font-family:'Fraunces',serif; font-size:26px; font-weight:700; color:#F4C879; }
.bc-pill .k{ font-size:11px; color:#b8b0dc; text-transform:uppercase; letter-spacing:.05em; }
.bc-table{ width:100%; border-collapse:collapse; font-size:13px; margin-top:6px; }
.bc-table th{ text-align:left; color:#b8b0dc; font-size:11px; text-transform:uppercase; letter-spacing:.04em; padding:8px 6px; border-bottom:1px solid rgba(255,255,255,.12); }
.bc-table td{ padding:9px 6px; border-bottom:1px solid rgba(255,255,255,.06); color:#e7e2f7; }
.bc-mini{ font-size:13px; font-weight:700; padding:9px 14px; border-radius:11px; border:none; cursor:pointer; }
.bc-empty{ text-align:center; color:#8d86b0; padding:30px 0; font-size:14px; }
`;

function segPath(cx, cy, r, startDeg, endDeg) {
    const s = (startDeg) * Math.PI / 180;
    const e = (endDeg) * Math.PI / 180;
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

const STARS = Array.from({ length: 46 }).map(() => ({
    top: Math.random() * 100, left: Math.random() * 100,
    size: Math.random() * 2 + 1, delay: Math.random() * 4,
}));

export default function App() {
    const [screen, setScreen] = useState("entry");
    const [form, setForm] = useState({ name: "", phone: "", consent: false });
    const [touched, setTouched] = useState(false);
    const [rotation, setRotation] = useState(0);
    const [spinning, setSpinning] = useState(false);
    const [result, setResult] = useState(null);
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showConf, setShowConf] = useState(false);

    const [adminOpen, setAdminOpen] = useState(false);
    const [authed, setAuthed] = useState(false);
    const [pin, setPin] = useState("");
    const [confirmClear, setConfirmClear] = useState(false);

    const finalIdx = useRef(0);
    const finalCode = useRef("");

    useEffect(() => {
        (async () => {
            try {
                const r = await window.storage.get(STORE_KEY);
                if (r && r.value) setLeads(JSON.parse(r.value));
            } catch (e) { /* sin datos aún */ }
            setLoading(false);
        })();
    }, []);

    const cleanPhone = form.phone.replace(/\D/g, "");
    const phoneOk = /^3\d{9}$/.test(cleanPhone);
    const nameOk = form.name.trim().length >= 2;
    const canContinue = nameOk && phoneOk && form.consent;

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

    async function finishSpin() {
        if (!spinning) return;
        setSpinning(false);
        const prize = PRIZES[finalIdx.current];
        const isWin = prize.type === "pct";
        const lead = {
            name: form.name.trim(),
            phone: "+57" + cleanPhone,
            prize: isWin ? prize.value + "% dcto" : "Casi ganas",
            code: isWin ? finalCode.current : "—",
            date: new Date().toISOString(),
        };
        setResult({ prize, code: finalCode.current });
        const next = [lead, ...leads];
        setLeads(next);
        try { await window.storage.set(STORE_KEY, JSON.stringify(next)); } catch (e) { console.error(e); }
        if (isWin) {
            setShowConf(true);
            setTimeout(() => setShowConf(false), 2600);
        }
        setTimeout(() => setScreen("result"), 650);
    }

    function reset() {
        setForm({ name: "", phone: "", consent: false });
        setTouched(false);
        setResult(null);
        setScreen("entry");
    }

    function exportCSV() {
        const head = ["Nombre", "Telefono", "Premio", "Codigo", "Fecha"];
        const rows = leads.map((l) => [l.name, l.phone, l.prize, l.code,
        new Date(l.date).toLocaleString("es-CO")]);
        const csv = "\ufeff" + [head, ...rows]
            .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
            .join("\n");
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url; a.download = "clientes_bonito_cielo.csv"; a.click();
        URL.revokeObjectURL(url);
    }

    async function clearAll() {
        setLeads([]);
        try { await window.storage.set(STORE_KEY, JSON.stringify([])); } catch (e) { }
        setConfirmClear(false);
    }

    const prizeCounts = {};
    leads.forEach((l) => { prizeCounts[l.prize] = (prizeCounts[l.prize] || 0) + 1; });

    return (
        <div className="bc-root">
            <style>{CSS}</style>

            <div className="bc-stars">
                {STARS.map((s, i) => (
                    <span key={i} className="bc-star" style={{
                        top: s.top + "%", left: s.left + "%", width: s.size, height: s.size,
                        animationDelay: s.delay + "s",
                    }} />
                ))}
            </div>

            {showConf && (
                <div className="bc-confetti">
                    {Array.from({ length: 60 }).map((_, i) => {
                        const colors = ["#F4C879", "#E3A964", "#C76B7A", "#FDF6EC", "#6b5b95"];
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
                <div className="bc-brand" onClick={() => { /* marca */ }}>
                    <div className="bc-kicker">Feria de Emprendimiento</div>
                    <div className="bc-logo">Bonito Cielo</div>
                    <div className="bc-tag">Gira la ruleta y llévate tu descuento ✦</div>
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
                            <label className="bc-lab">Nombre</label>
                            <input className="bc-input" placeholder="Tu nombre"
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })} />
                            {touched && !nameOk && <div className="bc-err">Escribe tu nombre.</div>}
                        </div>

                        <div className="bc-field">
                            <label className="bc-lab">Celular</label>
                            <div className="bc-phonewrap">
                                <div className="bc-flag">🇨🇴 +57</div>
                                <input className="bc-input" inputMode="numeric" placeholder="300 000 0000"
                                    value={form.phone}
                                    onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                            </div>
                            {touched && !phoneOk && <div className="bc-err">Ingresa un celular válido (10 dígitos).</div>}
                        </div>

                        <div className="bc-consent" onClick={() => setForm({ ...form, consent: !form.consent })}>
                            <div className={"bc-check" + (form.consent ? " on" : "")}>
                                {form.consent && (
                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#1B1840" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                                )}
                            </div>
                            <span>Autorizo a Bonito Cielo el tratamiento de mis datos para recibir información y promociones.</span>
                        </div>
                        {touched && !form.consent && <div className="bc-err">Necesitamos tu autorización para continuar.</div>}

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
                                <svg width="34" height="40" viewBox="0 0 34 40">
                                    <path d="M17 38 L2 8 Q17 -2 32 8 Z" fill="#C76B7A" stroke="#FDF6EC" strokeWidth="2" />
                                </svg>
                            </div>
                            <svg className="bc-wheel" viewBox="0 0 300 300"
                                style={{ transform: `rotate(${rotation}deg)` }}
                                onTransitionEnd={finishSpin}>
                                {PRIZES.map((p, i) => (
                                    <path key={i} d={segPath(150, 150, 148, i * SEG, (i + 1) * SEG)}
                                        fill={p.color} stroke="#1a1640" strokeWidth="1.5" />
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
                                                fontFamily="Fraunces, serif" fontWeight="700" fontSize={p.type === "pct" ? 22 : 15}
                                                fill={p.text}>{p.label}</text>
                                            <text x={x} y={y + 11} textAnchor="middle"
                                                fontFamily="Manrope, sans-serif" fontWeight="700" fontSize="9"
                                                letterSpacing="1" fill={p.text} opacity="0.85">{p.sub.toUpperCase()}</text>
                                        </g>
                                    );
                                })}
                                <circle cx="150" cy="150" r="148" fill="none" stroke="#F4C879" strokeWidth="2" opacity="0.5" />
                            </svg>
                            <button className="bc-hub" onClick={spin} disabled={spinning}>
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
                                <div className="bc-kicker" style={{ color: "#9b8fd0" }}>¡Uy, {form.name.split(" ")[0]}!</div>
                                <div className="bc-prizebig" style={{ fontSize: 44, marginTop: 12, lineHeight: 1.1 }}>¡Casi ganas!</div>
                                <div className="bc-sub" style={{ marginTop: 12 }}>Estuviste muy cerca. Ya quedaste en nuestra lista, así que pásate por el stand y vuelve a visitarnos pronto. ✦</div>
                                <button className="bc-btn ghost" onClick={reset}>Registrar otro cliente</button>
                            </>
                        ) : (
                            <>
                                <div className="bc-kicker" style={{ color: "#C76B7A" }}>¡Felicidades {form.name.split(" ")[0]}!</div>
                                <div className="bc-prizebig" style={{ marginTop: 8 }}>{result.prize.value}%</div>
                                <div className="bc-h2" style={{ marginTop: 2 }}>de descuento</div>
                                <div className="bc-sub" style={{ marginTop: 10 }}>Válido en tu próxima compra en Bonito Cielo.</div>
                                <div className="bc-code">
                                    <div className="lab">Tu código</div>
                                    <div className="val">{result.code}</div>
                                    <div className="exp">Redímelo hasta el 30 de junio de 2026</div>
                                </div>
                                <button className="bc-btn ghost" onClick={reset}>Registrar otro cliente</button>
                            </>
                        )}
                    </div>
                )}
            </div>

            {/* ADMIN ACCESS */}
            <button className="bc-admindot" title="Panel"
                onClick={() => { setAdminOpen(true); setAuthed(false); setPin(""); }}>⚙</button>

            {adminOpen && (
                <div className="bc-overlay" onClick={(e) => { if (e.target === e.currentTarget) setAdminOpen(false); }}>
                    <div className="bc-modal">
                        {!authed ? (
                            <>
                                <div className="bc-row">
                                    <div className="bc-h2" style={{ fontSize: 20 }}>Panel del stand</div>
                                    <button className="bc-mini" style={{ background: "rgba(255,255,255,.1)", color: "#fff" }} onClick={() => setAdminOpen(false)}>Cerrar</button>
                                </div>
                                <div className="bc-sub" style={{ marginTop: 10 }}>Ingresa el PIN para ver los clientes registrados.</div>
                                <input className="bc-input" style={{ marginTop: 14 }} type="password" inputMode="numeric"
                                    placeholder="PIN" value={pin} onChange={(e) => setPin(e.target.value)} />
                                <button className="bc-btn" onClick={() => { if (pin === ADMIN_PIN) setAuthed(true); }}>Entrar</button>
                                {pin && pin !== ADMIN_PIN && <div className="bc-err">PIN incorrecto.</div>}
                            </>
                        ) : (
                            <>
                                <div className="bc-row">
                                    <div className="bc-h2" style={{ fontSize: 20 }}>Clientes registrados</div>
                                    <button className="bc-mini" style={{ background: "rgba(255,255,255,.1)", color: "#fff" }} onClick={() => setAdminOpen(false)}>Cerrar</button>
                                </div>

                                <div className="bc-stat">
                                    <div className="bc-pill"><div className="v">{leads.length}</div><div className="k">Clientes</div></div>
                                    {Object.entries(prizeCounts).slice(0, 3).map(([k, v]) => (
                                        <div className="bc-pill" key={k}><div className="v">{v}</div><div className="k">{k}</div></div>
                                    ))}
                                </div>

                                <div className="bc-row" style={{ marginBottom: 10 }}>
                                    <button className="bc-mini" style={{ background: "linear-gradient(135deg,#F4C879,#E3A964)", color: "#1B1840" }}
                                        onClick={exportCSV} disabled={!leads.length}>↓ Exportar CSV</button>
                                    {!confirmClear ? (
                                        <button className="bc-mini" style={{ background: "rgba(199,107,122,.25)", color: "#ffb3c0" }}
                                            onClick={() => setConfirmClear(true)} disabled={!leads.length}>Borrar todo</button>
                                    ) : (
                                        <span style={{ display: "flex", gap: 6 }}>
                                            <button className="bc-mini" style={{ background: "#C76B7A", color: "#fff" }} onClick={clearAll}>Confirmar</button>
                                            <button className="bc-mini" style={{ background: "rgba(255,255,255,.1)", color: "#fff" }} onClick={() => setConfirmClear(false)}>Cancelar</button>
                                        </span>
                                    )}
                                </div>

                                {loading ? <div className="bc-empty">Cargando…</div> :
                                    leads.length === 0 ? <div className="bc-empty">Aún no hay clientes registrados.</div> : (
                                        <table className="bc-table">
                                            <thead><tr><th>Nombre</th><th>Celular</th><th>Premio</th><th>Código</th></tr></thead>
                                            <tbody>
                                                {leads.map((l, i) => (
                                                    <tr key={i}>
                                                        <td>{l.name}</td><td>{l.phone}</td><td>{l.prize}</td><td>{l.code}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    )}
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}