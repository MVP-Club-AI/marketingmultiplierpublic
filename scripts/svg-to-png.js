#!/usr/bin/env node
/**
 * Convert SVG to PNG using Puppeteer
 * Usage: node svg-to-png.js <input.svg> [output.png]
 *
 * If output is not specified, creates input.png in the same directory
 */

const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

async function convertSvgToPng(inputPath, outputPath) {
  // Resolve paths
  const svgPath = path.resolve(inputPath);

  if (!fs.existsSync(svgPath)) {
    console.error(`Error: File not found: ${svgPath}`);
    process.exit(1);
  }

  // Default output path: same name with .png extension
  const pngPath = outputPath
    ? path.resolve(outputPath)
    : svgPath.replace(/\.svg$/i, '.png');

  // Read SVG to get dimensions
  const svgContent = fs.readFileSync(svgPath, 'utf8');
  const widthMatch = svgContent.match(/width="(\d+)"/);
  const heightMatch = svgContent.match(/height="(\d+)"/);

  const width = widthMatch ? parseInt(widthMatch[1]) : 1200;
  const height = heightMatch ? parseInt(heightMatch[1]) : 630;

  console.log(`Converting: ${svgPath}`);
  console.log(`Dimensions: ${width}x${height}`);

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();

    // Set viewport to exact SVG dimensions
    await page.setViewport({ width, height });

    // Navigate to the SVG file
    await page.goto(`file://${svgPath}`, { waitUntil: 'networkidle0' });

    // Hide scrollbars
    await page.addStyleTag({
      content: `
        * { margin: 0; padding: 0; }
        html, body { overflow: hidden; }
      `
    }).catch(() => {});

    // Take screenshot of just the viewport (no scrollbars)
    await page.screenshot({
      path: pngPath,
      clip: { x: 0, y: 0, width, height },
      omitBackground: false
    });

    console.log(`Created: ${pngPath}`);
  } finally {
    await browser.close();
  }
}

// CLI handling
const args = process.argv.slice(2);

if (args.length === 0) {
  console.log('Usage: node svg-to-png.js <input.svg> [output.png]');
  console.log('');
  console.log('Examples:');
  console.log('  node svg-to-png.js visual.svg');
  console.log('  node svg-to-png.js visual.svg output.png');
  process.exit(0);
}

convertSvgToPng(args[0], args[1]).catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
