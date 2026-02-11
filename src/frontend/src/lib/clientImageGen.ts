export async function generateImage(prompt: string): Promise<{ dataUrl: string; blob: Blob }> {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 600;
    const ctx = canvas.getContext('2d')!;

    // Generate a deterministic seed from the prompt
    let seed = 0;
    for (let i = 0; i < prompt.length; i++) {
      seed = (seed * 31 + prompt.charCodeAt(i)) % 1000000;
    }

    // Seeded random function
    const random = (min: number = 0, max: number = 1) => {
      seed = (seed * 9301 + 49297) % 233280;
      return min + (seed / 233280) * (max - min);
    };

    // Generate color palette from prompt
    const hue = random(0, 360);
    const colors = [
      `hsl(${hue}, 70%, 60%)`,
      `hsl(${(hue + 60) % 360}, 70%, 55%)`,
      `hsl(${(hue + 120) % 360}, 70%, 65%)`,
      `hsl(${(hue + 180) % 360}, 70%, 50%)`,
    ];

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, colors[0]);
    gradient.addColorStop(1, colors[1]);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw abstract shapes based on prompt
    const shapeCount = 5 + Math.floor(random(0, 10));
    for (let i = 0; i < shapeCount; i++) {
      ctx.fillStyle = colors[Math.floor(random(0, colors.length))];
      ctx.globalAlpha = random(0.3, 0.7);

      const x = random(0, canvas.width);
      const y = random(0, canvas.height);
      const size = random(50, 200);

      if (random() > 0.5) {
        // Circle
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Rectangle
        ctx.fillRect(x - size / 2, y - size / 2, size, size);
      }
    }

    // Add text overlay with prompt
    ctx.globalAlpha = 1;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.font = 'bold 24px Space Grotesk, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    const maxWidth = canvas.width - 100;
    const words = prompt.split(' ');
    let line = '';
    let y = canvas.height / 2;
    const lineHeight = 35;
    
    for (let i = 0; i < words.length; i++) {
      const testLine = line + words[i] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && i > 0) {
        ctx.fillText(line, canvas.width / 2, y);
        line = words[i] + ' ';
        y += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, canvas.width / 2, y);

    canvas.toBlob((blob) => {
      if (blob) {
        const dataUrl = canvas.toDataURL('image/png');
        resolve({ dataUrl, blob });
      }
    }, 'image/png');
  });
}
