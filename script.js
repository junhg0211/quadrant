// -- draw axis
const axis = document.querySelector("#axis");

// draw x axis
function drawAxis() {
  while (axis.children.length > 0) {
    axis.removeChild(axis.firstChild);
  }

  let linea;
  linea = document.createElementNS("http://www.w3.org/2000/svg", "line");
  linea.setAttribute("x1", 0);
  linea.setAttribute("x2", axis.clientWidth);
  linea.setAttribute("y1", axis.clientHeight / 2);
  linea.setAttribute("y2", axis.clientHeight / 2);
  linea.setAttribute("stroke", "black");

  // draw y axis
  let lineb;
  lineb = document.createElementNS("http://www.w3.org/2000/svg", "line");
  lineb.setAttribute("x1", axis.clientWidth / 2);
  lineb.setAttribute("x2", axis.clientWidth / 2);
  lineb.setAttribute("y1", axis.clientHeight);
  lineb.setAttribute("y2", 0);
  lineb.setAttribute("stroke", "black");

  axis.appendChild(linea);
  axis.appendChild(lineb);
}

drawAxis();

window.addEventListener("resize", () => {
  drawAxis();

  for (let i = 1; i < articleInner.children.length; i++) {
    const label = articleInner.children[i];

    positionLabel(label);
  }
});

// -- adding labels
const articleInner = document.querySelector("#article-inner");
const labelName = document.querySelector("#label-name");
const labelX = document.querySelector("#label-x");
const labelY = document.querySelector("#label-y");
const labelColor = document.querySelector("#label-color");
const labelXNumber = document.querySelector("#label-x-number");
const labelYNumber = document.querySelector("#label-y-number");

labelX.addEventListener("input", (e) => {
  labelXNumber.value = e.target.value;
});

labelXNumber.addEventListener("input", (e) => {
  if (e.target.value > 10) {
    e.target.value = 10;
  }
  if (e.target.value < -10) {
    e.target.value = -10;
  }

  labelX.value = e.target.value;
});

labelY.addEventListener("input", (e) => {
  labelYNumber.value = e.target.value;
});

labelYNumber.addEventListener("input", (e) => {
  if (e.target.value > 10) {
    e.target.value = 10;
  }
  if (e.target.value < -10) {
    e.target.value = -10;
  }

  labelY.value = e.target.value;
});

function getTextWidth(text, font) {
  // re-use canvas object for better performance
  const canvas =
    getTextWidth.canvas ||
    (getTextWidth.canvas = document.createElement("canvas"));
  const context = canvas.getContext("2d");
  context.font = font;
  const metrics = context.measureText(text);
  return metrics.width;
}

function brightnessByColor(color) {
  var color = "" + color,
    isHEX = color.indexOf("#") == 0,
    isRGB = color.indexOf("rgb") == 0;
  if (isHEX) {
    const hasFullSpec = color.length == 7;
    var m = color.substr(1).match(hasFullSpec ? /(\S{2})/g : /(\S{1})/g);
    if (m)
      var r = parseInt(m[0] + (hasFullSpec ? "" : m[0]), 16),
        g = parseInt(m[1] + (hasFullSpec ? "" : m[1]), 16),
        b = parseInt(m[2] + (hasFullSpec ? "" : m[2]), 16);
  }
  if (isRGB) {
    var m = color.match(/(\d+){3}/g);
    if (m)
      var r = m[0],
        g = m[1],
        b = m[2];
  }
  if (typeof r != "undefined") return (r * 299 + g * 587 + b * 114) / 1000;
}

function rgbToHex(rgbType) {
  var rgb = rgbType.replace(/[^%,.\d]/g, "").split(",");

  rgb.forEach(function (str, x, arr) {
    if (str.indexOf("%") > -1) str = Math.round(parseFloat(str) * 2.55);

    str = parseInt(str, 10).toString(16);
    if (str.length === 1) str = "0" + str;

    arr[x] = str;
  });

  return "#" + rgb.join("");
}

const labelFontSize = document.querySelector("#label-font-size");
function positionLabel(label) {
  const fontSize = parseFloat(labelFontSize.value);
  const textWidth = getTextWidth(
    label.innerText,
    `${fontSize}px "Pretendard JP", "Pretendard", sans-serif`,
  );
  label.style.top = `${articleInner.offsetTop + axis.clientHeight - label.y * axis.clientHeight - 2 - fontSize / 2}px`;
  label.style.left = `${articleInner.offsetLeft + label.x * axis.clientWidth - textWidth / 2}px`;
  label.style.fontSize = `${fontSize}px`;

  return textWidth;
}

function createLabel(x, y, backgroundColor, color, content) {
  const label = document.createElement("div");
  label.classList.add("label");
  label.innerText = content;

  // coloring
  label.style.backgroundColor = backgroundColor;
  label.style.color = color;

  // positioning
  label.x = x;
  label.y = y;
  const textWidth = positionLabel(label);

  // click event handling
  label.onclick = () => {
    const top = parseFloat(
      label.style.top.substring(0, label.style.top.length - 2),
    );
    const left = parseFloat(
      label.style.left.substring(0, label.style.left.length - 2),
    );
    const y =
      -(top + 12 - articleInner.offsetTop - axis.clientHeight) /
      axis.clientHeight;
    const x =
      (left + textWidth / 2 - articleInner.offsetLeft) / axis.clientWidth;
    labelY.value = Math.round((y * 20 - 10) * 100) / 100;
    labelX.value = Math.round((x * 20 - 10) * 100) / 100;
    labelYNumber.value = Math.round((y * 20 - 10) * 100) / 100;
    labelXNumber.value = Math.round((x * 20 - 10) * 100) / 100;

    labelName.value = label.innerText;

    labelColor.value = rgbToHex(label.style.backgroundColor);

    articleInner.removeChild(label);
  };

  return label;
}

function addLabel() {
  // text color by background color
  const brightness = brightnessByColor(labelColor.value);
  let color;
  if (brightness <= 128) {
    color = "white";
  } else {
    color = "black";
  }

  // creaate label
  const label = createLabel(
    (parseFloat(labelX.value) + 10) / 20,
    (parseFloat(labelY.value) + 10) / 20,
    labelColor.value,
    color,
    labelName.value,
  );

  articleInner.appendChild(label);
}

function onLabelXChange(e) {
  console.log(e);
  labelX.value = e.value;
}

function onLabelYChange(e) {
  labelY.value = e.value;
}

// -- change font size
function changeFontSize() {
  for (let i = 1; i < articleInner.children.length; i++) {
    const label = articleInner.children[i];
    positionLabel(label);
  }
}

labelFontSize.addEventListener("input", () => changeFontSize());

// -- save file
function save() {
  const labels = [];
  for (let i = 1; i < articleInner.children.length; i++) {
    const label = articleInner.children[i];
    labels.push({
      x: label.x,
      y: label.y,
      name: label.innerText,
      background_color: label.style.backgroundColor,
      color: label.style.color,
    });
  }

  const legends = [];
  for (let i = 1; i < articleLegend.children.length; i++) {
    const legend = articleLegend.children[i];
    legends.push({
      text: legend.innerText,
      background_color: legend.style.backgroundColor,
      color: legend.style.color,
    });
  }

  const filename = "quadrant.json";
  const element = document.createElement("a");
  element.setAttribute(
    "href",
    "data:text/plain;charset=utf-8," +
      encodeURIComponent(JSON.stringify({ labels, legends })),
  );
  element.setAttribute("download", filename);
  element.style.display = "none";
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

const fileInput = document.querySelector("#file");
async function load() {
  const file = fileInput.files.item(0);
  const text = await file.text();
  const json = JSON.parse(text);
  while (articleInner.children.length > 1) {
    articleInner.children.removeChild(articleInner.children[1]);
  }

  json.legends.forEach((rawLegend) => {
    const legend = createLegend(
      rawLegend.text,
      rawLegend.background_color,
      rawLegend.color,
    );
    articleLegend.appendChild(legend);
  });

  drawAxis();

  json.labels.forEach((rawLabel) => {
    const label = createLabel(
      rawLabel.x,
      rawLabel.y,
      rawLabel.background_color,
      rawLabel.color,
      rawLabel.name,
    );
    articleInner.appendChild(label);
  });
}

// -- legends
const legendName = document.querySelector("#legend-name");
const legendColor = document.querySelector("#legend-color");
const articleLegend = document.querySelector("#article-legend");

function createLegend(name, backgroundColor, color) {
  const legend = document.createElement("div");

  legend.innerText = name;
  legend.style.backgroundColor = backgroundColor;
  legend.style.color = color;
  legend.classList.add("legend");

  legend.onclick = () => {
    labelColor.value = rgbToHex(legend.style.backgroundColor);
  };

  return legend;
}

function addLegend() {
  let color;
  const brightness = brightnessByColor(legendColor.value);
  if (brightness <= 128) {
    color = "white";
  } else {
    color = "black";
  }

  const legend = createLegend(legendName.value, legendColor.value, color);
  articleLegend.appendChild(legend);

  drawAxis();
}

// -- capture
const topContainer = document.querySelector("#top-container");
function capture() {
  window.scrollTo(0, 0);

  var svgElements = document.body.querySelectorAll("svg");
  svgElements.forEach(function (item) {
    item.setAttribute("width", item.getBoundingClientRect().width);
    item.setAttribute("height", item.getBoundingClientRect().height);
    item.style.width = null;
    item.style.height = null;
  });

  html2canvas(topContainer, { backgroundColor: "#f7f7f9" }).then(
    function (canvas) {
      var link = document.createElement("a");

      if (typeof link.download === "string") {
        link.href = canvas.toDataURL();
        link.download = "capture.png";

        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);
      } else {
        window.open(uri);
      }
    },
  );
}

// -- coordinate label
const xNegative = document.querySelector("#x-negative");
const xPositive = document.querySelector("#x-positive");
const yNegative = document.querySelector("#y-negative");
const yPositive = document.querySelector("#y-positive");
const rightInput = document.querySelector("#right-input");
const leftInput = document.querySelector("#left-input");
const upInput = document.querySelector("#up-input");
const downInput = document.querySelector("#down-input");

rightInput.addEventListener("input", (e) => {
  xPositive.innerText = e.target.value;
  drawAxis();
});
leftInput.addEventListener("input", (e) => {
  xNegative.innerText = e.target.value;
  drawAxis();
});
upInput.addEventListener("input", (e) => {
  yPositive.innerText = e.target.value;
  drawAxis();
});
downInput.addEventListener("input", (e) => {
  yNegative.innerText = e.target.value;
  drawAxis();
});

xPositive.innerText = rightInput.value;
xNegative.innerText = leftInput.value;
yPositive.innerText = upInput.value;
yNegative.innerText = downInput.value;
drawAxis();
