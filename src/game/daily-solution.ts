export function getDailySolution(solutions: string[], today = new Date()): string {
  if (solutions.length === 0) {
    throw new Error('solutions list cannot be empty')
  }
  const index =
    today.getFullYear() * 10000 + today.getMonth() * 100 + today.getDate()
  return solutions[index % solutions.length]
}
