export const NEGATIVE_COMMENTS: string[] = [
  "You can't do it!",
  "Give up already!",
  "You're not good enough!",
  "Nobody likes you!",
  "You'll never make it!",
  "Stop trying!",
  "You're a loser!",
  "Just quit!",
  "You're worthless!",
  "Epic fail!",
  "You suck!",
  "Pathetic!",
  "You're so bad!",
  "Embarrassing!",
  "Total disaster!",
  "You're hopeless!",
  "Don't even try!",
  "You're a joke!",
  "Terrible!",
  "You'll never win!",
];

export function getRandomComment(): string {
  return NEGATIVE_COMMENTS[Math.floor(Math.random() * NEGATIVE_COMMENTS.length)];
}
