export default function getRandomBg() {
  const colors = ["blue", "red", "green", "yellow", "purple", "pink"];
  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
}
