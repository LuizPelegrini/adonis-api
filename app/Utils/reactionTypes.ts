const reactions = ['like', 'love', 'laugh', 'sad', 'angry'] as const

type ReactionsType = typeof reactions[number]

export { reactions, ReactionsType }
