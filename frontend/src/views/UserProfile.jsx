import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const API = import.meta.env.VITE_API_BASE_URL;

/* ─────────────────── Platform config ─────────────────────────────────── */
const PLATFORMS = {
  Leetcode: { logo: "https://img.icons8.com/external-tal-revivo-shadow-tal-revivo/24/external-level-up-your-coding-skills-and-quickly-land-a-job-logo-shadow-tal-revivo.png", color: "#f59e0b", key: "lcUsername", url: u => `https://leetcode.com/${u}` },
  Codeforces: { logo: "https://img.icons8.com/external-tal-revivo-filled-tal-revivo/24/external-codeforces-programming-competitions-and-contests-programming-community-logo-filled-tal-revivo.png", color: "#3b82f6", key: "cfUsername", url: u => `https://codeforces.com/profile/${u}` },
  GitHub: { logo: "https://img.icons8.com/ios-glyphs/30/github.png", color: "#e2e8f0", key: "githubUsername", url: u => `https://github.com/${u}` },
  GfG: { logo: "https://digitomize.com/assets/geeksforgeeks-1a83bb08.svg", color: "#22c55e", key: "gfgUsername", url: u => `https://auth.geeksforgeeks.org/user/${u}` },
  CodeChef: { logo: "https://digitomize.com/assets/codechef-f6a4f2da.svg", color: "#b45309", key: "ccUsername", url: u => `https://www.codechef.com/users/${u}` },
  HackerRank: { logo: "https://img.icons8.com/windows/32/hackerrank.png", color: "#10b981", key: "hrUsername", url: u => `https://www.hackerrank.com/profile/${u}` },
  CodingNinjas: { logo: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAaGVYSWZNTQAqAAAACAAEAQYAAwAAAAEAAgAAARIAAwAAAAEAAQAAASgAAwAAAAEAAgAAh2kABAAAAAEAAAA+AAAAAAADoAEAAwAAAAEAAQAAoAIABAAAAAEAAABfoAMABAAAAAEAAABfAAAAAPfNbXAAAAP5SURBVHicvZZPaFxVFMa/79z73mTG2Fg0pLUmbWyTagJKERFDNYILbVpQDK0uBK1pElLcuNCFS8GNIKhV1CiKoCCNrQspKP6BqMWNEanFP4lJkyxKxGqNTSYz8969x0WccTKZxHTy5ywevPfuvd/vnXfuPR+xghjubWiRmLfR4GZV7BDySq9qSehK5pcLBRBSnrLLDOB4z/b7lOxV1TYbyCYhoAVJVqoNAvAAcuqvKQswfGTXdeMSvyDCTkMg8kDsK/7YpQDUAH4RwLm+7TfCxR8kLFsysSJeM9nyIcU3P/Y0bFXHgdCyZS7Wyn9wJQAKMFB5PmnZmok3QroEYKy74e7Q4NDcBooDQL4GqODjVmiWKzYCMEJI5RugsI4H6LyKBYDRnuvrAXdXzi0tHhoicorI+wkAUwSiVQKogH/MZ4DxHQkxNdklAEJDxE4/VeVzgfVDDa9O/kWsTY1aAFBFG5dIa8IQGafv+YTtaj72a3YtRBcAHD8IQ7C13K+3QmSdn/BR9onm/qk1FwcA217bkpyJ0tvKAQQCxA7vN7899TsA3PnA/iYNoswWX3N+YGDAXY7QLQcOpBLJqD4LNzU08Nl0AWA6l7tKiM1eFxIQQM4pFBjMP3PUI0YT3ed1dnxvZ8dPSj1rlL945fdfnzw1lh/X/kh7VTRTfauh360euyFsBX0TVFIphnsB/AfgJao2iqC0uZCAU42s6ET+mVG+6b3rCsJgD4A9AOCi+Izz2gdgrHi+QPcp5ckgGVhVBUDEUe7FrwY+Olc8zoZkQkuO5HwoGHnD2fz9lydPjdx+6N59jKI+gBbA54KZE9+cGJwpnjf4zmAGwNNtBzuOR7noQYI7Vd235or0S6UaHO1rvAmxnhZBdXEdCAGvSAu1tfH1ifFygGsRAkEG1EUFpQBUNfSxbFovcQCQbOQuQZFddAwoEBixavyudQWoQe20kn+y5CRSzG9DKO5ZV4Br+4fmAJ0s12ByTiFk58jRneuWBSGgBM6UA3AKhIZXS+zeGO1qrFsPAALASM/2+xMiH0ZLtOLQEDmvP8PzFSPui5j2QhjlVu3W6k3dJQLA8OEttRIkfrDCOufLDw7+9QHZ2GcVvEhqrlLhgiklHi0kfrR7x1vJgIf/zxEJ5xcoLdoKAKDOdxRcsad/ORPLQ0Ikl3PghXdauR0oyoAWjuCm/snvFHqsyq7Sb11mLOgBqXTmmXTkP0kFGwexAGDru7/NViHxcDqnH6csYTaAY1EX3NY/fOEis51zsT4L1b+TlrBCrKLmlo1llx3ubWgJIY95oEMVjVZYRWLVdjS/C7z6/Sv6rrNHW6pTcbrVAzcI0OCBzVS1lXJw/qLi8No/YzuoX35Hj9UAAAAASUVORK5CYII=", color: "#f97316", key: "cnUsername", url: u => `https://www.codingninjas.com/students/profile/${u}` },
};

/* ─────────────────── Tiny reusable primitives ─────────────────────────── */
function GlassCard({ children, className = "", accent, glow = false, overflowVisible = false }) {
  return (
    <div className={`relative rounded-2xl ${className}`}
      style={{
        overflow: overflowVisible ? "visible" : "hidden",
        background: "rgba(9,9,20,0.82)",
        backdropFilter: "blur(20px)",
        border: `1px solid ${accent ? accent + "28" : "rgba(255,255,255,0.07)"}`,
        boxShadow: glow && accent ? `0 0 48px ${accent}1a, 0 8px 32px rgba(0,0,0,0.5)` : "0 8px 32px rgba(0,0,0,0.4)",
      }}>
      {/* shimmer top edge */}
      <div style={{
        position: "absolute", inset: "0 0 auto", height: 1,
        background: `linear-gradient(90deg,transparent,${accent || "#5eead4"}55,transparent)`
      }} />
      {children}
    </div>
  );
}

function Counter({ to = 0 }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    const end = Math.round(Number(to) || 0);
    if (!end) { setV(0); return; }
    let cur = 0;
    const step = Math.max(1, Math.ceil(end / 55));
    const t = setInterval(() => { cur = Math.min(cur + step, end); setV(cur); if (cur >= end) clearInterval(t); }, 16);
    return () => clearInterval(t);
  }, [to]);
  return <>{v.toLocaleString()}</>;
}

function Ring({ pct = 0, color = "#5eead4", size = 112, sw = 9 }) {
  const r = (size - sw * 2) / 2, circ = 2 * Math.PI * r, dash = Math.min(Math.max(pct, 0) / 100, 1) * circ;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#0f0f1e" strokeWidth={sw} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={sw}
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
        style={{ transition: "stroke-dasharray 1.4s cubic-bezier(.4,0,.2,1)" }} />
    </svg>
  );
}

function DiffBar({ label, count, total, color }) {
  const pct = total ? Math.round(count / total * 100) : 0;
  return (
    <div>
      <div className="flex justify-between mb-1.5 text-xs">
        <span style={{ color, fontWeight: 600 }}>{label}</span>
        <span style={{ color: "rgba(140,140,170,0.8)" }}>{count}<span style={{ color: "rgba(80,80,110,0.7)" }}> / {total}</span></span>
      </div>
      <div style={{ height: 6, borderRadius: 9999, background: "rgba(255,255,255,0.04)", overflow: "hidden" }}>
        <div style={{ height: "100%", borderRadius: 9999, background: color, width: `${pct}%`, transition: "width 1.4s cubic-bezier(.4,0,.2,1)" }} />
      </div>
    </div>
  );
}

function Chip({ label, value, color = "#5eead4" }) {
  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center", borderRadius: 12, padding: "10px 12px",
      background: `${color}0d`, border: `1px solid ${color}22`, minWidth: 76
    }}>
      <span style={{ fontSize: 13, fontWeight: 700, color }}>{value ?? ""}</span>
      <span style={{ fontSize: 10, marginTop: 2, textAlign: "center", lineHeight: 1.3, color: "rgba(130,130,165,0.75)" }}>{label}</span>
    </div>
  );
}

function Tag({ text, color }) {
  return (
    <span style={{
      fontSize: 10, padding: "3px 10px", borderRadius: 9999, fontFamily: "monospace", fontWeight: 600,
      background: `${color}16`, color, border: `1px solid ${color}28`
    }}>
      {text}
    </span>
  );
}

function StatBox({ icon, label, value, color }) {
  return (
    <div style={{
      position: "relative", display: "flex", flexDirection: "column", gap: 6, borderRadius: 14, padding: 16,
      overflow: "hidden", background: "rgba(0,0,0,0.22)", border: "1px solid rgba(255,255,255,0.06)",
      transition: "all .2s ease", cursor: "default"
    }}
      onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"}
      onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"}>
      <div style={{
        position: "absolute", top: -20, right: -20, width: 64, height: 64, borderRadius: "50%",
        background: color, opacity: .15, filter: "blur(18px)"
      }} />
      <span style={{ fontSize: 18, lineHeight: 1 }}>{icon}</span>
      <span style={{ fontSize: 22, fontWeight: 700, color }}><Counter to={value} /></span>
      <span style={{ fontSize: 10, color: "rgba(110,110,145,0.85)", lineHeight: 1.3 }}>{label}</span>
    </div>
  );
}

/* ─────────────────── Platform Badge + tooltip ──────────────────────────── */
function PlatformBadge({ name, cfg, stats, username }) {
  const [open, setOpen] = useState(false);
  const link = username ? cfg.url(username) : null;
  return (
    <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center" }}
      onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <a href={link || undefined} target="_blank" rel="noreferrer"
        onClick={!link ? e => e.preventDefault() : undefined}
        style={{
          display: "flex", flexDirection: "column", alignItems: "center", gap: 10,
          padding: "20px 12px",
          borderRadius: 18, width: "100%", transition: "all .25s ease",
          background: username
            ? open ? `${cfg.color}12` : "rgba(255,255,255,0.05)"
            : "rgba(255,255,255,0.015)",
          border: `1.5px solid ${username && open ? cfg.color + "60"
              : username ? "rgba(255,255,255,0.12)"
                : "rgba(255,255,255,0.05)"
            }`,
          opacity: username ? 1 : .3,
          filter: username ? "none" : "grayscale(1)",
          cursor: username ? "pointer" : "default",
          transform: username && open ? "translateY(-3px)" : "translateY(0)",
          boxShadow: username && open ? `0 8px 32px ${cfg.color}28, 0 0 0 1px ${cfg.color}22` : "none",
        }}>
        {/* Big logo circle */}
        <div style={{
          width: 52, height: 52, borderRadius: "50%",
          background: username && open ? `${cfg.color}22` : "rgba(255,255,255,0.07)",
          border: `1.5px solid ${username && open ? cfg.color + "40" : "rgba(255,255,255,0.08)"}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "all .25s ease", flexShrink: 0,
        }}>
          <img src={cfg.logo} alt={name}
            style={{ width: 28, height: 28, objectFit: "contain", borderRadius: 4 }} />
        </div>
        <span style={{
          fontSize: 12, fontWeight: 600,
          color: username && open ? cfg.color : username ? "rgba(200,200,225,0.9)" : "rgba(90,90,115,0.7)",
          textAlign: "center", transition: "color .2s ease", lineHeight: 1.2,
        }}>{name}</span>
        {/* Linked dot */}
        {username && (
          <span style={{
            width: 7, height: 7, borderRadius: "50%",
            background: open ? cfg.color : cfg.color + "aa",
            boxShadow: open ? `0 0 8px ${cfg.color}` : "none",
            transition: "all .2s ease",
          }} />
        )}
      </a>

      {/* Tooltip — rendered in a portal-like fixed div above everything */}
      {open && username && (
        <div style={{
          position: "absolute", bottom: "calc(100% + 12px)", left: "50%",
          transform: "translateX(-50%)", width: 230, zIndex: 9999,
          animation: "popUp .15s ease", pointerEvents: "none",
        }}>
          <div style={{
            borderRadius: 16, padding: 16,
            background: "rgba(4,4,16,0.97)",
            backdropFilter: "blur(20px)",
            border: `1px solid ${cfg.color}30`,
            boxShadow: `0 24px 64px rgba(0,0,0,0.8), 0 0 0 1px ${cfg.color}18`,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <img src={cfg.logo} alt={name} style={{ width: 18, height: 18, objectFit: "contain" }} />
              <p style={{ fontSize: 13, fontWeight: 700, margin: 0, color: cfg.color }}>{name}</p>
            </div>
            {stats && typeof stats === "object"
              ? Object.entries(stats).filter(([k]) => k !== "Profile Link").slice(0, 6).map(([k, v]) => (
                <div key={k} style={{
                  display: "flex", justifyContent: "space-between",
                  fontSize: 12, marginBottom: 6, gap: 8
                }}>
                  <span style={{ color: "rgba(120,120,160,0.9)" }}>{k}</span>
                  <span style={{ color: "rgba(230,230,250,0.95)", fontWeight: 600, textAlign: "right" }}>{v}</span>
                </div>
              ))
              : <p style={{ fontSize: 12, color: "rgba(100,100,140,0.8)", margin: 0 }}>No stats available</p>}
            <div style={{
              marginTop: 12, borderRadius: 10, padding: "8px 0", textAlign: "center",
              fontSize: 11, fontWeight: 700, color: cfg.color,
              background: `${cfg.color}14`, border: `1px solid ${cfg.color}22`,
            }}>
              View Profile →
            </div>
          </div>
          {/* Arrow */}
          <div style={{
            width: 10, height: 6, margin: "0 auto",
            borderLeft: "5px solid transparent", borderRight: "5px solid transparent",
            borderTop: `6px solid ${cfg.color}30`,
          }} />
        </div>
      )}
    </div>
  );
}

/* ─────────────────── Main Component ───────────────────────────────────── */
export default function UserProfile() {
  /* ── All state & refs (NO conditional hooks) ── */
  const [userData, setUserData] = useState({});
  const [portfolio, setPortfolio] = useState({});
  const [linked, setLinked] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [copied, setCopied] = useState(false);

  const { user_id } = useParams();
  const { user } = useContext(AuthContext);

  /* ── Parallax blobs ── */
  useEffect(() => {
    const h = e => setMouse({ x: (e.clientX / window.innerWidth - .5) * 30, y: (e.clientY / window.innerHeight - .5) * 30 });
    window.addEventListener("mousemove", h, { passive: true });
    return () => window.removeEventListener("mousemove", h);
  }, []);

  /* ── Data fetch ── */
  useEffect(() => {
    if (!user_id) return;
    (async () => {
      setLoading(true); setError(null);
      try {
        const [uRes, lRes] = await Promise.all([
          axios.get(`${API}/users/getUser`, { params: { user_id } }),
          axios.get(`${API}/portfolio/linkedaccounts`, { params: { _id: user_id } }),
        ]);
        setUserData(uRes.data);
        setLinked(lRes.data);
        try {
          const pRes = await axios.put(`${API}/portfolio/getupdateportfolio`, null, { params: { _id: user_id } });
          setPortfolio(pRes.data);
        } catch (_) { }
      } catch { setError("Failed to load profile"); }
      finally { setLoading(false); }
    })();
  }, [user_id]);

  /* ── View tracking ── */
  useEffect(() => {
    if (!user || String(user._id) === String(user_id)) return;
    axios.post(`${API}/users/updateViews`, { _id: user._id, userId: user_id }).catch(() => { });
  }, [user_id]);

  /* ── Derived values (safe, no hooks) ── */
  const lc = portfolio.lcStats;
  const cf = portfolio.cfStats;
  const gfg = portfolio.gfgStats;
  const cc = portfolio.ccStats;
  const gh = portfolio.githubStats;
  const lcTotal = lc?.solved?.totalsolved || 0;
  const lcEasy = lc?.solved?.easy || 0;
  const lcMedium = lc?.solved?.medium || 0;
  const lcHard = lc?.solved?.hard || 0;
  const cfTotal = cf?.solved?.totalSolved || 0;
  const gfgTotal = gfg?.solved?.totalSolved || 0;
  const totalSolv = lcTotal + cfTotal + gfgTotal;
  const totalCont = (lc?.contest?.totalattended || 0) + (cf?.contest?.contestsParticipated || 0) + (cc?.contests?.attended || 0);
  const lcRating = lc?.contest?.contestRating ? Math.round(lc.contest.contestRating) : 0;
  const cfRating = cf?.profile?.currentRating || 0;
  const isOwner = !!(user && String(user._id) === String(user_id));
  const views = isOwner && userData.views ? Object.keys(userData.views).length : null;
  const linkedCnt = Object.values(PLATFORMS).filter(({ key }) => !!linked[key]).length;
  const totalPlat = Object.keys(PLATFORMS).length;

  const firstName = (userData.firstname || "").trim();
  const lastName = (userData.lastname || "").trim();
  const fullName = [firstName, lastName].filter(Boolean).join(" ");
  const rawUsername = (userData.username || "").trim();
  const isHandle = rawUsername && rawUsername.toLowerCase() !== fullName.toLowerCase() && !rawUsername.includes(" ");
  const displayName = fullName || rawUsername || "Developer";
  const handle = isHandle ? rawUsername : null;

  const cfRankColor = (() => {
    const r = (cf?.profile?.rank || "").toLowerCase();
    if (r.includes("grandmaster") || r.includes("legendary")) return "#ff3333";
    if (r.includes("master")) return "#ff8c00";
    if (r.includes("candidate")) return "#ee00ee";
    if (r.includes("expert")) return "#a855f7";
    if (r.includes("specialist")) return "#03a89e";
    if (r.includes("pupil")) return "#77ff77";
    return "#808080";
  })();

  /* ── Dynamic page title (always called) ── */
  useEffect(() => {
    document.title = displayName ? `${displayName} | Digitomize` : "Profile | Digitomize";
    return () => { document.title = "Digitomize"; };
  }, [displayName]);

  /* ── Platform stats helper ── */
  const getStats = platform => {
    const u = linked[PLATFORMS[platform]?.key];
    if (!u) return null;
    const s = {};
    if (platform === "Leetcode" && lc) {
      s.Username = lc.profile?.username || u;
      s.Ranking = lc.profile?.ranking || "N/A";
      s.Solved = lc.solved?.totalsolved || "N/A";
      s.Easy = lc.solved?.easy || "N/A";
      s.Medium = lc.solved?.medium || "N/A";
      s.Hard = lc.solved?.hard || "N/A";
      s.Rating = lc.contest?.contestRating ? Math.round(lc.contest.contestRating) : "N/A";
      s["Profile Link"] = PLATFORMS.Leetcode.url(u);
    } else if (platform === "Codeforces" && cf) {
      s.Handle = cf.profile?.handle || u;
      s.Rank = cf.profile?.rank || "N/A";
      s.Rating = cf.profile?.currentRating || "N/A";
      s["Max Rating"] = cf.profile?.maxRating || "N/A";
      s.Solved = cf.solved?.totalSolved || "N/A";
      s.Contests = cf.contest?.contestsParticipated || "N/A";
      s["Profile Link"] = PLATFORMS.Codeforces.url(u);
    } else if (platform === "GfG" && gfg) {
      s.Username = gfg.profile?.username || u;
      s.Solved = gfg.solved?.totalSolved || "N/A";
      s.Easy = gfg.solved?.easy || "N/A";
      s.Medium = gfg.solved?.medium || "N/A";
      s.Hard = gfg.solved?.hard || "N/A";
      s["Score"] = gfg.profile?.codingScore || "N/A";
      s["Monthly"] = gfg.profile?.monthlyScore || "N/A";
      s["Global Rank"] = gfg.profile?.globalRank || "N/A";
      s["Profile Link"] = PLATFORMS.GfG.url(u);
    } else if (platform === "GitHub" && gh) {
      s.Repos = gh.stats?.publicRepos || "N/A";
      s.Stars = gh.stats?.totalStars || "N/A";
      s.Forks = gh.stats?.totalForks || "N/A";
      s.Followers = gh.stats?.followers || "N/A";
      s.Following = gh.stats?.following || "N/A";
      s["Profile Link"] = PLATFORMS.GitHub.url(u);
    } else if (platform === "CodeChef" && cc) {
      s.Username = cc.profile?.username || u;
      s.Rating = cc.profile?.currentRating || "N/A";
      s.Stars = cc.profile?.stars || "N/A";
      s["Global Rank"] = cc.profile?.globalRank || "N/A";
      s.Contests = cc.contests?.attended || "N/A";
      s["Profile Link"] = PLATFORMS.CodeChef.url(u);
    } else {
      s.Username = u;
      s["Profile Link"] = PLATFORMS[platform]?.url(u);
    }
    return s;
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true); setTimeout(() => setCopied(false), 2000);
    });
  };

  /* ── Guard renders (ALWAYS after all hooks) ── */
  if (!user_id) return <Status text="No user found." />;
  if (loading) return <Spinner />;
  if (error) return <Status text={error} red />;
  if (!Object.keys(userData).length) return <Status text="User not found." />;

  /* ════════════════════════════ RENDER ═══════════════════════════════ */
  return (
    <div style={{ minHeight: "100vh", fontFamily: "system-ui,sans-serif" }}>

      {/* ── Global Animations ── */}
      <style>{`
        @keyframes spin360    { to{transform:rotate(360deg);} }
        @keyframes scanMove   { 0%{top:0} 100%{top:100%} }
        @keyframes blobFloat  { 0%,100%{transform:translate(0,0)} 50%{transform:translate(10px,-12px)} }
        @keyframes popUp      { from{opacity:0;transform:translateX(-50%) translateY(8px)} to{opacity:1;transform:translateX(-50%) translateY(0)} }
        @keyframes pulseDot   { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(.9)} }
        @keyframes cursorBlink{ 0%,100%{opacity:1} 50%{opacity:0} }
        .no-sb::-webkit-scrollbar{display:none}.no-sb{-ms-overflow-style:none;scrollbar-width:none}
      `}</style>


      {/* ── Hero Banner ── */}
      <div style={{ position: "relative", zIndex: 1, marginTop: 64 }}>
        <div style={{ position: "relative", height: 210, overflow: "hidden" }}>
          {/* bg */}
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg,#071828 0%,#090b1e 45%,#120520 100%)" }} />
          {/* grid */}
          <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: .09 }}>
            <defs><pattern id="grid" width="36" height="36" patternUnits="userSpaceOnUse">
              <path d="M 36 0 L 0 0 0 36" fill="none" stroke="#5eead4" strokeWidth=".5" />
            </pattern></defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
          {/* scan line */}
          <div style={{
            position: "absolute", left: 0, right: 0, height: 1,
            background: "linear-gradient(90deg,transparent,#5eead4 40%,#6366f1 60%,transparent)",
            opacity: .75, animation: "scanMove 3.5s linear infinite"
          }} />
          {/* glows */}
          <div style={{
            position: "absolute", width: 420, height: 300, top: -90, right: "8%", borderRadius: "50%",
            background: "#5eead4", opacity: .14, filter: "blur(60px)"
          }} />
          <div style={{
            position: "absolute", width: 280, height: 200, top: -40, right: "30%", borderRadius: "50%",
            background: "#6366f1", opacity: .11, filter: "blur(48px)"
          }} />
          <div style={{
            position: "absolute", width: 200, height: 160, top: -50, left: "18%", borderRadius: "50%",
            background: "#f59e0b", opacity: .08, filter: "blur(40px)"
          }} />
          {/* name text in banner */}
          <div style={{
            position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "center",
            paddingLeft: "max(1.5rem,calc((100% - 1152px)/2 + 1.5rem))", paddingTop: 4
          }}>
            <span style={{
              fontFamily: "monospace", fontSize: 11, fontWeight: 700, letterSpacing: ".14em",
              color: "rgba(94,234,212,0.65)", marginBottom: 6
            }}>CodeDeck</span>
            <h2 style={{
              fontSize: "clamp(20px,3vw,30px)", fontWeight: 800, letterSpacing: "-.02em",
              color: "rgba(255,255,255,0.92)", margin: 0, textShadow: "0 0 50px rgba(94,234,212,0.35)"
            }}>
              {displayName}
            </h2>
            {handle && <p style={{ fontFamily: "monospace", fontSize: 13, color: "rgba(94,234,212,0.72)", margin: "4px 0 0" }}>@{handle}</p>}
            {userData.institute && (
              <p style={{ fontSize: 12, color: "rgba(140,140,180,0.7)", margin: "5px 0 0", display: "flex", alignItems: "center", gap: 6 }}>
                <span>🎓</span>{userData.institute}
              </p>
            )}
          </div>
          {/* bottom + side fades */}
          <div style={{ position: "absolute", inset: "auto 0 0", height: 80, background: "linear-gradient(to bottom,transparent,#070711)" }} />
          <div style={{ position: "absolute", top: 0, bottom: 0, left: 0, width: 48, background: "linear-gradient(to right,#070711,transparent)" }} />
          <div style={{ position: "absolute", top: 0, bottom: 0, right: 0, width: 48, background: "linear-gradient(to left,#070711,transparent)" }} />
        </div>
      </div>

      {/* ── Page body ── */}
      <div style={{ position: "relative", zIndex: 2, maxWidth: 1152, margin: "6px auto 0", padding: "0 1.5rem 5rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(12,1fr)", gap: 28 }}>

          {/* ╔══════════════ LEFT COLUMN (4 cols) ══════════════╗ */}
          <div style={{ gridColumn: "span 12" }} className="lg:col-span-4 lg:col lc">
            <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>

              {/* Identity Card */}
              <GlassCard className="p-6" style={{ padding: 24 }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 18, textAlign: "center" }}>

                  {/* Spinning avatar ring */}
                  <div style={{ position: "relative", width: 116, height: 116, flexShrink: 0 }}>
                    {/* rotating conic ring */}
                    <div style={{
                      position: "absolute", inset: -3, borderRadius: "50%",
                      background: "conic-gradient(from 0deg,#5eead4 0%,#6366f1 33%,#f59e0b 66%,#5eead4 100%)",
                      animation: "spin360 4s linear infinite"
                    }} />
                    {/* gap ring */}
                    <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "rgba(0,0,0,0.85)", margin: 3 }} />
                    {/* avatar image */}
                    <img
                      src={userData.profileUrl || `https://api.dicebear.com/8.x/bottts-neutral/svg?seed=${rawUsername || "dev"}`}
                      alt={displayName}
                      onError={e => { e.target.src = `https://api.dicebear.com/8.x/bottts-neutral/svg?seed=${rawUsername || "x"}`; }}
                      style={{
                        position: "absolute", inset: 0, margin: 3,
                        width: "calc(100% - 6px)", height: "calc(100% - 6px)",
                        borderRadius: "50%", objectFit: "cover"
                      }} />
                    {/* online dot */}
                    <span style={{
                      position: "absolute", bottom: 6, right: 6, width: 13, height: 13,
                      borderRadius: "50%", background: "#34d399", border: "2.5px solid #0d0d0d",
                      animation: "pulseDot 2s ease-in-out infinite"
                    }} />
                  </div>

                  {/* Name block */}
                  <div>
                    <h1 style={{ fontSize: 20, fontWeight: 700, color: "#fff", margin: "0 0 3px", letterSpacing: "-.02em", lineHeight: 1.2 }}>
                      {displayName}
                    </h1>
                    {handle && <p style={{ fontFamily: "monospace", fontSize: 13, color: "#5eead4", margin: "2px 0 0" }}>@{handle}</p>}
                    {userData.institute && (
                      <div style={{
                        display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
                        marginTop: 6, fontSize: 12, color: "rgba(120,120,160,0.8)"
                      }}>
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0112 20.055a11.952 11.952 0 01-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                        </svg>
                        <span style={{ maxWidth: 190, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {userData.institute}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Stat tags */}
                  <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 6 }}>
                    {linkedCnt > 0 && <Tag text={`${linkedCnt} platforms`} color="#5eead4" />}
                    {totalSolv > 0 && <Tag text={`${totalSolv} solved`} color="#f59e0b" />}
                    {totalCont > 0 && <Tag text={`${totalCont} contests`} color="#a78bfa" />}
                    {!linkedCnt && <Tag text="No accounts linked yet" color="#555" />}
                  </div>

                  {/* Divider */}
                  <div style={{ width: "100%", height: 1, background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.08),transparent)" }} />

                  {/* Terminal bio */}
                  <div style={{
                    width: "100%", textAlign: "left", borderRadius: 12, padding: 14,
                    fontFamily: "monospace", fontSize: 12, background: "rgba(0,0,0,0.45)",
                    border: "1px solid rgba(255,255,255,0.06)"
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
                      <span style={{ width: 9, height: 9, borderRadius: "50%", background: "#ff5f57", display: "inline-block" }} />
                      <span style={{ width: 9, height: 9, borderRadius: "50%", background: "#ffbc2e", display: "inline-block" }} />
                      <span style={{ width: 9, height: 9, borderRadius: "50%", background: "#28c840", display: "inline-block" }} />
                      <span style={{ fontSize: 10, color: "rgba(100,100,130,0.7)", marginLeft: 8 }}>bio.sh</span>
                    </div>
                    {userData.bio ? (
                      <>
                        <div style={{ display: "flex", gap: 8, color: "rgba(210,210,230,0.85)", lineHeight: 1.6 }}>
                          <span style={{ color: "#5eead4", flexShrink: 0 }}>$</span>
                          <span>{userData.bio}</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 6 }}>
                          <span style={{ color: "#5eead4" }}>$</span>
                          <span style={{
                            display: "inline-block", width: 6, height: 12, background: "#5eead4",
                            animation: "cursorBlink 1s step-end infinite"
                          }} />
                        </div>
                      </>
                    ) : (
                      <span style={{ color: "rgba(80,80,110,0.8)", fontStyle: "italic" }}>
                        # {isOwner ? "No bio yet — add one from Settings" : "No bio provided"}
                      </span>
                    )}
                  </div>

                  {/* Action buttons */}
                  <div style={{ display: "flex", gap: 8, width: "100%" }}>
                    {isOwner && (
                      <a href="/profile" style={{
                        flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
                        padding: "10px 0", borderRadius: 12, fontSize: 12, fontWeight: 600, textDecoration: "none",
                        color: "#5eead4", background: "linear-gradient(135deg,rgba(94,234,212,0.1),rgba(99,102,241,0.1))",
                        border: "1px solid rgba(94,234,212,0.25)", transition: "opacity .2s"
                      }}
                        onMouseEnter={e => e.currentTarget.style.opacity = ".75"}
                        onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
                        ✏️ Edit Profile
                      </a>
                    )}
                    <button onClick={copyLink} title="Copy link"
                      style={{
                        flex: isOwner ? "0 0 auto" : "1",
                        padding: "10px 16px", borderRadius: 12, fontSize: 12, fontWeight: 600,
                        cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                        border: `1px solid ${copied ? "rgba(34,197,94,0.3)" : "rgba(255,255,255,0.1)"}`,
                        background: copied ? "rgba(34,197,94,0.12)" : "rgba(255,255,255,0.05)",
                        color: copied ? "#22c55e" : "rgba(150,150,190,0.9)",
                        transition: "all .2s ease",
                      }}>
                      {copied ? (
                        <><span>✓</span><span>Copied!</span></>
                      ) : (
                        <>
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                          </svg>
                          <span>{isOwner ? "Share" : "Share Profile"}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </GlassCard>

              {/* Coding Arsenal */}
              <GlassCard className="p-5" accent="#5eead4" style={{ padding: 20 }}>
                <p style={{
                  fontSize: 10, textTransform: "uppercase", letterSpacing: ".12em", fontWeight: 700,
                  color: "rgba(100,100,145,0.9)", marginBottom: 16
                }}>Coding Arsenal</p>
                <div style={{ display: "flex", alignItems: "flex-end", gap: 8, marginBottom: 8 }}>
                  <span style={{ fontSize: 40, fontWeight: 700, color: "#fff", lineHeight: 1 }}>{linkedCnt}</span>
                  <span style={{ fontSize: 13, marginBottom: 4, color: "rgba(120,120,165,0.8)" }}>/ {totalPlat} platforms</span>
                </div>
                {/* progress bar */}
                <div style={{ height: 5, borderRadius: 9999, background: "rgba(255,255,255,0.05)", overflow: "hidden", marginBottom: 18 }}>
                  <div style={{
                    height: "100%", borderRadius: 9999,
                    background: "linear-gradient(90deg,#5eead4,#6366f1)",
                    width: `${(linkedCnt / totalPlat) * 100}%`, transition: "width 1.4s ease"
                  }} />
                </div>
                {/* platform list */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                  {Object.entries(PLATFORMS).map(([name, cfg]) => {
                    const u = linked[cfg.key];
                    return (
                      <div key={name} style={{
                        display: "flex", alignItems: "center", gap: 8, padding: "7px 10px",
                        borderRadius: 10,
                        background: u ? `${cfg.color}0d` : "rgba(255,255,255,0.02)",
                        border: `1px solid ${u ? cfg.color + "28" : "rgba(255,255,255,0.04)"}`,
                        opacity: u ? 1 : .45
                      }}>
                        <img src={cfg.logo} alt={name} style={{ width: 13, height: 13, objectFit: "contain" }} />
                        <span style={{
                          fontSize: 12, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                          color: u ? "rgba(210,210,235,0.9)" : "rgba(90,90,115,0.8)"
                        }}>{name}</span>
                        {u && <span style={{ width: 5, height: 5, borderRadius: "50%", background: cfg.color, flexShrink: 0 }} />}
                      </div>
                    );
                  })}
                </div>
              </GlassCard>

            </div>
          </div>

          {/* ╔══════════════ RIGHT COLUMN (8 cols) ══════════════╗ */}
          <div style={{ gridColumn: "span 12" }} className="lg:col-span-8 rca">
            <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>

              {/* Developer Overview */}
              <GlassCard style={{ padding: 24 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                  <h2 style={{ fontSize: 12, fontWeight: 700, color: "#fff", textTransform: "uppercase", letterSpacing: ".1em", margin: 0 }}>
                    Developer Overview
                  </h2>
                  <span style={{
                    fontFamily: "monospace", fontSize: 10, padding: "4px 10px", borderRadius: 8,
                    color: "rgba(100,100,145,0.8)", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)"
                  }}>
                    {linkedCnt} account{linkedCnt !== 1 ? "s" : ""} linked
                  </span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(120px,1fr))", gap: 12 }}>
                  <StatBox icon="⚡" label="Total Solved" value={totalSolv} color="#5eead4" />
                  <StatBox icon="🏆" label="Contests" value={totalCont} color="#f59e0b" />
                  {lcRating > 0 && <StatBox icon="🧩" label="LC Rating" value={lcRating} color="#facc15" />}
                  {cfRating > 0 && <StatBox icon="🔵" label="CF Rating" value={cfRating} color="#60a5fa" />}
                  {views !== null && <StatBox icon="👁" label="Profile Views" value={views} color="#a78bfa" />}
                  {lcTotal > 0 && <StatBox icon="🟢" label="Easy" value={lcEasy} color="#22c55e" />}
                  {lcMedium > 0 && <StatBox icon="🟡" label="Medium" value={lcMedium} color="#f59e0b" />}
                  {lcHard > 0 && <StatBox icon="🔴" label="Hard" value={lcHard} color="#ef4444" />}
                </div>
              </GlassCard>

              {/* Coding Profiles */}
              <GlassCard overflowVisible style={{ padding: "28px 32px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                  <h2 style={{ fontSize: 13, fontWeight: 700, color: "#fff", textTransform: "uppercase", letterSpacing: ".1em", margin: 0 }}>
                    Coding Profiles
                  </h2>
                  <span style={{ fontSize: 10, color: "rgba(90,90,125,0.8)" }}>Hover to peek at stats</span>
                </div>
                <p style={{ fontSize: 12, color: "rgba(80,80,115,0.85)", marginBottom: 28 }}>
                  {linkedCnt}/{totalPlat} platforms linked
                  {linkedCnt === 0 ? " · Link accounts from your dashboard" : " · Active platforms highlighted"}
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 16 }}>
                  {Object.entries(PLATFORMS).map(([name, cfg]) => (
                    <PlatformBadge key={name} name={name} cfg={cfg}
                      stats={getStats(name)} username={linked[cfg.key]} />
                  ))}
                </div>
              </GlassCard>

              {/* LeetCode card */}
              {lc && lcTotal > 0 && (
                <GlassCard accent={PLATFORMS.Leetcode.color} glow style={{ padding: 24 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 22 }}>
                    <img src={PLATFORMS.Leetcode.logo} alt="lc"
                      style={{
                        width: 28, height: 28, borderRadius: "50%", objectFit: "contain",
                        padding: 4, background: "rgba(255,255,255,0.08)"
                      }} />
                    <div style={{ flex: 1 }}>
                      <h2 style={{ fontSize: 15, fontWeight: 700, color: PLATFORMS.Leetcode.color, margin: "0 0 2px" }}>LeetCode</h2>
                      {linked.lcUsername && <p style={{ fontFamily: "monospace", fontSize: 11, color: "rgba(100,100,145,0.9)", margin: 0 }}>@{linked.lcUsername}</p>}
                    </div>
                    {linked.lcUsername && (
                      <a href={PLATFORMS.Leetcode.url(linked.lcUsername)} target="_blank" rel="noreferrer"
                        style={{
                          fontSize: 11, fontWeight: 600, padding: "6px 12px", borderRadius: 10, textDecoration: "none",
                          color: PLATFORMS.Leetcode.color, background: `${PLATFORMS.Leetcode.color}14`,
                          border: `1px solid ${PLATFORMS.Leetcode.color}2e`
                        }}>
                        View ↗
                      </a>
                    )}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 32, flexWrap: "wrap" }}>
                    {/* ring */}
                    <div style={{ position: "relative", flexShrink: 0 }}>
                      <Ring pct={lcTotal ? (lcTotal / 3500) * 100 : 0} color="#f59e0b" size={112} sw={9} />
                      <div style={{
                        position: "absolute", inset: 0, display: "flex", flexDirection: "column",
                        alignItems: "center", justifyContent: "center"
                      }}>
                        <span style={{ fontSize: 22, fontWeight: 700, color: "#fff" }}><Counter to={lcTotal} /></span>
                        <span style={{ fontSize: 10, color: "rgba(120,120,160,0.8)" }}>solved</span>
                      </div>
                    </div>
                    {/* bars + chips */}
                    <div style={{ flex: 1, minWidth: 200 }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 14 }}>
                        <DiffBar label="Easy" count={lcEasy} total={lcTotal} color="#22c55e" />
                        <DiffBar label="Medium" count={lcMedium} total={lcTotal} color="#f59e0b" />
                        <DiffBar label="Hard" count={lcHard} total={lcTotal} color="#ef4444" />
                      </div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                        {[{ l: "Contests", v: lc.contest?.totalattended }, { l: "Rating", v: lcRating || null },
                        { l: "Global Rank", v: lc.contest?.contestGlobalRanking }, { l: "LC Rank", v: lc.profile?.ranking }]
                          .filter(x => x.v).map(x => <Chip key={x.l} label={x.l} value={x.v} color={PLATFORMS.Leetcode.color} />)}
                      </div>
                    </div>
                  </div>
                </GlassCard>
              )}

              {/* Codeforces card */}
              {cf && (
                <GlassCard accent={PLATFORMS.Codeforces.color} glow style={{ padding: 24 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
                    <img src={PLATFORMS.Codeforces.logo} alt="cf"
                      style={{
                        width: 28, height: 28, borderRadius: "50%", objectFit: "contain",
                        padding: 4, background: "rgba(255,255,255,0.08)"
                      }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <h2 style={{ fontSize: 15, fontWeight: 700, color: PLATFORMS.Codeforces.color, margin: "0 0 2px" }}>Codeforces</h2>
                        {cf.profile?.rank && (
                          <span style={{
                            fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 9999,
                            color: cfRankColor, background: `${cfRankColor}18`, border: `1px solid ${cfRankColor}28`
                          }}>
                            {cf.profile.rank}
                          </span>
                        )}
                      </div>
                      {linked.cfUsername && <p style={{ fontFamily: "monospace", fontSize: 11, color: "rgba(100,100,145,0.9)", margin: 0 }}>@{linked.cfUsername}</p>}
                    </div>
                    {linked.cfUsername && (
                      <a href={PLATFORMS.Codeforces.url(linked.cfUsername)} target="_blank" rel="noreferrer"
                        style={{
                          fontSize: 11, fontWeight: 600, padding: "6px 12px", borderRadius: 10, textDecoration: "none",
                          color: PLATFORMS.Codeforces.color, background: `${PLATFORMS.Codeforces.color}14`,
                          border: `1px solid ${PLATFORMS.Codeforces.color}2e`
                        }}>
                        View ↗
                      </a>
                    )}
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 18 }}>
                    {[{ l: "Rank", v: cf.profile?.rank }, { l: "Rating", v: cf.profile?.currentRating },
                    { l: "Max Rating", v: cf.profile?.maxRating }, { l: "Max Rank", v: cf.profile?.maxRank },
                    { l: "Solved", v: cfTotal || null }, { l: "Contests", v: cf.contest?.contestsParticipated }]
                      .filter(x => x.v).map(x => <Chip key={x.l} label={x.l} value={x.v} color={PLATFORMS.Codeforces.color} />)}
                  </div>
                  {cf.contest?.recentContests?.length > 0 && (
                    <>
                      <p style={{
                        fontSize: 10, textTransform: "uppercase", letterSpacing: ".1em", fontWeight: 700,
                        color: "rgba(80,80,120,0.9)", marginBottom: 8
                      }}>Recent Contests</p>
                      <div className="no-sb" style={{ maxHeight: 180, overflowY: "auto", display: "flex", flexDirection: "column", gap: 5 }}>
                        {cf.contest.recentContests.map((c, i) => (
                          <div key={i} style={{
                            display: "flex", alignItems: "center", justifyContent: "space-between",
                            padding: "8px 12px", borderRadius: 10, fontSize: 12,
                            background: "rgba(0,0,0,0.28)", border: "1px solid rgba(255,255,255,0.05)"
                          }}>
                            <span style={{
                              color: "rgba(150,150,190,0.9)", flex: 1, overflow: "hidden", textOverflow: "ellipsis",
                              whiteSpace: "nowrap", marginRight: 12
                            }}>{c.contestName}</span>
                            <div style={{ display: "flex", alignItems: "center", gap: 14, flexShrink: 0 }}>
                              <span style={{ color: "rgba(90,90,125,0.9)" }}>#{c.rank}</span>
                              <span style={{
                                fontWeight: 700, width: 36, textAlign: "right",
                                color: Number(c.change) >= 0 ? "#22c55e" : "#ef4444"
                              }}>
                                {Number(c.change) >= 0 ? "+" : ""}{c.change}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </GlassCard>
              )}

              {/* ── GeeksForGeeks Card ── */}
              {gfg && gfgTotal > 0 && (
                <GlassCard accent={PLATFORMS.GfG.color} glow style={{ padding: 24 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 22 }}>
                    <img src={PLATFORMS.GfG.logo} alt="gfg"
                      style={{
                        width: 28, height: 28, borderRadius: "50%", objectFit: "contain",
                        padding: 4, background: "rgba(255,255,255,0.08)"
                      }} />
                    <div style={{ flex: 1 }}>
                      <h2 style={{ fontSize: 15, fontWeight: 700, color: PLATFORMS.GfG.color, margin: "0 0 2px" }}>GeeksForGeeks</h2>
                      {linked.gfgUsername && <p style={{ fontFamily: "monospace", fontSize: 11, color: "rgba(100,100,145,0.9)", margin: 0 }}>@{linked.gfgUsername}</p>}
                    </div>
                    {linked.gfgUsername && (
                      <a href={PLATFORMS.GfG.url(linked.gfgUsername)} target="_blank" rel="noreferrer"
                        style={{
                          fontSize: 11, fontWeight: 600, padding: "6px 12px", borderRadius: 10, textDecoration: "none",
                          color: PLATFORMS.GfG.color, background: `${PLATFORMS.GfG.color}14`,
                          border: `1px solid ${PLATFORMS.GfG.color}2e`
                        }}>
                        View ↗
                      </a>
                    )}
                  </div>
                  {/* Stats row */}
                  <div style={{ display: "flex", alignItems: "center", gap: 32, flexWrap: "wrap", marginBottom: 20 }}>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: 36, fontWeight: 800, color: PLATFORMS.GfG.color, lineHeight: 1 }}>
                        <Counter to={gfgTotal} />
                      </div>
                      <div style={{ fontSize: 11, color: "rgba(110,110,155,0.8)", marginTop: 4 }}>Total Solved</div>
                    </div>
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
                      <DiffBar label="Easy" count={gfg.solved?.easy || 0} total={gfgTotal} color="#22c55e" />
                      <DiffBar label="Medium" count={gfg.solved?.medium || 0} total={gfgTotal} color="#f59e0b" />
                      <DiffBar label="Hard" count={gfg.solved?.hard || 0} total={gfgTotal} color="#ef4444" />
                      {(gfg.solved?.school || 0) > 0 && <DiffBar label="School" count={gfg.solved?.school || 0} total={gfgTotal} color="#a78bfa" />}
                    </div>
                  </div>
                  {/* Score chips */}
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    {[
                      { l: "Coding Score", v: gfg.profile?.codingScore },
                      { l: "Monthly Score", v: gfg.profile?.monthlyScore },
                      { l: "Global Rank", v: gfg.profile?.globalRank },
                      { l: "Institute Rank", v: gfg.profile?.instituteRank },
                    ].filter(x => x.v && x.v !== "N/A").map(x => (
                      <Chip key={x.l} label={x.l} value={x.v} color={PLATFORMS.GfG.color} />
                    ))}
                  </div>
                </GlassCard>
              )}

              {/* ── GitHub Card ── */}
              {gh && gh.stats && (
                <GlassCard accent={PLATFORMS.GitHub.color} glow style={{ padding: 24 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 22 }}>
                    <img src={PLATFORMS.GitHub.logo} alt="github"
                      style={{
                        width: 28, height: 28, borderRadius: "50%", objectFit: "contain",
                        padding: 4, background: "rgba(255,255,255,0.08)"
                      }} />
                    <div style={{ flex: 1 }}>
                      <h2 style={{ fontSize: 15, fontWeight: 700, color: PLATFORMS.GitHub.color, margin: "0 0 2px" }}>GitHub</h2>
                      {linked.githubUsername && <p style={{ fontFamily: "monospace", fontSize: 11, color: "rgba(100,100,145,0.9)", margin: 0 }}>@{linked.githubUsername}</p>}
                    </div>
                    {linked.githubUsername && (
                      <a href={PLATFORMS.GitHub.url(linked.githubUsername)} target="_blank" rel="noreferrer"
                        style={{
                          fontSize: 11, fontWeight: 600, padding: "6px 12px", borderRadius: 10, textDecoration: "none",
                          color: PLATFORMS.GitHub.color, background: `${PLATFORMS.GitHub.color}14`,
                          border: `1px solid ${PLATFORMS.GitHub.color}2e`
                        }}>
                        View ↗
                      </a>
                    )}
                  </div>
                  {/* Stat grid */}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(110px,1fr))", gap: 12, marginBottom: 20 }}>
                    {[
                      { icon: "📦", label: "Repos", value: gh.stats.publicRepos, color: "#e2e8f0" },
                      { icon: "⭐", label: "Stars", value: gh.stats.totalStars, color: "#f59e0b" },
                      { icon: "🍴", label: "Forks", value: gh.stats.totalForks, color: "#60a5fa" },
                      { icon: "👥", label: "Followers", value: gh.stats.followers, color: "#a78bfa" },
                      { icon: "➡️", label: "Following", value: gh.stats.following, color: "#5eead4" },
                    ].map(({ icon, label, value, color }) => (
                      <StatBox key={label} icon={icon} label={label} value={value || 0} color={color} />
                    ))}
                  </div>
                  {/* Top languages */}
                  {gh.stats.topLanguages?.length > 0 && (
                    <>
                      <p style={{
                        fontSize: 10, textTransform: "uppercase", letterSpacing: ".1em", fontWeight: 700,
                        color: "rgba(80,80,120,0.9)", marginBottom: 10
                      }}>Top Languages</p>
                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        {gh.stats.topLanguages.map((lang, i) => {
                          const langColors = {
                            "JavaScript": "#f7df1e", "TypeScript": "#3178c6", "Python": "#3776ab",
                            "Java": "#ed8b00", "C++": "#00599c", "C": "#555555", "Go": "#00add8",
                            "Rust": "#dea584", "Ruby": "#cc342d", "PHP": "#777bb4", "Swift": "#fa7343",
                            "Kotlin": "#7f52ff", "Dart": "#0175c2", "CSS": "#264de4", "HTML": "#e34f26"
                          };
                          const c = langColors[lang] || PLATFORMS.GitHub.color;
                          return (
                            <span key={lang} style={{
                              fontSize: 12, padding: "5px 14px", borderRadius: 9999, fontWeight: 600,
                              background: `${c}18`, color: c, border: `1px solid ${c}30`
                            }}>
                              {lang}
                            </span>
                          );
                        })}
                      </div>
                    </>
                  )}
                </GlassCard>
              )}

              {/* ── CodeChef Card ── */}
              {cc && cc.profile?.currentRating > 0 && (
                <GlassCard accent={PLATFORMS.CodeChef.color} glow style={{ padding: 24 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 22 }}>
                    <img src={PLATFORMS.CodeChef.logo} alt="codechef"
                      style={{
                        width: 28, height: 28, borderRadius: "50%", objectFit: "contain",
                        padding: 4, background: "rgba(255,255,255,0.08)"
                      }} />
                    <div style={{ flex: 1 }}>
                      <h2 style={{ fontSize: 15, fontWeight: 700, color: PLATFORMS.CodeChef.color, margin: "0 0 2px" }}>CodeChef</h2>
                      {linked.ccUsername && <p style={{ fontFamily: "monospace", fontSize: 11, color: "rgba(100,100,145,0.9)", margin: 0 }}>@{linked.ccUsername}</p>}
                    </div>
                    {linked.ccUsername && (
                      <a href={PLATFORMS.CodeChef.url(linked.ccUsername)} target="_blank" rel="noreferrer"
                        style={{
                          fontSize: 11, fontWeight: 600, padding: "6px 12px", borderRadius: 10, textDecoration: "none",
                          color: PLATFORMS.CodeChef.color, background: `${PLATFORMS.CodeChef.color}14`,
                          border: `1px solid ${PLATFORMS.CodeChef.color}2e`
                        }}>
                        View ↗
                      </a>
                    )}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 32, flexWrap: "wrap", marginBottom: 20 }}>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: 36, fontWeight: 800, color: PLATFORMS.CodeChef.color, lineHeight: 1 }}>
                        <Counter to={cc.profile.currentRating} />
                      </div>
                      <div style={{ fontSize: 11, color: "rgba(110,110,155,0.8)", marginTop: 4 }}>Current Rating</div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      <span style={{ fontSize: 28, lineHeight: 1 }}>{cc.profile.stars}</span>
                      <span style={{ fontSize: 10, color: "rgba(110,110,155,0.8)" }}>Stars</span>
                    </div>
                    <div style={{ flex: 1, display: "flex", gap: 10, flexWrap: "wrap" }}>
                      {[
                        { l: "Peak Rating", v: cc.profile?.highestRating },
                        { l: "Global Rank", v: cc.profile?.globalRank },
                        { l: "Country Rank", v: cc.profile?.countryRank },
                        { l: "Contests", v: cc.contests?.attended },
                      ].filter(x => x.v && x.v !== "N/A").map(x => (
                        <Chip key={x.l} label={x.l} value={x.v} color={PLATFORMS.CodeChef.color} />
                      ))}
                    </div>
                  </div>
                  {cc.contests?.recentContests?.length > 0 && (
                    <>
                      <p style={{
                        fontSize: 10, textTransform: "uppercase", letterSpacing: ".1em", fontWeight: 700,
                        color: "rgba(80,80,120,0.9)", marginBottom: 8
                      }}>Recent Contests</p>
                      <div className="no-sb" style={{ maxHeight: 180, overflowY: "auto", display: "flex", flexDirection: "column", gap: 5 }}>
                        {cc.contests.recentContests.map((c, i) => (
                          <div key={i} style={{
                            display: "flex", alignItems: "center", justifyContent: "space-between",
                            padding: "8px 12px", borderRadius: 10, fontSize: 12,
                            background: "rgba(0,0,0,0.28)", border: "1px solid rgba(255,255,255,0.05)"
                          }}>
                            <span style={{
                              color: "rgba(150,150,190,0.9)", flex: 1, overflow: "hidden",
                              textOverflow: "ellipsis", whiteSpace: "nowrap", marginRight: 12
                            }}>{c.name}</span>
                            <div style={{ display: "flex", alignItems: "center", gap: 14, flexShrink: 0 }}>
                              <span style={{ color: "rgba(90,90,125,0.9)" }}>{c.rating}</span>
                              <span style={{ fontWeight: 700, color: "rgba(90,90,125,0.7)" }}>#{c.rank}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </GlassCard>
              )}

              {/* Empty state */}
              {!lc && !cf && !gfg && !gh && !cc && linkedCnt === 0 && (
                <GlassCard style={{ padding: 56, textAlign: "center" }}>
                  <div style={{ fontSize: 52, marginBottom: 16 }}>🚀</div>
                  <h3 style={{ fontSize: 20, fontWeight: 700, color: "#fff", margin: "0 0 8px" }}>
                    {isOwner ? "Your coding journey starts here" : "No platforms linked yet"}
                  </h3>
                  <p style={{ fontSize: 14, color: "rgba(110,110,155,0.9)", margin: "0 0 24px", lineHeight: 1.6 }}>
                    {isOwner
                      ? "Link LeetCode, Codeforces, GitHub and more to showcase your stats."
                      : "This developer hasn't linked any coding platforms yet."}
                  </p>
                  {isOwner && (
                    <a href="/profile"
                      style={{
                        display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 22px",
                        borderRadius: 12, fontSize: 13, fontWeight: 600, textDecoration: "none",
                        color: "#5eead4", background: "rgba(94,234,212,0.1)",
                        border: "1px solid rgba(94,234,212,0.25)"
                      }}>
                      🔗 Link Accounts
                    </a>
                  )}
                </GlassCard>
              )}

            </div>
          </div>
        </div>
      </div>

      {/* Responsive grid via Tailwind columns */}
      <style>{`
        @media(min-width:1024px){
          .lc{grid-column:span 4!important}
          .rca{grid-column:span 8!important}
        }
      `}</style>
    </div>
  );
}

/* ─────────────────── Utility screens ─────────────────────────────────── */
function Spinner() {
  return (
    <div style={{
      minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", gap: 16, background: "#070711"
    }}>
      <div style={{ position: "relative", width: 52, height: 52 }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "2px solid rgba(94,234,212,0.12)" }}
          className="animate-ping" />
        <div style={{
          position: "absolute", inset: 6, borderRadius: "50%",
          border: "2px solid #5eead4", borderTopColor: "transparent"
        }}
          className="animate-spin" />
      </div>
      <p style={{ fontFamily: "monospace", fontSize: 13, color: "rgba(94,234,212,0.5)" }}>
        Loading profile…
      </p>
    </div>
  );
}

function Status({ text, red = false }) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#070711" }}>
      <p style={{ fontFamily: "monospace", fontSize: 15, color: red ? "#f87171" : "rgba(90,90,140,0.8)" }}>{text}</p>
    </div>
  );
}
