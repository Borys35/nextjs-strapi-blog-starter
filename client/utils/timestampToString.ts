export default function timestampToString(timeAt: string) {
  const date = new Date(timeAt);

  return `${date.toLocaleString("default", {
    month: "short",
  })} ${date.getDate()}, ${date.getFullYear()}`;
}
