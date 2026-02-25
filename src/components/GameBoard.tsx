import { GameTile } from './GameTile'
import type { GameBoardRowData } from '../game/types'

type GameBoardProps = {
  rows: GameBoardRowData[]
}

export function GameBoard({ rows }: GameBoardProps) {
  const columnCount = rows[0]?.length ?? 0

  return (
    <section aria-label="game-board" className="grid gap-[8px]">
      {rows.map((row, rowIndex) => (
        <div
          key={rowIndex}
          className="grid gap-[8px]"
          style={{
            gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))`,
          }}
        >
          {row.map((tile, colIndex) => (
            <GameTile key={`${rowIndex}-${colIndex}`} tile={tile} />
          ))}
        </div>
      ))}
    </section>
  )
}
