import type { GameTileData, TileState } from '../game/types'

const tileStyles: Record<TileState, string> = {
  empty: 'border-zinc-400 bg-zinc-300 text-black',
  correct: 'border-green-600 bg-green-600 text-white',
  present: 'border-yellow-600 bg-yellow-600 text-white',
  absent: 'border-zinc-500 bg-zinc-500 text-white',
}

type GameTileProps = {
  tile: GameTileData
}

export function GameTile({ tile }: GameTileProps) {
  return (
    <div
      className={`flex h-14 w-14 items-center justify-center border-[3px] text-[2.15rem] font-bold uppercase leading-none md:h-16 md:w-16 ${tileStyles[tile.state]}`}
      aria-label={tile.letter ? `tile-${tile.letter}` : 'empty-tile'}
    >
      {tile.letter}
    </div>
  )
}
