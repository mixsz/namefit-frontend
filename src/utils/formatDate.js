export function formatLastTrained(dateStr) {
  if (!dateStr) return null;
  const normalized = dateStr.length > 23 ? dateStr.slice(0, 23) : dateStr;
  const diff = Date.now() - new Date(normalized).getTime();
  if (diff < 0) return "hoje";
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "hoje";
  if (days === 1) return "há 1 dia";
  if (days < 7) return `há ${days} dias`;
  const weeks = Math.floor(days / 7);
  if (weeks === 1) return "há 1 semana";
  if (weeks < 5) return `há ${weeks} semanas`;
  const months = Math.floor(days / 30);
  if (months === 1) return "há 1 mês";
  return `há ${months} meses`;
}