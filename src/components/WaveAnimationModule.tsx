import { useEffect, useRef } from 'react';

// Global types for external libraries
declare global {
  interface Window {
    Chart: any;
    lucide: any;
  }
}

const WaveAnimationModule = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const shaderCanvasRef = useRef<HTMLCanvasElement>(null);
  const gaugeChartRef = useRef<HTMLCanvasElement>(null);
  const lightningCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Load Chart.js and Lucide icons
    const loadExternalScripts = async () => {
      // Load Chart.js if not already loaded
      if (!window.Chart) {
        const chartScript = document.createElement('script');
        chartScript.src = 'https://cdn.jsdelivr.net/npm/chart.js';
        chartScript.onload = initializeCharts;
        document.head.appendChild(chartScript);
      } else {
        initializeCharts();
      }

      // Load Lucide icons if not already loaded
      if (!window.lucide) {
        const lucideScript = document.createElement('script');
        lucideScript.src = 'https://unpkg.com/lucide@latest';
        lucideScript.onload = () => {
          if (window.lucide) {
            window.lucide.createIcons({ strokeWidth: 1.5 });
          }
        };
        document.head.appendChild(lucideScript);
      } else {
        window.lucide.createIcons({ strokeWidth: 1.5 });
      }
    };

    const initializeWaveAnimation = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      let w: number, h: number, dpr: number;

      function resize() {
        dpr = window.devicePixelRatio || 1;
        w = canvas.clientWidth;
        h = canvas.clientHeight;
        canvas.width = w * dpr * 2; // Enhanced 4K resolution
        canvas.height = h * dpr * 2;
        ctx.scale(dpr * 2, dpr * 2);
      }

      window.addEventListener('resize', resize);
      resize();

      // Enhanced layers with smoother wave connections
      const layers = [
        { amp: 60, len: 1.5, speed: 0.8, color: 'rgba(0,212,255,0.8)', phase: 0 }, // Cyan
        { amp: 45, len: 1.2, speed: -0.6, color: 'rgba(142,95,246,0.6)', phase: 0.5 }, // Purple
        { amp: 30, len: 2, speed: 1.2, color: 'rgba(78,205,196,0.7)', phase: 1.0 }, // Teal
        { amp: 50, len: 1.8, speed: -0.4, color: 'rgba(34,197,94,0.5)', phase: 1.5 }, // Green
        { amp: 35, len: 1.4, speed: 0.9, color: 'rgba(59,130,246,0.6)', phase: 2.0 }, // Blue
        { amp: 40, len: 2.2, speed: -0.7, color: 'rgba(168,85,247,0.4)', phase: 2.5 }, // Violet
        { amp: 25, len: 1.6, speed: 1.5, color: 'rgba(16,185,129,0.5)', phase: 3.0 } // Emerald
      ];

      const particles: Array<{ x: number; layer: number; life: number; ttl: number; offset: number }> = [];
      const maxParticles = 300; // Increased for 4K

      function spawnParticle(layer: number, t: number) {
        particles.push({ x: 0, layer, life: 0, ttl: 200 + Math.random() * 100, offset: t });
        if (particles.length > maxParticles) particles.shift();
      }

      let t = 0;
      function animate() {
        ctx.clearRect(0, 0, w, h);
        ctx.lineWidth = 3; // Increased for 4K
        
        layers.forEach((layer, idx) => {
          ctx.beginPath();
          const smoothness = 1; // Higher precision for 4K
          for (let x = 0; x <= w; x += smoothness) {
            const y = h / 2 + Math.sin((x / w) * Math.PI * layer.len + t * layer.speed + layer.phase) * layer.amp * Math.sin(t * 0.15);
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
            if (x % 60 === 0 && Math.random() < 0.004) spawnParticle(idx, t);
          }
          ctx.strokeStyle = layer.color;
          ctx.stroke();
        });

        particles.forEach(p => {
          const layer = layers[p.layer];
          const progress = p.life / p.ttl;
          const x = progress * w;
          const y = h / 2 + Math.sin((x / w) * Math.PI * layer.len + p.offset * layer.speed + layer.phase) * layer.amp * Math.sin(p.offset * 0.15);
          ctx.fillStyle = "#ffffff" + Math.floor((1 - progress) * 255).toString(16).padStart(2, '0');
          ctx.beginPath();
          ctx.arc(x, y, 3, 0, Math.PI * 2); // Larger particles for 4K
          ctx.fill();
          p.life++;
        });

        for (let i = particles.length - 1; i >= 0; i--) {
          if (particles[i].life > particles[i].ttl) particles.splice(i, 1);
        }

        t += 0.008;
        requestAnimationFrame(animate);
      }
      animate();

      return () => {
        window.removeEventListener('resize', resize);
      };
    };

    const initializeShaderWaves = () => {
      const canvas = shaderCanvasRef.current;
      if (!canvas) return;

      const gl = canvas.getContext('webgl');
      if (!gl) {
        console.warn('WebGL not supported, falling back to Canvas 2D');
        return;
      }

      // Vertex shader
      const vsSource = `
        attribute vec4 aVertexPosition;
        void main() {
          gl_Position = aVertexPosition;
        }
      `;

      // Enhanced fragment shader with better wave connections
      const fsSource = `
        precision highp float;
        uniform vec2 iResolution;
        uniform float iTime;
        
        const float overallSpeed = 0.15;
        const vec4 lineColor1 = vec4(0.4, 0.2, 0.8, 0.5); // Purple
        const vec4 lineColor2 = vec4(0.2, 0.6, 0.9, 0.4); // Blue
        const vec4 lineColor3 = vec4(0.1, 0.8, 0.4, 0.3); // Green
        const float minLineWidth = 0.008;
        const float maxLineWidth = 0.12;
        const float lineSpeed = 0.8 * overallSpeed;
        const float lineAmplitude = 0.9;
        const float lineFrequency = 0.25;
        const int linesPerGroup = 10;
        
        #define drawSmoothLine(pos, halfWidth, t) smoothstep(halfWidth, 0.0, abs(pos - (t)))
        
        float random(float t) {
          return (cos(t) + cos(t * 1.2 + 1.2) + cos(t * 1.35 + 1.35)) / 3.0;
        }
        
        float getPlasmaY(float x, float horizontalFade, float offset, float freq, float phase) {
          return random(x * freq + iTime * lineSpeed + phase) * horizontalFade * lineAmplitude + offset;
        }
        
        void main() {
          vec2 fragCoord = gl_FragCoord.xy;
          vec2 uv = fragCoord.xy / iResolution.xy;
          vec2 space = (fragCoord - iResolution.xy / 2.0) / iResolution.x * 2.0 * 3.0;
          
          float horizontalFade = 1.0 - (cos(uv.x * 6.28) * 0.5 + 0.5);
          float verticalFade = 1.0 - (cos(uv.y * 6.28) * 0.5 + 0.5);
          
          vec4 lines = vec4(0.0);
          vec4 bgColor = vec4(0.03, 0.03, 0.15, 0.7);
          
          // Purple waves with phase offset
          for(int l = 0; l < linesPerGroup; l++) {
            float rand = random(float(l) + iTime * 0.4) * 0.5 + 0.5;
            float halfWidth = mix(minLineWidth, maxLineWidth, rand * horizontalFade) / 2.0;
            float offset = random(float(l) + iTime * 0.25) * 1.2;
            float linePosition = getPlasmaY(space.x, horizontalFade, offset, lineFrequency, 0.0);
            float line = drawSmoothLine(linePosition, halfWidth, space.y);
            lines += line * lineColor1 * rand;
          }
          
          // Blue waves with phase offset
          for(int l = 0; l < linesPerGroup; l++) {
            float rand = random(float(l) + iTime * 0.5 + 10.0) * 0.5 + 0.5;
            float halfWidth = mix(minLineWidth, maxLineWidth, rand * horizontalFade) / 2.0;
            float offset = random(float(l) + iTime * 0.3 + 10.0) * 1.0;
            float linePosition = getPlasmaY(space.x, horizontalFade, offset, lineFrequency * 1.1, 1.57);
            float line = drawSmoothLine(linePosition, halfWidth, space.y);
            lines += line * lineColor2 * rand;
          }
          
          // Green waves with phase offset
          for(int l = 0; l < linesPerGroup; l++) {
            float rand = random(float(l) + iTime * 0.45 + 20.0) * 0.5 + 0.5;
            float halfWidth = mix(minLineWidth, maxLineWidth, rand * horizontalFade) / 2.0;
            float offset = random(float(l) + iTime * 0.35 + 20.0) * 0.8;
            float linePosition = getPlasmaY(space.x, horizontalFade, offset, lineFrequency * 0.9, 3.14);
            float line = drawSmoothLine(linePosition, halfWidth, space.y);
            lines += line * lineColor3 * rand;
          }
          
          gl_FragColor = bgColor * verticalFade + lines;
        }
      `;

      function loadShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null {
        const shader = gl.createShader(type);
        if (!shader) return null;
        
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
          gl.deleteShader(shader);
          return null;
        }
        return shader;
      }

      function initShaderProgram(gl: WebGLRenderingContext, vsSource: string, fsSource: string): WebGLProgram | null {
        const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
        const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);
        
        if (!vertexShader || !fragmentShader) return null;
        
        const shaderProgram = gl.createProgram();
        if (!shaderProgram) return null;
        
        gl.attachShader(shaderProgram, vertexShader);
        gl.attachShader(shaderProgram, fragmentShader);
        gl.linkProgram(shaderProgram);
        
        if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
          return null;
        }
        return shaderProgram;
      }

      const shaderProgram = initShaderProgram(gl, vsSource, fsSource);
      if (!shaderProgram) return;

      const positionBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      const positions = [-1.0, -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, 1.0];
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

      const programInfo = {
        program: shaderProgram,
        attribLocations: {
          vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
        },
        uniformLocations: {
          resolution: gl.getUniformLocation(shaderProgram, 'iResolution'),
          time: gl.getUniformLocation(shaderProgram, 'iTime'),
        },
      };

      function resizeShaderCanvas() {
        canvas.width = canvas.clientWidth * 2; // Enhanced 4K resolution
        canvas.height = canvas.clientHeight * 2;
        gl.viewport(0, 0, canvas.width, canvas.height);
      }

      window.addEventListener('resize', resizeShaderCanvas);
      resizeShaderCanvas();

      const startTime = Date.now();
      function render() {
        const currentTime = (Date.now() - startTime) / 1000;

        gl.clearColor(0.0, 0.0, 0.0, 0.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.useProgram(programInfo.program);

        gl.uniform2f(programInfo.uniformLocations.resolution, canvas.width, canvas.height);
        gl.uniform1f(programInfo.uniformLocations.time, currentTime);

        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.vertexAttribPointer(programInfo.attribLocations.vertexPosition, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);

        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        requestAnimationFrame(render);
      }

      requestAnimationFrame(render);

      return () => {
        window.removeEventListener('resize', resizeShaderCanvas);
      };
    };

    const initializeLightningAnimation = () => {
      const canvas = lightningCanvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      let w: number, h: number, dpr: number;
      let isLightningActive = false;
      let lightningIntensity = 1; // 1 = single bolt, 2 = scattered (5 bolts), 3 = storm (50+ bolts)

      function resize() {
        dpr = window.devicePixelRatio || 1;
        w = canvas.clientWidth;
        h = canvas.clientHeight;
        canvas.width = w * dpr * 2; // 4K resolution
        canvas.height = h * dpr * 2;
        ctx.scale(dpr * 2, dpr * 2);
      }

      window.addEventListener('resize', resize);
      resize();

      const lightningBolts: Array<{
        x: number;
        y: number;
        branches: Array<{ x: number; y: number; }>;
        life: number;
        maxLife: number;
        opacity: number;
      }> = [];

      function createLightningBolt(startX: number, startY: number) {
        const branches = [];
        let currentX = startX;
        let currentY = startY;
        
        // Create branching lightning pattern
        for (let i = 0; i < 15 + Math.random() * 10; i++) {
          currentX += (Math.random() - 0.5) * 60;
          currentY += Math.random() * 40 - 20;
          branches.push({ x: currentX, y: currentY });
          
          // Random branching
          if (Math.random() < 0.3) {
            const branchX = currentX + (Math.random() - 0.5) * 80;
            const branchY = currentY + (Math.random() - 0.5) * 80;
            branches.push({ x: branchX, y: branchY });
          }
        }

        return {
          x: startX,
          y: startY,
          branches,
          life: 0,
          maxLife: 30 + Math.random() * 20,
          opacity: 1
        };
      }

      function triggerLightningByIntensity(intensity: number) {
        isLightningActive = true;
        lightningIntensity = intensity;
        
        let boltCount = 1;
        let positions: Array<{ x: number; y: number }> = [];
        
        if (intensity === 1) {
          // Stage 1: Single lightning bolt (60%)
          boltCount = 1;
          positions = [{ x: w * 0.5, y: h * 0.3 }];
        } else if (intensity === 2) {
          // Stage 2: Scattered lightning (75%) - 5 bolts
          boltCount = 5;
          positions = [
            { x: w * 0.2, y: h * 0.2 },
            { x: w * 0.8, y: h * 0.4 },
            { x: w * 0.4, y: h * 0.7 },
            { x: w * 0.7, y: h * 0.1 },
            { x: w * 0.1, y: h * 0.8 }
          ];
        } else if (intensity === 3) {
          // Stage 3: Lightning storm (90%) - 50+ bolts
          boltCount = 50;
          positions = [];
          for (let i = 0; i < boltCount; i++) {
            positions.push({
              x: Math.random() * w,
              y: Math.random() * h
            });
          }
        }

        positions.forEach((pos, index) => {
          setTimeout(() => {
            lightningBolts.push(createLightningBolt(pos.x, pos.y));
          }, index * (intensity === 3 ? 50 : 200)); // Faster spawn for storm
        });

        // Stop after duration based on intensity
        const duration = intensity === 1 ? 1000 : intensity === 2 ? 1500 : 3000;
        setTimeout(() => {
          isLightningActive = false;
          lightningBolts.length = 0;
        }, duration);
      }

      function animate() {
        ctx.clearRect(0, 0, w, h);

        if (isLightningActive) {
          // Update and draw lightning bolts
          for (let i = lightningBolts.length - 1; i >= 0; i--) {
            const bolt = lightningBolts[i];
            bolt.life++;
            bolt.opacity = Math.max(0, 1 - (bolt.life / bolt.maxLife));

            if (bolt.life > bolt.maxLife) {
              lightningBolts.splice(i, 1);
              continue;
            }

            // Draw lightning bolt with glow effect
            ctx.strokeStyle = `rgba(255, 255, 100, ${bolt.opacity})`;
            ctx.lineWidth = lightningIntensity === 3 ? 2 : 4; // Thinner lines for storm
            ctx.shadowColor = 'rgba(255, 255, 100, 0.8)';
            ctx.shadowBlur = 15;

            ctx.beginPath();
            ctx.moveTo(bolt.x, bolt.y);
            
            bolt.branches.forEach((branch, index) => {
              if (index < (bolt.life / bolt.maxLife) * bolt.branches.length) {
                ctx.lineTo(branch.x, branch.y);
              }
            });
            
            ctx.stroke();

            // Add electric particles (more for storm)
            const particleChance = lightningIntensity === 3 ? 0.6 : 0.3;
            bolt.branches.forEach((branch, index) => {
              if (index < (bolt.life / bolt.maxLife) * bolt.branches.length && Math.random() < particleChance) {
                ctx.fillStyle = `rgba(255, 255, 200, ${bolt.opacity * 0.8})`;
                ctx.beginPath();
                ctx.arc(
                  branch.x + (Math.random() - 0.5) * 20,
                  branch.y + (Math.random() - 0.5) * 20,
                  lightningIntensity === 3 ? 1 + Math.random() * 2 : 2 + Math.random() * 3,
                  0,
                  Math.PI * 2
                );
                ctx.fill();
              }
            });

            ctx.shadowBlur = 0;
          }

          // Add screen flash effect (stronger for storm)
          if (lightningBolts.length > 0) {
            const flashIntensity = Math.max(...lightningBolts.map(b => b.opacity)) * (lightningIntensity === 3 ? 0.2 : 0.1);
            ctx.fillStyle = `rgba(255, 255, 255, ${flashIntensity})`;
            ctx.fillRect(0, 0, w, h);
          }
        }

        requestAnimationFrame(animate);
      }

      animate();

      // Expose enhanced trigger function globally
      (window as any).triggerLightningByIntensity = triggerLightningByIntensity;

      return () => {
        window.removeEventListener('resize', resize);
      };
    };

    const initializeMetrics = () => {
      const cards = document.querySelectorAll('#metricsLayer > div');
      let revealDelay = 0;
      
      cards.forEach(card => {
        setTimeout(() => {
          card.classList.remove('opacity-0', 'translate-y-4', 'blur-sm');
        }, revealDelay += 2200);
      });

      function counter(el: HTMLElement, target: number, duration = 1600) {
        const start = 0;
        const range = target - start;
        let startTime: number | null = null;
        
        function step(timestamp: number) {
          if (!startTime) startTime = timestamp;
          const progress = Math.min((timestamp - startTime) / duration, 1);
          el.textContent = Math.floor(progress * range + start).toString();
          if (progress < 1) window.requestAnimationFrame(step);
        }
        window.requestAnimationFrame(step);
      }

      cards.forEach((card, i) => {
        const numEl = card.querySelector('.num') as HTMLElement;
        if (numEl) {
          const target = parseInt(numEl.dataset.target || '0', 10);
          setTimeout(() => counter(numEl, target), (i + 1) * 2200 + 300);
        }
      });
    };

    const initializeCharts = () => {
      if (!window.Chart) return;

      // Enhanced Circular Gauge Chart with progressive lightning triggers
      const gaugeCtx = gaugeChartRef.current?.getContext('2d');
      if (gaugeCtx) {
        const gaugeChart = new window.Chart(gaugeCtx, {
          type: 'doughnut',
          data: {
            datasets: [{
              data: [0, 100],
              backgroundColor: ['#3b82f6', 'rgba(30, 41, 59, 0.3)'], // Start with blue
              borderWidth: 0,
              borderRadius: 5
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: true,
            rotation: -90,
            circumference: 180,
            cutout: '75%',
            plugins: { 
              tooltip: { enabled: false }, 
              legend: { display: false }
            }
          }
        });

        // Progressive animation with lightning triggers
        let gaugeProgress = 0;
        const gaugeTarget = 90;
        let hasTriggered60 = false;
        let hasTriggered75 = false;
        let hasTriggered90 = false;

        function animateGauge() {
          if (gaugeProgress <= gaugeTarget) {
            gaugeChart.data.datasets[0].data[0] = gaugeProgress;
            gaugeChart.data.datasets[0].data[1] = 100 - gaugeProgress;
            
            // Change color based on progress
            if (gaugeProgress >= 75) {
              gaugeChart.data.datasets[0].backgroundColor[0] = '#ef4444'; // Red for danger/high energy
            } else if (gaugeProgress >= 60) {
              gaugeChart.data.datasets[0].backgroundColor[0] = '#eab308'; // Yellow for warning
            }
            
            gaugeChart.update('none');
            
            // Progressive lightning triggers
            if (gaugeProgress >= 60 && !hasTriggered60) {
              hasTriggered60 = true;
              setTimeout(() => {
                if ((window as any).triggerLightningByIntensity) {
                  (window as any).triggerLightningByIntensity(1); // Single bolt
                }
              }, 100);
            }
            
            if (gaugeProgress >= 75 && !hasTriggered75) {
              hasTriggered75 = true;
              setTimeout(() => {
                if ((window as any).triggerLightningByIntensity) {
                  (window as any).triggerLightningByIntensity(2); // Scattered bolts
                }
              }, 100);
            }
            
            if (gaugeProgress >= 90 && !hasTriggered90) {
              hasTriggered90 = true;
              setTimeout(() => {
                if ((window as any).triggerLightningByIntensity) {
                  (window as any).triggerLightningByIntensity(3); // Lightning storm
                }
              }, 100);
            }
            
            gaugeProgress++;
            requestAnimationFrame(animateGauge);
          }
        }
        setTimeout(animateGauge, 1800);
      }
    };

    loadExternalScripts();
    const cleanupWave = initializeWaveAnimation();
    const cleanupShader = initializeShaderWaves();
    const cleanupLightning = initializeLightningAnimation();
    initializeMetrics();

    return () => {
      cleanupWave && cleanupWave();
      cleanupShader && cleanupShader();
      cleanupLightning && cleanupLightning();
    };
  }, []);

  return (
    <section className="relative w-full max-w-6xl aspect-[16/9] h-[400px] lg:h-[550px] overflow-hidden rounded-2xl shadow-2xl ring-1 ring-white/10">
      {/* WebGL Shader Canvas for Advanced Waves */}
      <canvas ref={shaderCanvasRef} className="absolute inset-0 w-full h-full opacity-70" />
      
      {/* Canvas for Traditional Waves */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full mix-blend-screen opacity-90" />

      {/* Lightning Animation Canvas */}
      <canvas ref={lightningCanvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-30" />

      {/* Subtle Grid Overlay */}
      <div 
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />

      {/* Metrics Layer */}
      <div id="metricsLayer" className="absolute inset-0 flex flex-col justify-center p-6 lg:p-12 space-y-4 pointer-events-none">
        <div className="opacity-0 translate-y-4 blur-sm transition-all duration-700 flex items-center gap-3 self-start backdrop-blur-md bg-white/5 border border-white/10 rounded-lg px-4 py-3">
          <i data-lucide="trending-up" className="w-5 h-5 stroke-cyan-400 flex-shrink-0"></i>
          <p className="text-lg font-semibold tracking-tight whitespace-nowrap">
            <span className="num" data-target="80">0</span>% Efficiency
          </p>
        </div>

        <div className="opacity-0 translate-y-4 blur-sm transition-all duration-700 flex items-center gap-3 self-center backdrop-blur-md bg-white/5 border border-white/10 rounded-lg px-4 py-3">
          <i data-lucide="activity" className="w-5 h-5 stroke-purple-400 flex-shrink-0"></i>
          <p className="text-lg font-semibold tracking-tight whitespace-nowrap">
            <span className="num" data-target="150">0</span>% ROI
          </p>
        </div>

        <div className="opacity-0 translate-y-4 blur-sm transition-all duration-700 flex items-center gap-3 self-end backdrop-blur-md bg-white/5 border border-white/10 rounded-lg px-4 py-3">
          <i data-lucide="clock" className="w-5 h-5 stroke-blue-400 flex-shrink-0"></i>
          <p className="text-lg font-semibold tracking-tight whitespace-nowrap">
            <span className="num" data-target="20">0</span>+ Hours Saved
          </p>
        </div>
      </div>

      {/* AI Analytics Panel - Simplified without line chart */}
      <aside className="hidden md:flex flex-col justify-between absolute top-0 right-0 h-full w-72 p-6 backdrop-blur-md bg-white/5 border-l border-white/10 pointer-events-none">
        {/* Industry Icons with enhanced alignment and no text wrapping */}
        <div className="flex justify-center gap-4 pt-4">
          <div className="flex flex-col items-center gap-2 p-3 border border-white/20 rounded-lg backdrop-blur-sm">
            <i data-lucide="building-2" className="w-6 h-6 stroke-blue-400 flex-shrink-0"></i>
            <span className="text-xs text-blue-300 text-center whitespace-nowrap leading-tight">Real Estate</span>
          </div>
          <div className="flex flex-col items-center gap-2 p-3 border border-white/20 rounded-lg backdrop-blur-sm">
            <i data-lucide="heart-pulse" className="w-6 h-6 stroke-green-400 flex-shrink-0"></i>
            <span className="text-xs text-green-300 text-center whitespace-nowrap leading-tight">Healthcare</span>
          </div>
          <div className="flex flex-col items-center gap-2 p-3 border border-white/20 rounded-lg backdrop-blur-sm">
            <i data-lucide="trending-up" className="w-6 h-6 stroke-purple-400 flex-shrink-0"></i>
            <span className="text-xs text-purple-300 text-center whitespace-nowrap leading-tight">Finance</span>
          </div>
        </div>

        {/* Spacer */}
        <div className="flex-1"></div>

        {/* Smaller Automation Level Gauge */}
        <div className="absolute bottom-4 right-4 flex flex-col items-center gap-2 backdrop-blur-md bg-white/5 border border-white/10 rounded-lg p-3">
          <div className="relative w-16 h-16">
            <canvas ref={gaugeChartRef} className="w-full h-full"></canvas>
            {/* Center text overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-bold text-white">90%</span>
            </div>
          </div>
          <span className="text-xs text-white/80 text-center whitespace-nowrap">Automation Level</span>
        </div>
      </aside>
    </section>
  );
};

export default WaveAnimationModule;
