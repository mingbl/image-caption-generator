var imgSrc;
window.onload = function () {
  let imgInput = document.querySelector("input[type='file']");
  if (imgInput.files && imgInput.files[0]) {
    imgSrc = URL.createObjectURL(imgInput.files[0]);
  };
};
window.addEventListener("load", function () {
  document.querySelector("input[type='file']").addEventListener("change", function () {
    if (this.files && this.files[0]) {
      imgSrc = URL.createObjectURL(this.files[0])
    }
  })
});
// ^ Taken from https://stackoverflow.com/a/45931408

const canvas = document.getElementById("canvas"), ctx = canvas.getContext("2d"),
  alignSlider = document.getElementById("top-text-alignment"),
  fontsizeSlider = document.getElementById("top-text-size"),
  subtitleFontsizeSlider = document.getElementById("bottom-text-size"),
  paddingSlider = document.getElementById("padding-slider"),
  topTextBox = document.getElementById("top-text"),
  bottomTextBox = document.getElementById("bottom-text"),
  aligning = ["left", "center", "right"],
  backgroundColourInput = document.getElementById("background-colour"),
  fontColourInput = document.getElementById("font-colour"),
  subtitleBackgroundCheck = document.getElementById("subtitle-background-check"),
  subtitleItalicCheck = document.getElementById("subtitle-italic-check"),
  subtitleBackgroundOpacity = document.getElementById("opacity-slider")

var width = 500, border = 20;

const textBoxes = document.querySelectorAll(".text-boxes"), updateMe = document.querySelectorAll(".update-me")
textBoxes.forEach(element => element.addEventListener("input", event => { save() }))
updateMe.forEach(element => element.addEventListener("change", event => { save() }))

function save() {
  if (imgSrc == undefined) return

  var alignOption = alignSlider.value,
    backgroundColour = backgroundColourInput.value,
    fontColour = fontColourInput.value;

  var img = new Image();
  img.src = imgSrc;
  img.onload = function () {
    width = img.width;
    border = width * 0.025
    if (topTextBox.value == "") {
      var topText = [], useBorder = 0;
    } else {
      var topText = topTextBox.value.split("\n"), useBorder = 1.5;
    };
    if (bottomTextBox.value == "") {
      var bottomText = [];
    } else {
      var bottomText = bottomTextBox.value.split("\n").reverse();
    };
    var fontSize = fontsizeSlider.value * width,
      subtitleFontSize = subtitleFontsizeSlider.value * width,
      padding = paddingSlider.value * subtitleFontSize,
      height = width / img.width * img.height + fontSize * topText.length + border * useBorder,
      aligningStart = [border, width / 2, width - border],
      textStart = aligningStart[alignOption],
      captionHeight = fontSize * topText.length + border * useBorder;

    canvas.width = width, canvas.height = height;

    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = fontSize + "px sans-serif";
    ctx.fillStyle = "black";
    ctx.textAlign = aligning[alignOption];
    for (var i = 0; i < topText.length; i++) {
      ctx.fillText(topText[i], textStart, fontSize * (i + 1) + border / 2);
    };

    ctx.drawImage(img, 0, 0, img.width, img.height, 0, captionHeight, width, height - captionHeight);

    ctx.font = `${(subtitleItalicCheck.checked ? 'italic ' : ' ')}${subtitleFontSize}px sans-serif`;
    ctx.textAlign = "center";

    var fontWidths = [];
    for (var i = 0; i < bottomText.length; i++) {
      fontWidths.push(ctx.measureText(bottomText[i]).width + 1);
    };
    var maxFontWidth = Math.max.apply(Math, fontWidths);

    let backgroundOn = subtitleBackgroundCheck.checked;
    let backgroundOpacity = subtitleBackgroundOpacity.value;
    if (backgroundOn) {
      ctx.globalAlpha = backgroundOpacity;
      ctx.fillStyle = backgroundColour;
      ctx.fillRect(width / 2 - maxFontWidth / 2 - padding, height - border - bottomText.length * subtitleFontSize, maxFontWidth + padding * 2, subtitleFontSize * bottomText.length + (padding - 0));
      ctx.globalAlpha = 1;
    } else {
      ctx.shadowBlur = 20;
      ctx.shadowColor = "black";
    }

    ctx.fillStyle = fontColour; // Print the text
    for (var i = 0; i < bottomText.length; i++) {
      let fontWidth = ctx.measureText(bottomText[i]).width;
      ctx.fillText(bottomText[i], width / 2, height - border - i * subtitleFontSize);
    };
  };

  document.getElementById("download").style.visibility = "visible";
};

// Download button taken from https://stackoverflow.com/a/42546234
function download() {
  var download = document.getElementById("download");
  var image = document.getElementById("canvas").toDataURL("image/png").replace("image/png", "image/octet-stream");
  download.setAttribute("href", image);
};
