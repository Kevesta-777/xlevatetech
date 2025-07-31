import { useEffect } from 'react';

const AIAnimationModule = () => {
  useEffect(() => {
    // Generate particles
    const particleContainer = document.getElementById('ai-particles');
    if (particleContainer) {
      particleContainer.innerHTML = '';
      const totalParticles = 180;
      const containerRect = particleContainer.getBoundingClientRect();
      
      for (let i = 0; i < totalParticles; i++) {
        const p = document.createElement('div');
        p.className = 'ai-particle';
        const size = Math.random() * 4 + 2;
        p.style.width = p.style.height = size + 'px';
        p.style.left = Math.random() * 100 + '%';
        p.style.top = Math.random() * 100 + '%';
        p.style.animationDelay = Math.random() * 3 + 's';
        p.style.animationDuration = 1.2 + Math.random() * 1.8 + 's';
        particleContainer.appendChild(p);
      }
    }
  }, []);

  return (
    <div className="ai-animation-module relative w-full h-full min-h-[500px]">
      <style dangerouslySetInnerHTML={{
        __html: `
          .ai-animation-module {
            font-family: 'Inter', system-ui, sans-serif;
            background: radial-gradient(ellipse at 60% 30%, #1e3a8a 60%, #111827 100%);
            color: #fff;
            overflow: hidden;
          }
          
          .ai-fade-in {
            opacity: 0;
            transform: translateY(32px) scale(0.98) blur(8px);
            animation: aiFadeIn 1.1s cubic-bezier(0.36, 0.66, 0.04, 1) forwards;
          }
          .ai-fade-in-1 { animation-delay: 0.4s; }
          .ai-fade-in-2 { animation-delay: 0.7s; }
          .ai-fade-in-3 { animation-delay: 1s; }
          
          @keyframes aiFadeIn {
            to {
              opacity: 1;
              transform: none;
              filter: blur(0);
            }
          }

          .ai-particle {
            position: absolute;
            width: 5px;
            height: 5px;
            border-radius: 50%;
            background: linear-gradient(90deg, #7c3aed 80%, #10b981 100%);
            opacity: 0.5;
            pointer-events: none;
            animation: aiParticleMove 1.5s linear infinite;
          }
          
          @keyframes aiParticleMove {
            0% { transform: scale(0.7) translateY(0); }
            80% { opacity: 1; }
            100% { transform: scale(1.4) translateY(-40px); opacity: 0; }
          }

          .ai-pulsing {
            animation: aiCorePulse 2.5s cubic-bezier(0.5, 0, 0.5, 1) infinite alternate;
          }
          
          @keyframes aiCorePulse {
            0% {
              filter: blur(3px);
              box-shadow: 0 0 80px 20px rgba(124, 58, 237, 0.2), 0 0 0 0 rgba(16, 185, 129, 0.2);
            }
            100% {
              filter: blur(0);
              box-shadow: 0 0 120px 40px rgba(30, 58, 138, 0.6), 0 0 64px 20px rgba(16, 185, 129, 0.27);
            }
          }

          .ai-ring-wave {
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            border-radius: 50%;
            pointer-events: none;
            border: 2px solid rgba(124, 58, 237, 0.47);
            opacity: 0;
            animation: aiRingWave 4.2s cubic-bezier(0.61, 0.01, 0.72, 1) infinite;
          }
          .ai-ring-wave-2 {
            border-color: rgba(16, 185, 129, 0.33);
            animation-delay: 1.3s;
            animation-duration: 3.6s;
          }
          .ai-ring-wave-3 {
            border-color: rgba(96, 165, 250, 0.27);
            animation-delay: 2.1s;
            animation-duration: 5.2s;
          }
          
          @keyframes aiRingWave {
            0% { width: 0; height: 0; opacity: 0.7; }
            30% { opacity: 0.8; }
            100% { width: 680px; height: 680px; opacity: 0; }
          }

          .ai-robotic-wave {
            position: absolute;
            left: 50%;
            top: 50%;
            z-index: 10;
            pointer-events: none;
            transform: translate(-50%, -50%);
            filter: blur(0.8px);
            opacity: 0.45;
          }
          .ai-robotic-wave path {
            stroke: url(#waveGrad);
            stroke-width: 2.7;
            fill: none;
            stroke-dasharray: 12 8 18 30;
            animation: aiWaveRobot 3.7s linear infinite alternate;
          }
          .ai-robotic-wave.wave2 {
            opacity: 0.28;
            filter: blur(1.6px);
          }
          .ai-robotic-wave.wave3 {
            opacity: 0.19;
            filter: blur(2.6px);
          }
          .ai-robotic-wave.wave2 path {
            animation-delay: 1.1s;
          }
          .ai-robotic-wave.wave3 path {
            animation-delay: 2.3s;
          }
          
          @keyframes aiWaveRobot {
            to { stroke-dashoffset: 180; }
          }

          .ai-bg-geometric {
            position: absolute;
            inset: 0;
            z-index: 0;
            pointer-events: none;
            opacity: 0.13;
          }

          .ai-metric {
            position: absolute;
            display: flex;
            align-items: center;
            gap: 6px;
            padding: 6px 14px;
            background: rgba(17, 24, 39, 0.6);
            border-radius: 9999px;
            border: 1px solid rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(6px);
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.25);
            font-size: 15px;
            font-weight: 500;
            white-space: nowrap;
            opacity: 0;
            transform: translateY(16px);
            animation: aiMetricIn 1s cubic-bezier(0.4, 0, 0.2, 1) forwards;
          }
          .ai-metric-1 {
            top: 50%;
            left: -200px;
            transform: translate(-50%, -50%) translateY(16px);
            animation-delay: 1.4s;
          }
          .ai-metric-2 {
            top: 14%;
            right: -220px;
            transform: translate(50%, -50%) translateY(16px);
            animation-delay: 1.7s;
          }
          .ai-metric-3 {
            bottom: -90px;
            left: 50%;
            transform: translate(-50%, 50%) translateY(16px);
            animation-delay: 2s;
          }
          
          @keyframes aiMetricIn {
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @media (max-width: 1024px) {
            .ai-core-wrap {
              width: 320px;
              height: 320px;
            }
            .ai-ring-wave, .ai-ring-wave-2, .ai-ring-wave-3 {
              width: 320px;
              height: 320px;
            }
            .ai-metric-1 {
              left: -140px;
              font-size: 13px;
            }
            .ai-metric-2 {
              right: -150px;
              font-size: 13px;
            }
            .ai-metric-3 {
              bottom: -70px;
              font-size: 13px;
            }
          }
        `
      }} />

      {/* SUBTLE GEOMETRY */}
      <div className="ai-bg-geometric">
        <svg viewBox="0 0 3840 2160" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g stroke="#334155" strokeWidth="1.2">
            <circle cx="1920" cy="1080" r="900"></circle>
            <circle cx="1920" cy="1080" r="1400"></circle>
            <polygon points="600,500 3240,500 1920,2020"></polygon>
            <polyline points="1920,0 1920,2160"></polyline>
            <polyline points="0,1080 3840,1080"></polyline>
          </g>
        </svg>
      </div>

      {/* PARTICLES */}
      <div id="ai-particles" className="absolute inset-0 z-10 pointer-events-none"></div>

      {/* AI CORE */}
      <div className="absolute left-1/2 top-1/2 z-30 ai-fade-in ai-fade-in-1" style={{ transform: 'translate(-50%, -50%)' }}>
        <div className="relative flex flex-col items-center justify-center select-none ai-core-wrap" style={{ width: '560px', height: '560px' }}>
          <div className="ai-ring-wave"></div>
          <div className="ai-ring-wave ai-ring-wave-2"></div>
          <div className="ai-ring-wave ai-ring-wave-3"></div>

          {/* ROBOTIC WAVES */}
          <svg className="ai-robotic-wave" width="760" height="760" viewBox="0 0 760 760">
            <defs>
              <linearGradient id="waveGrad" x1="0" y1="0" x2="1" y2="1">
                <stop stopColor="#10b981"></stop>
                <stop offset="0.6" stopColor="#7c3aed"></stop>
                <stop offset="1" stopColor="#60a5fa"></stop>
              </linearGradient>
            </defs>
            <path d="M380 110 C480 150, 620 220, 560 380 C500 540, 480 600, 380 650 C280 600, 260 540, 200 380 C140 220, 280 150, 380 110"></path>
          </svg>
          <svg className="ai-robotic-wave wave2" width="920" height="920" viewBox="0 0 920 920">
            <path d="M460 140 C630 190, 800 330, 700 500 C600 670, 630 740, 460 790 C290 740, 320 670, 220 500 C120 330, 290 190, 460 140"></path>
          </svg>
          <svg className="ai-robotic-wave wave3" width="1160" height="1160" viewBox="0 0 1160 1160">
            <path d="M580 200 C800 260, 1060 480, 900 700 C740 920, 800 1020, 580 1080 C360 1020, 420 920, 260 700 C100 480, 360 260, 580 200"></path>
          </svg>

          {/* METRIC BADGES */}
          <div className="ai-metric ai-metric-1">
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12,6 12,12 16,14"></polyline>
            </svg>
            <span>30+ hrs saved</span>
          </div>
          <div className="ai-metric ai-metric-2">
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <polyline points="22,12 18,12 15,21 9,3 6,12 2,12"></polyline>
            </svg>
            <span>80% efficiency</span>
          </div>
          <div className="ai-metric ai-metric-3">
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <polyline points="23,6 13.5,15.5 8.5,10.5 1,18"></polyline>
              <polyline points="17,6 23,6 23,12"></polyline>
            </svg>
            <span>150× ROI</span>
          </div>

          {/* NEURAL NETWORK CORE */}
          <svg className="ai-pulsing" width="520" height="520" viewBox="0 0 520 520">
            <defs>
              <radialGradient id="aiCoreGlow" cx="50%" cy="50%" r="65%">
                <stop offset="0%" stopColor="#7c3aed" stopOpacity="1"></stop>
                <stop offset="60%" stopColor="#1e3a8a" stopOpacity="0.7"></stop>
                <stop offset="100%" stopColor="#0e1433" stopOpacity="0"></stop>
              </radialGradient>
              <linearGradient id="aiCircuitA" x1="0" y1="0" x2="520" y2="520">
                <stop stopColor="#10b981"></stop>
                <stop offset="1" stopColor="#7c3aed"></stop>
              </linearGradient>
              <linearGradient id="aiCircuitB" x1="0" y1="0" x2="1" y2="1">
                <stop stopColor="#7c3aed"></stop>
                <stop offset="1" stopColor="#60a5fa"></stop>
              </linearGradient>
            </defs>

            <circle cx="260" cy="260" r="190" fill="url(#aiCoreGlow)"></circle>

            {/* CIRCUIT LINES */}
            <g stroke="url(#aiCircuitA)" strokeWidth="3" strokeLinecap="round">
              <path d="M260 40 Q280 130 430 120"></path>
              <path d="M260 40 Q240 140 90 120"></path>
              <path d="M430 120 Q490 230 440 370"></path>
              <path d="M90 120 Q40 240 100 370"></path>
              <path d="M440 370 Q350 450 260 470"></path>
              <path d="M100 370 Q170 450 260 470"></path>
              <path d="M260 40 V260"></path>
              <path d="M260 470 V260"></path>
              <path d="M140 80 Q200 220 260 260"></path>
              <path d="M380 80 Q320 220 260 260"></path>
              <path d="M60 260 H260"></path>
              <path d="M460 260 H260"></path>
              <path d="M180 420 Q210 320 260 260"></path>
              <path d="M340 420 Q310 320 260 260"></path>
              <path d="M260 10 V90" stroke="url(#aiCircuitB)" strokeWidth="2.2"></path>
              <path d="M510 260 H430" stroke="url(#aiCircuitB)" strokeWidth="2.2"></path>
              <path d="M260 510 V430" stroke="url(#aiCircuitB)" strokeWidth="2.2"></path>
              <path d="M10 260 H90" stroke="url(#aiCircuitB)" strokeWidth="2.2"></path>
            </g>

            {/* NODES */}
            <g>
              <circle cx="260" cy="40" r="10" fill="#fff" opacity="0.18"></circle>
              <circle cx="430" cy="120" r="9" fill="#10b981" opacity="0.21"></circle>
              <circle cx="90" cy="120" r="9" fill="#7c3aed" opacity="0.23"></circle>
              <circle cx="440" cy="370" r="9" fill="#10b981" opacity="0.2"></circle>
              <circle cx="100" cy="370" r="8" fill="#7c3aed" opacity="0.2"></circle>
              <circle cx="260" cy="470" r="11" fill="#fff" opacity="0.18"></circle>
              <circle cx="140" cy="80" r="7" fill="#10b981" opacity="0.24"></circle>
              <circle cx="380" cy="80" r="7" fill="#60a5fa" opacity="0.24"></circle>
              <circle cx="60" cy="260" r="7" fill="#10b981" opacity="0.24"></circle>
              <circle cx="460" cy="260" r="7" fill="#60a5fa" opacity="0.24"></circle>
              <circle cx="180" cy="420" r="7" fill="#10b981" opacity="0.24"></circle>
              <circle cx="340" cy="420" r="7" fill="#60a5fa" opacity="0.24"></circle>
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default AIAnimationModule;