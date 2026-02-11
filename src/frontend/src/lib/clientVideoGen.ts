export async function generateVideo(prompt: string): Promise<{ blobUrl: string; blob: Blob }> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 600;
    const ctx = canvas.getContext('2d')!;

    // Generate a deterministic seed from the prompt
    let seed = 0;
    for (let i = 0; i < prompt.length; i++) {
      seed = (seed * 31 + prompt.charCodeAt(i)) % 1000000;
    }

    const random = (min: number = 0, max: number = 1) => {
      seed = (seed * 9301 + 49297) % 233280;
      return min + (seed / 233280) * (max - min);
    };

    const hue = random(0, 360);
    const colors = [
      `hsl(${hue}, 70%, 60%)`,
      `hsl(${(hue + 60) % 360}, 70%, 55%)`,
      `hsl(${(hue + 120) % 360}, 70%, 65%)`,
    ];

    const stream = canvas.captureStream(30);
    const mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
    const chunks: Blob[] = [];

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        chunks.push(e.data);
      }
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/webm' });
      const blobUrl = URL.createObjectURL(blob);
      resolve({ blobUrl, blob });
    };

    mediaRecorder.onerror = (e) => {
      reject(e);
    };

    // Animation parameters
    let frame = 0;
    const totalFrames = 90; // 3 seconds at 30fps
    const particles: Array<{ x: number; y: number; vx: number; vy: number; size: number; color: string }> = [];

    // Initialize particles
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: random(0, canvas.width),
        y: random(0, canvas.height),
        vx: random(-2, 2),
        vy: random(-2, 2),
        size: random(5, 20),
        color: colors[Math.floor(random(0, colors.length))],
      });
    }

    const animate = () => {
      if (frame >= totalFrames) {
        mediaRecorder.stop();
        return;
      }

      // Clear with gradient background
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, colors[0]);
      gradient.addColorStop(1, colors[1]);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.fillStyle = p.color;
        ctx.globalAlpha = 0.6;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw text
      ctx.globalAlpha = 1;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.font = 'bold 32px Space Grotesk, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(prompt.substring(0, 40), canvas.width / 2, canvas.height / 2);

      frame++;
      requestAnimationFrame(animate);
    };

    mediaRecorder.start();
    animate();
  });
}
