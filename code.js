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
    }
};

function generateHarmonyColors(color, harmonyType) {
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

function hexToHsl(hex) {
    const rgb = hexToRgb(hex);
    return rgbToHsl(rgb[0], rgb[1], rgb[2]);
}

function hslToHex(hsl) {
    const rgb = hslToRgb(hsl[0], hsl[1], hsl[2]);
    return rgbToHex(rgb[0], rgb[1], rgb[2]);
}

function rotateHue(hsl, degrees) {
    return [(hsl[0] + degrees + 360) % 360, hsl[1], hsl[2]];
}

function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
        ? [
            parseInt(result[1], 16),
            parseInt(result[2], 16),
            parseInt(result[3], 16),
        ]
        : null;
}

function rgbToHex(r, g, b) {
    return ('#' +
        [r, g, b].map((x) => x.toString(16).padStart(2, '0')).join(''));
}

function rgbToHsl(r, g, b) {
    r /= 255, g /= 255, b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0;
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return [h * 360, s * 100, l * 100];
}

function hslToRgb(h, s, l) {
    let r, g, b;

    h /= 360;
    s /= 100;
    l /= 100;

    if (s === 0) {
        r = g = b = l;
    } else {
        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };

        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}
