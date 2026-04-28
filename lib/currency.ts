export function formatZar(amount: string | number) {
  const value = Number(amount)

  return `R${(Number.isFinite(value) ? value : 0).toFixed(2)}`
}
