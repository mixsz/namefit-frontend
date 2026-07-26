import { useState, useRef, useEffect } from "react";
import { Dumbbell, User, Pencil, LogOut, ChevronDown } from "lucide-react";
import { Link, NavLink } from "react-router-dom";

const ORANGE = "#FF4D1C";
const HOVER_ACCENT = "#FFB020";
const BG = "#0f0c0a";
const HEADER_BG = "#1c1815";
const PANEL = "#141210";
const FIELD = "#1e1a17";
const BORDER = "rgba(255,255,255,0.06)";
const TEXT = "#f2ede8";
const MUTED = "#6b6460";

const NAV_ITEMS = [
  { label: "Home", to: "/home" },
  { label: "Treinos", to: "/treinos" },
  { label: "Exercícios", to: "/exercicios" },
  { label: "Histórico", to: "/historico" },
];

function Header({ onLogout, userName = "Atleta" }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    function handleEsc(e) {
      if (e.key === "Escape") setMenuOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);

  return (
    <header
      className="fixed top-0 left-12 right-12 z-50 rounded-b-xl"
      style={{
        height: "66px",
        background:
          "linear-gradient(to bottom, rgba(255,77,28,0.05) 0%, rgba(12,10,8,0.6) 90%, rgba(12,10,8,0.97) 100%)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        boxShadow: "0 1px 12px rgba(0,0,0,0.25)",
        fontFamily: "'Barlow', sans-serif",
      }}
    >
      <div className="px-8 h-16 grid grid-cols-3 items-center">
        <nav className="hidden md:flex items-center gap-1 justify-self-start">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className="relative px-4 py-2 rounded-lg text-lg transition-all"
              style={({ isActive }) => ({
                color: isActive ? BG : "#c9c4bf",
                fontWeight: isActive ? 550 : 500,
                background: isActive
                  ? "linear-gradient(180deg, #FF7A45 0%, " + ORANGE + " 45%, #D93E12 100%)"
                  : "transparent",
                boxShadow: isActive
                  ? "0 2px 6px rgba(255,77,28,0.1), inset 0 1px 0 rgba(255,255,255,0.35), inset 0 -1px 0 rgba(0,0,0,0.15)"
                  : "none",
                letterSpacing: "0.01em",
              })}
              onMouseOver={(e) => {
                if (e.currentTarget.getAttribute("aria-current") !== "page") {
                  e.currentTarget.style.color = TEXT;
                  e.currentTarget.style.background = FIELD;
                }
              }}
              onMouseOut={(e) => {
                if (e.currentTarget.getAttribute("aria-current") !== "page") {
                  e.currentTarget.style.color = "#c9c4bf";
                  e.currentTarget.style.background = "transparent";
                }
              }}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <Link
          to="/home"
          className="flex items-center gap-3 shrink-0 justify-self-center"
          aria-label="NameFit - ir para Home"
        >
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: ORANGE }}
          >
            <Dumbbell size={18} color={BG} strokeWidth={2.5} />
          </div>
          <span
            className="text-2xl font-extrabold tracking-widest"
            style={{
              color: TEXT,
              fontFamily: "'Barlow Condensed', sans-serif",
            }}
          >
            NAME<span style={{ color: ORANGE }}>FIT</span>
          </span>
        </Link>

        <div className="relative shrink-0 justify-self-end" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            aria-label="Abrir menu de perfil"
            className="flex items-center gap-2 p-1 pr-2 rounded-full transition-all"
            style={{
              background: menuOpen ? FIELD : "transparent",
              border: "1.5px solid " + (menuOpen ? ORANGE : BORDER),
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.borderColor = ORANGE;
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.borderColor = menuOpen ? ORANGE : BORDER;
            }}
          >
            <span
              className="w-9 h-9 rounded-full flex items-center justify-center"
              style={{ background: ORANGE }}
            >
              <User size={18} color={BG} strokeWidth={2.5} />
            </span>
            <ChevronDown
              size={16}
              color={MUTED}
              style={{
                transition: "transform 0.2s ease",
                transform: menuOpen ? "rotate(180deg)" : "rotate(0deg)",
              }}
            />
          </button>

          {menuOpen && (
            <div
              role="menu"
              className="absolute right-0 mt-2 w-64 rounded-xl overflow-hidden py-2"
              style={{
                background:
                  "linear-gradient(to bottom, rgba(255,77,28,0.02) 0%, rgba(12,10,8,0.85) 15%, rgba(12,10,8,0.97) 100%)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                border: "1px solid " + BORDER,
                boxShadow: "0 12px 32px rgba(0,0,0,0.5)",
              }}
            >
              <div
                className="px-4 py-3 mb-1"
                style={{ borderBottom: "1px solid " + BORDER }}
              >
                <p className="text-sm font-medium truncate text-white">
                  Olá, {userName}!
                </p>
              </div>

              <DropdownItem
                icon={<Pencil size={16} />}
                label="Editar perfil"
                as={Link}
                to="/perfil"
                onClick={() => setMenuOpen(false)}
              />
              <DropdownItem
                icon={<LogOut size={16} />}
                label="Sair"
                danger
                onClick={() => {
                  setMenuOpen(false);
                  if (onLogout) onLogout();
                }}
              />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

function DropdownItem({
  icon,
  label,
  danger,
  as: Component = "button",
  ...props
}) {
  const baseColor = danger ? "#ef4444" : TEXT;
  const hoverBg = danger ? "rgba(239,68,68,0.1)" : FIELD;
  const hoverColor = danger ? "#ef4444" : ORANGE;

  return (
    <Component
      role="menuitem"
      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-normal transition-colors text-left"
      style={{ color: baseColor, background: "transparent" }}
      onMouseOver={(e) => {
        e.currentTarget.style.background = hoverBg;
        e.currentTarget.style.color = hoverColor;
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.background = "transparent";
        e.currentTarget.style.color = baseColor;
      }}
      {...props}
    >
      {icon}
      {label}
    </Component>
  );
}

export default Header;