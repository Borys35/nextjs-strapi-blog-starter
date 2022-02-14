export default function contentToReadTime(content: string) {
  return Math.ceil(content.split(" ").length / 150);
}
