export const formatDate = (day: number, month: number, year: number) => {
  const key = new Date(year, month, day).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  return key.replace(/\. /g, "-").slice(0, -1);
};
