import { useState, useRef, useEffect } from "react";
import { ORANGE, BG, PANEL, FIELD, BORDER, TEXT, MUTED } from "../theme.js";
import {
  Dumbbell,
  User,
  Pencil,
  LogOut,
  ChevronDown,
  Menu,
  X,
} from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import api from "../services/api.js";

const NAV_ITEMS = [
  { label: "Home", to: "/home" },
  { label: "Treinos", to: "/treinos" },
  { label: "Exercícios", to: "/exercicios" },
  { label: "Histórico", to: "/historico" },
];

function Header({ userName }) {
  const [username, setUsername] = useState("Teste Dentro dos States");
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const menuRef = useRef(null);
  const { logout } = useAuth();

  useEffect(() => {
    api
      .get("/auth/me")
      .then(({ data }) => setUsername(data.name))
      .catch(() => {});
  }, []);

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    function handleEsc(e) {
      if (e.key === "Escape") {
        setMenuOpen(false);
        setMobileNavOpen(false);
      }
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
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        background:
          "linear-gradient(0deg, #141210 0%, #17130f 30%, rgba(255,77,28,0.05) 100%)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        boxShadow: "0 1px 12px rgba(0,0,0,0.75)",
        fontFamily: "'Barlow', sans-serif",
      }}
    >
      <div
        className="px-8 grid grid-cols-3 items-center"
        style={{ height: "66px" }}
      >
        <nav className="hidden md:flex items-center gap-1 justify-self-start">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className="relative px-4 py-2 rounded-xl text-base transition-all"
              style={({ isActive }) => ({
                color: isActive ? ORANGE : "#c9c4bf",
                fontWeight: 550,
                background: "transparent",
                boxShadow: "none",
                letterSpacing: "0.01em",
              })}
              onMouseOver={(e) => {
                if (e.currentTarget.getAttribute("aria-current") !== "page") {
                  e.currentTarget.style.color = "#ffffff";
                }
              }}
              onMouseOut={(e) => {
                if (e.currentTarget.getAttribute("aria-current") !== "page") {
                  e.currentTarget.style.color = "#c9c4bf";
                }
              }}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <button
          type="button"
          onClick={() => setMobileNavOpen((v) => !v)}
          aria-haspopup="menu"
          aria-expanded={mobileNavOpen}
          aria-label={mobileNavOpen ? "Fechar menu" : "Abrir menu"}
          className="md:hidden justify-self-start p-2 rounded-lg"
          style={{ color: TEXT }}
        >
          {mobileNavOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

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
              color: "#ffffff",
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
                background: PANEL,
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
                  {username}
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
                  logout();
                }}
              />
            </div>
          )}
        </div>
      </div>

      {mobileNavOpen && (
        <div
          className="md:hidden px-4 pb-4 flex flex-col gap-1"
          style={{ borderTop: "1px solid " + BORDER }}
        >
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setMobileNavOpen(false)}
              className="px-4 py-3 rounded-xl text-base"
              style={({ isActive }) => ({
                color: isActive ? ORANGE : "#c9c4bf",
                fontWeight: 550,
                background: isActive ? FIELD : "transparent",
              })}
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      )}
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
