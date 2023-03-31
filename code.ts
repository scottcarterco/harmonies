figma.showUI(__html__, { width: 300, height: 400 });

figma.ui.onmessage = async (msg) => {
  if (msg.type === 'get-color') {
    const color = msg.color;
    const harmonyType = msg.harmonyType;

    const harmonyColors = generateHarmonyColors(color, harmonyType);

    figma.ui.postMessage({
      type: 'update-harmony-colors',
      harmonyColors: harmonyColors,
    });
  } else if (msg.type === 'eye-dropper') {
    const nodes = figma.currentPage.selection;
    if (nodes.length > 0 && nodes[0].fills.length > 0) {
      const color = nodes[0].fills[0].color;
      const hexColor = rgbToHex(color.r * 255, color.g * 255, color.b * 255);
      figma.ui.postMessage({ type: 'update-color', color: hexColor });
    } else {
      figma.notify('Select an object with a fill color');
    }
  }
};

function generateHarmonyColors(color: string, harmonyType: string): string[] {
  // Generate harmony colors based on the input color and harmony type.
}

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
}

function generateHarmonyColors(color: string, harmonyType: string): string[] {
  const hslColor = hexToHsl(color);
  let harmonyColors = [];

  switch (harmonyType) {
    case 'complementary':
      harmonyColors = [rotateHue(hslColor, 180)];
      break;
    case 'analogous':
      harmonyColors = [rotateHue(hslColor, -30), rotateHue(hslColor, 30)];
      break;
    case 'triadic':
      harmonyColors = [rotateHue(hslColor, 120), rotateHue(hslColor, 240)];
      break;
  }

  return harmonyColors.map((hsl) => hslToHex(hsl));
}

function hexToHsl(hex: string): [number, number, number] {
  const rgb = hexToRgb(hex);
  return rgbToHsl(rgb[0], rgb[1], rgb[2]);
}

function hslToHex(hsl: [number, number, number]): string {
  const rgb = hslToRgb(hsl[0], hsl[1], hsl[2]);
  return rgbToHex(rgb[0], rgb[1], rgb[2]);
}

function rotateHue(hsl: [number, number, number], degrees: number): [number, number, number] {
  return [(hsl[0] + degrees + 360) % 360, hsl[1], hsl[2]];
}

