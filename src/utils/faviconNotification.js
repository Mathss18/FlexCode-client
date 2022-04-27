export function changeFavicon(config={}) {
  console.log('TROQUEI O FAVICON');
  var favicon = new Image();
  const RADIUS = config.radius ?? 16;
  const DIAMETER = config.radius * 2;
  const COUNTER = config.counter ?? '';
  const FONT_COLOR =
    config.fontColor === undefined || null ? "#FFF" : config.fontColor;
  const BACKGROUND_COLOR =
    config.backgroundColor === undefined || null
      ? "#DB0101"
      : config.backgroundColor;

  favicon.onload = function () {
    var oldLink = document.querySelector("link[rel~='icon']");
    var newLink = document.createElement("link");
    newLink.rel = "icon";

    var canvas = document.createElement("canvas");
    canvas.width = favicon.width;
    canvas.height = favicon.height;

    var ctx = canvas.getContext("2d");
    ctx.drawImage(favicon, 0, 0);
    const POS_X = canvas.width / 2 + (canvas.width - DIAMETER) / 2;
    const POS_Y = canvas.height / 2 + (canvas.height - DIAMETER) / 2;

    // === Draw the circle ===
    ctx.beginPath();
    ctx.arc(POS_X, POS_Y, RADIUS, 0, 2 * Math.PI, false);
    ctx.fillStyle = BACKGROUND_COLOR;
    ctx.fill();
    ctx.stroke();
    ctx.closePath();

    // === Draw the text ===
    if (COUNTER !== undefined || COUNTER !== null) {
      ctx.beginPath();
      ctx.font = `bold ${DIAMETER}px Roboto`;
      ctx.fillStyle = FONT_COLOR;
      ctx.fillText(
        COUNTER + "",
        POS_X - RADIUS / 2,
        POS_Y + RADIUS / 2 + RADIUS / 4
      );
      ctx.strokeStyle = FONT_COLOR;
      ctx.fill();
      ctx.stroke();
      ctx.closePath();
    }

    if (canvas) {
      newLink.href = canvas.toDataURL();
      if (oldLink) {
        document.head.removeChild(oldLink);
        document.head.appendChild(newLink);
      }
    }
  };
  favicon.src = `${window.location.origin}/favicon.ico`;
}
