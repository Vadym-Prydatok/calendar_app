import html2canvas from "html2canvas";

export const saveAsImage = (selector: string) => {
  const calendarElement = document.querySelector(selector) as HTMLElement;
  if (calendarElement) {
    html2canvas(calendarElement).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = imgData;
      link.download = "calendar.png";
      link.click();
    });
  }
};
