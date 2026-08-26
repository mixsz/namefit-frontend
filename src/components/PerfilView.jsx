"use client";

import { useState, useRef, useEffect } from "react";
import { ORANGE, BG, FIELD, BORDER, TEXT, MUTED } from "../theme";
import {
  Apple,
  Bird,
  Bug,
  Calendar,
  Cat,
  Check,
  Crown,
  Dog,
  Dumbbell,
  Fish,
  Flame,
  Flower,
  KeyRound,
  Lock,
  Mail,
  Pencil,
  Rabbit,
  Rocket,
  Snail,
  Squirrel,
  Star,
  TrendingUp,
  Turtle,
  User,
  X,
  Zap,
  Image as ImageIcon,
} from "lucide-react";
import ConnectionErrorState from "./ConnectionErrorState.jsx";

const avatarOptions = [
  { id: "USER", name: "Pessoa", icon: User },
  { id: "CAT", name: "Gato", icon: Cat },
  { id: "BIRD", name: "Pássaro", icon: Bird },
  { id: "FISH", name: "Peixe", icon: Fish },
  { id: "RABBIT", name: "Coelho", icon: Rabbit },
  { id: "TURTLE", name: "Tartaruga", icon: Turtle },
  { id: "FLAME", name: "Fogo", icon: Flame },
  { id: "ROCKET", name: "Foguete", icon: Rocket },
  { id: "CROWN", name: "Coroa", icon: Crown },
  { id: "ZAP", name: "Raio", icon: Zap },
  { id: "STAR", name: "Estrela", icon: Star },
  { id: "BUG", name: "Inseto", icon: Bug },
  { id: "SQUIRREL", name: "Esquilo", icon: Squirrel },
  { id: "APPLE", name: "Maçã", icon: Apple },
  { id: "ROSE", name: "Rosa", icon: Flower }, // ícone visual só, id continua ROSE
  { id: "PANDA", name: "Panda", icon: Dog }, // ícone visual só, id continua PANDA
  { id: "SNAIL", name: "Caracol", icon: Snail },
];

function findAvatarOption(id) {
  return avatarOptions.find((opt) => opt.id === id) ?? avatarOptions[0];
}

export default function PerfilView({
  data,
  loading,
  connectionError,
  onSaveName,
  onSaveAvatar,
  onSavePassword,
  onLogout,
}) {
  const [modal, setModal] = useState(null);
  const [draftName, setDraftName] = useState("");
  const [selectedAvatarId, setSelectedAvatarId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState("");

  const currentAvatar = data
    ? findAvatarOption(data.avatarId)
    : findAvatarOption(null);

  function openAvatarModal() {
    setSelectedAvatarId(data.avatarId);
    setModal("avatar");
  }

  async function saveAvatar() {
    setSaving(true);
    try {
      await onSaveAvatar(selectedAvatarId);
      setModal(null);
    } catch {
      // erro pelo toast
    } finally {
      setSaving(false);
    }
  }

  function openPasswordModal() {
    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setPasswordError("");
    setModal("password");
  }

  async function savePassword() {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("As senhas não coincidem");
      return;
    }
    setSaving(true);
    setPasswordError("");
    try {
      await onSavePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      setModal(null);
    } catch (error) {
      const message = error.response?.data || "Erro ao atualizar senha";
      setPasswordError(
        typeof message === "string" ? message : "Erro ao atualizar senha",
      );
    } finally {
      setSaving(false);
    }
  }

  function formatMemberSince(isoDate) {
    if (!isoDate) return "";
    return new Date(isoDate).toLocaleDateString("pt-BR", {
      month: "long",
      year: "numeric",
    });
  }

  const NAME_PATTERN = /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/;

  function getNameError(value) {
    if (!value.trim()) return "Nome é obrigatório.";
    if (!NAME_PATTERN.test(value)) return "O nome deve conter apenas letras.";
    return "";
  }

  const nameError = getNameError(draftName);
  const isNameValid = !nameError;

  function openNameModal() {
    setDraftName(data.name);
    setModal("name");
  }

  async function saveName() {
    if (!isNameValid) return;
    const trimmed = draftName.trim();
    if (trimmed === data.name) {
      setModal(null);
      return;
    }
    setSaving(true);
    try {
      await onSaveName(trimmed);
      setModal(null);
    } catch {
      // erro inesperado do servidor (rede, etc.) segue via toast
    } finally {
      setSaving(false);
    }
  }

  return (
    <main
      className="min-h-screen w-full"
      style={{
        background:
          "radial-gradient(circle at 50% -10%, #201a15 0%, #0c0a08 60%)",
        backgroundAttachment: "fixed",
        fontFamily: "'Barlow', sans-serif",
        paddingTop: "var(--header-height, 90px)",
      }}
    >
      <div className="mx-auto w-full max-w-6xl px-6 pb-16 md:px-10">
        {loading ? (
          <div className="flex min-h-[60vh] items-center justify-center">
            <p style={{ color: MUTED }}>Carregando perfil...</p>
          </div>
        ) : connectionError ? (
          <ConnectionErrorState onRetry={() => window.location.reload()} />
        ) : (
          <>
            <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1
                  className="font-bold leading-none"
                  style={{
                    color: TEXT,
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontSize: "clamp(2.4rem, 5vw, 3.6rem)",
                    letterSpacing: "-0.01em",
                  }}
                >
                  Meu perfil
                </h1>
                <p className="mt-2 text-sm" style={{ color: MUTED }}>
                  Gerencie suas informações e acompanhe sua jornada.
                </p>
              </div>
              <span
                className="hidden shrink-0 items-center gap-2 text-sm font-bold uppercase tracking-[0.12em] sm:inline-flex"
                style={{ color: ORANGE }}
              >
                <Star size={15} fill={ORANGE} />
                Membro NameFit
              </span>
            </header>

            <section
              className="rounded-2xl border px-6 py-9 sm:px-8 sm:py-12"
              style={{
                background:
                  "radial-gradient(180% 600% at 100% -130%, rgba(255, 110, 50, 0.06) 0%, rgba(180, 60, 15, 0.02) 20%, rgb(23, 19, 16) 45%, rgb(14, 11, 9) 100%)",
                backgroundClip: "padding-box",
                borderColor: BORDER,
              }}
            >
              <div className="flex flex-col gap-8 sm:min-w-0 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 flex-1 items-center gap-5">
                  <div className="relative shrink-0 group">
                    <div
                      className="flex h-24 w-24 items-center justify-center rounded-full text-[#0c0a08] sm:h-28 sm:w-28 cursor-pointer overflow-hidden"
                      style={{ background: ORANGE }}
                      onClick={openAvatarModal}
                      role="button"
                      aria-label="Alterar avatar"
                    >
                      {(() => {
                        const Icon = currentAvatar.icon;
                        return <Icon size={70} strokeWidth={1.8} />;
                      })()}

                      <div
                        className="absolute inset-0 hidden items-center justify-center rounded-full opacity-0 transition-opacity duration-200 group-hover:opacity-100 sm:flex"
                        style={{ background: "rgba(0,0,0,0.55)" }}
                      >
                        <Pencil size={22} strokeWidth={2} color={TEXT} />
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={openAvatarModal}
                      aria-label="Alterar avatar"
                      className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full border-4 sm:hidden"
                      style={{
                        borderColor: "#100d0b",
                        background: ORANGE,
                        color: BG,
                      }}
                    >
                      <Pencil size={13} strokeWidth={2.8} />
                    </button>
                  </div>
                  <div className="min-w-0">
                    <div className="flex min-w-0 items-center gap-2">
                      <h2
                        className="min-w-0 truncate font-bold leading-[1.15]"
                        style={{
                          color: TEXT,
                          fontFamily: "'Barlow Condensed', sans-serif",
                          fontSize: "clamp(1.5rem, 2.2vw, 2.1rem)",
                        }}
                      >
                        {data.name}
                      </h2>
                      <button
                        type="button"
                        onClick={openNameModal}
                        aria-label="Editar nome"
                        className="rounded-lg p-1 transition-colors"
                        style={{ color: MUTED }}
                        onMouseOver={(e) =>
                          (e.currentTarget.style.color = ORANGE)
                        }
                        onMouseOut={(e) =>
                          (e.currentTarget.style.color = MUTED)
                        }
                      >
                        <Pencil size={16} strokeWidth={2} />
                      </button>
                    </div>
                    <p className="mt-1 text-sm" style={{ color: MUTED }}>
                      Membro desde {formatMemberSince(data.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-[auto_auto_auto] justify-between gap-3 sm:flex sm:flex-wrap sm:items-center sm:gap-8">
                  <StatItem
                    icon={
                      <Dumbbell size={26} color={ORANGE} strokeWidth={2.2} />
                    }
                    label="Treinos criados"
                    value={data.totalWorkouts}
                  />

                  <div
                    className="hidden h-16 w-px sm:block"
                    style={{ background: BORDER }}
                  />
                  <StatItem
                    icon={
                      <TrendingUp size={26} color={ORANGE} strokeWidth={2.2} />
                    }
                    label="Sessões concluídas"
                    value={data.totalSessions}
                  />

                  <div
                    className="hidden h-16 w-px sm:block"
                    style={{ background: BORDER }}
                  />
                  <StatItem
                    icon={
                      <Calendar size={26} color={ORANGE} strokeWidth={2.2} />
                    }
                    label="Ativo desde"
                    value={formatMemberSince(data.createdAt)}
                  />
                </div>
              </div>
            </section>

            <section
              className="mt-8 rounded-2xl border p-6 sm:p-8"
              style={{
                background:
                  "radial-gradient(140% 600% at 100% -130%, rgba(255,110,50,0.06) 0%, rgba(180,60,15,0.02) 20%, #171310 45%, #0e0b09 100%)",

                borderColor: BORDER,
              }}
            >
              <div
                className="mb-5 flex items-center gap-2.5 pb-5"
                style={{ borderBottom: "1px solid " + BORDER }}
              >
                <KeyRound size={19} color={ORANGE} strokeWidth={2.2} />
                <h3
                  className="font-bold"
                  style={{
                    color: TEXT,
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontSize: "1.5rem",
                    lineHeight: 1,
                  }}
                >
                  Dados de acesso
                </h3>
              </div>

              <div className="grid gap-8 sm:grid-cols-2">
                <SecurityField
                  label="Email"
                  value={data.email}
                  icon={Mail}
                  locked
                />
                <SecurityField
                  label="Senha"
                  value="••••••••"
                  icon={Lock}
                  action={openPasswordModal}
                />
              </div>
            </section>

            <button
              type="button"
              onClick={onLogout || (() => {})}
              className="mx-auto mt-8 block text-center text-xs font-semibold uppercase tracking-[0.08em] transition-opacity hover:opacity-80"
              style={{ color: "#bf4444" }}
            >
              Finalizar sessão
            </button>
          </>
        )}
      </div>

      {modal === "avatar" && (
        <Modal
          title="Escolha seu avatar"
          onClose={() => setModal(null)}
          icon={ImageIcon}
        >
          <div className="nf-scroll max-h-[192px] overflow-y-auto">
            <div className="grid grid-cols-4 gap-3 pr-1 mt-1 ml-0.5 ">
              {avatarOptions.map(({ id, name: label, icon: Icon }) => {
                const isSelected = selectedAvatarId === id;
                return (
                  <button
                    key={id}
                    type="button"
                    aria-label={label}
                    onClick={() => setSelectedAvatarId(id)}
                    className="relative flex aspect-square items-center justify-center rounded-full border-2 transition-all hover:scale-105"
                    style={{
                      background: isSelected ? ORANGE : FIELD,
                      borderColor: BORDER,
                      color: isSelected ? BG : MUTED,
                      opacity: isSelected ? 1 : 0.6,
                    }}
                  >
                    <Icon size={55} strokeWidth={1.5} />
                  </button>
                );
              })}
            </div>
          </div>
          <ModalAction
            label="Confirmar"
            icon={Check}
            onClick={saveAvatar}
            disabled={saving}
          />
        </Modal>
      )}

      {modal === "name" && (
        <Modal title="Editar nome" onClose={() => setModal(null)} icon={User}>
          <label
            className="text-xs font-bold uppercase tracking-[0.14em]"
            style={{ color: MUTED }}
            htmlFor="profile-name"
          >
            Nome
          </label>
          <input
            id="profile-name"
            value={draftName}
            onChange={(event) => setDraftName(event.target.value)}
            autoFocus
            className="mt-2 w-full rounded-xl border bg-[#201a15] px-4 py-2 text-sm outline-none focus:border-[#FF4D1C]"
            style={{
              borderColor:
                draftName !== data.name && nameError ? "#ef4444" : BORDER,
              color: TEXT,
            }}
          />
          {draftName !== data.name && nameError && (
            <p
              className="mt-2 text-xs font-semibold"
              style={{ color: "#ff5c5c" }}
            >
              {nameError}
            </p>
          )}
          <ModalAction
            label="Confirmar"
            icon={Check}
            onClick={saveName}
            disabled={saving || !isNameValid}
          />
        </Modal>
      )}

      {modal === "password" && (
        <Modal title="Alterar senha" onClose={() => setModal(null)} icon={Lock}>
          <div className="grid gap-3">
            <label
              className="text-xs font-bold uppercase tracking-[0.12em]"
              style={{ color: MUTED }}
            >
              Senha atual
              <input
                type="password"
                value={passwordForm.currentPassword}
                onChange={(e) =>
                  setPasswordForm((p) => ({
                    ...p,
                    currentPassword: e.target.value,
                  }))
                }
                className="mt-2 w-full rounded-xl border bg-[#201a15] px-4 py-2 text-sm outline-none focus:border-[#FF4D1C]"
                style={{ borderColor: BORDER, color: TEXT }}
              />
            </label>
            <label
              className="text-xs font-bold uppercase tracking-[0.12em]"
              style={{ color: MUTED }}
            >
              Nova senha
              <input
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) =>
                  setPasswordForm((p) => ({
                    ...p,
                    newPassword: e.target.value,
                  }))
                }
                className="mt-2 w-full rounded-xl border bg-[#201a15] px-4 py-2 text-sm outline-none focus:border-[#FF4D1C]"
                style={{ borderColor: BORDER, color: TEXT }}
              />
            </label>
            <label
              className="text-xs font-bold uppercase tracking-[0.12em]"
              style={{ color: MUTED }}
            >
              Confirmar nova senha
              <input
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(e) =>
                  setPasswordForm((p) => ({
                    ...p,
                    confirmPassword: e.target.value,
                  }))
                }
                className="mt-2 w-full rounded-xl border bg-[#201a15] px-4 py-2 text-sm outline-none focus:border-[#FF4D1C]"
                style={{ borderColor: BORDER, color: TEXT }}
              />
            </label>
            {passwordError && (
              <p className="text-xs" style={{ color: "#cf4444" }}>
                {passwordError}
              </p>
            )}
          </div>
          <ModalAction
            label="Confirmar"
            icon={Check}
            onClick={savePassword}
            disabled={saving}
          />
        </Modal>
      )}
    </main>
  );
}

function StatItem({ icon, label, value }) {
  return (
    <div className="flex items-center gap-3">
      {icon}
      <div className="flex flex-col justify-center">
        <p
          className="text-xs font-bold uppercase tracking-[0.1em] leading-none"
          style={{ color: MUTED }}
        >
          {label}
        </p>
        <p
          className="mt-1 whitespace-nowrap text-xl font-bold leading-none"
          style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            color: TEXT,
          }}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

function SecurityField({ label, value, icon: Icon, action, locked }) {
  return (
    <div>
      {label && (
        <p
          className="mb-2 text-xs font-bold uppercase tracking-[0.12em]"
          style={{ color: MUTED }}
        >
          {label}
        </p>
      )}
      <div
        className="group relative flex min-h-12 w-[97%] items-center gap-3 rounded-xl border px-4 py-2 pr-12 text-base"
        style={{ background: FIELD, borderColor: BORDER, color: TEXT }}
      >
        {Icon && <Icon size={17} color={ORANGE} strokeWidth={2.2} />}
        <span className="truncate">{value}</span>
        {action && !locked && (
          <button
            type="button"
            onClick={action}
            aria-label="Editar"
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 transition-colors"
            style={{ color: MUTED }}
            onMouseOver={(e) => (e.currentTarget.style.color = ORANGE)}
            onMouseOut={(e) => (e.currentTarget.style.color = MUTED)}
          >
            <Pencil size={14} strokeWidth={2.3} />
          </button>
        )}
      </div>
    </div>
  );
}

function Modal({ title, onClose, children, icon: Icon }) {
  const modalRef = useRef(null);

  useEffect(() => {
    function handleEsc(e) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center px-4"
      style={{
        background: "rgba(0,0,0,0.65)",
        backdropFilter: "blur(4px)",
      }}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
    >
      <div
        ref={modalRef}
        className="w-full max-w-md overflow-hidden rounded-2xl border p-6"
        style={{
          background: `linear-gradient(180deg, #141210 0%, #17130f 100%)`,
          borderColor: BORDER,
          boxShadow: "0 24px 60px rgba(0,0,0,0.6)",
        }}
      >
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {Icon && (
              <Icon
                size={19}
                color={ORANGE}
                strokeWidth={2.2}
                style={{ marginTop: "3px" }}
              />
            )}
            <h2
              className="font-bold"
              style={{
                color: TEXT,
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: "1.5rem",
                lineHeight: 1,
              }}
            >
              {title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="rounded-lg p-1.5 transition-colors"
            style={{ color: MUTED }}
            onMouseOver={(e) => (e.currentTarget.style.color = TEXT)}
            onMouseOut={(e) => (e.currentTarget.style.color = MUTED)}
          >
            <X size={20} strokeWidth={2} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function ModalAction({ label, icon: Icon, onClick, disabled }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-extrabold uppercase tracking-[0.05em] transition-all disabled:opacity-60"
      style={{
        background: ORANGE,
        color: BG,
        boxShadow: "0 2px 8px rgba(0,0,0,0.35)",
      }}
      onMouseOver={(e) => {
        if (disabled) return;
        e.currentTarget.style.background = "#ff6b42";
        e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.4)";
      }}
      onMouseOut={(e) => {
        if (disabled) return;
        e.currentTarget.style.background = ORANGE;
        e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.35)";
      }}
    >
      {Icon && <Icon size={16} strokeWidth={2.5} />}
      {label}
    </button>
  );
}