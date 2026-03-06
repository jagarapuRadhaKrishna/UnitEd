import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from 'next-themes';

const BlankPage: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const [currentTime, setCurrentTime] = useState(0);
  const navigate = useNavigate();
  const { theme, resolvedTheme } = useTheme();
  const [webGLError, setWebGLError] = useState(false);

  const isDark = useMemo(() => {
    const mode = theme === 'system' ? resolvedTheme : theme;
    return mode === 'dark';
  }, [theme, resolvedTheme]);

  const colors = useMemo(
    () => ({
      bg: isDark ? '#0b1220' : '#ffffff',
      card: isDark ? '#0f172a' : '#ffffff',
      border: isDark ? '#1f2937' : '#E5E7EB',
      heading: isDark ? '#e5e7eb' : '#111827',
      subtext: isDark ? '#9ca3af' : '#6B7280',
      chip: isDark ? '#111827' : '#F3F4F6',
      accent: '#6C47FF',
    }),
    [isDark]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      console.error('Canvas ref is null');
      return;
    }

    // Set initial canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    if (!gl) {
      console.error('WebGL not supported');
      setWebGLError(true);
      return;
    }

    console.log('WebGL initialized successfully');

    // Vertex shader
    const vertexShaderSource = `
      attribute vec2 position;
      void main() {
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

    // Fragment shader - converted from Shadertoy
    const fragmentShaderSource = `
      precision highp float;
      uniform vec3 iResolution;
      uniform float iTime;
      uniform sampler2D iChannel0;
      uniform sampler2D iChannel1;

      #define PI 3.1415926535898
      #define FH 1.0

      float getGrey(vec3 p){ return p.x*0.299 + p.y*0.587 + p.z*0.114; }

      vec3 hash33(vec3 p){ 
        float n = sin(dot(p, vec3(7, 157, 113)));    
        return fract(vec3(2097152, 262144, 32768)*n); 
      }

      mat2 rot2(float a){
        float c = cos(a); float s = sin(a);
        return mat2(c, s, -s, c);
      }

      vec3 tex3D( sampler2D tex, in vec3 p, in vec3 n ){
        n = max((abs(n) - 0.2)*7., 0.001);
        n /= (n.x + n.y + n.z);  
        return (texture2D(tex, p.yz)*n.x + texture2D(tex, p.zx)*n.y + texture2D(tex, p.xy)*n.z).xyz;
      }

      vec3 tri(in vec3 x){return abs(x-floor(x)-.5);}

      float surfFunc(in vec3 p){
        return dot(tri(p*0.5 + tri(p*0.25).yzx), vec3(0.666));
      }

      vec2 path(in float z){ float s = sin(z/24.)*cos(z/12.); return vec2(s*12., 0.); }

      float map(vec3 p){
        float sf = surfFunc(p - vec3(0, cos(p.z/3.)*.15, 0));
        vec2 tun = abs(p.xy - path(p.z))*vec2(0.5, 0.7071);
        float n = 1. - max(tun.x, tun.y) + (0.5 - sf);
        return min(n, p.y + FH);
      }

      vec3 doBumpMap( sampler2D tex, in vec3 p, in vec3 nor, float bumpfactor){
        const float eps = 0.001;
        float ref = getGrey(tex3D(tex,  p , nor));                 
        vec3 grad = vec3( getGrey(tex3D(tex, vec3(p.x - eps, p.y, p.z), nor)) - ref,
                          getGrey(tex3D(tex, vec3(p.x, p.y - eps, p.z), nor)) - ref,
                          getGrey(tex3D(tex, vec3(p.x, p.y, p.z - eps), nor)) - ref )/eps;
        grad -= nor*dot(nor, grad);          
        return normalize( nor + grad*bumpfactor );
      }

      vec3 getNormal(in vec3 p) {
        const float eps = 0.001;
        return normalize(vec3(
          map(vec3(p.x + eps, p.y, p.z)) - map(vec3(p.x - eps, p.y, p.z)),
          map(vec3(p.x, p.y + eps, p.z)) - map(vec3(p.x, p.y - eps, p.z)),
          map(vec3(p.x, p.y, p.z + eps)) - map(vec3(p.x, p.y, p.z - eps))
        ));
      }

      float calculateAO(vec3 p, vec3 n){
        const float AO_SAMPLES = 5.0;
        float r = 0.0, w = 1.0, d;
        for (float i = 1.0; i<AO_SAMPLES + 1.1; i++){
          d = i/AO_SAMPLES;
          r += w*(d - map(p + n*d));
          w *= 0.5;
        }
        return 1.0 - clamp(r, 0.0, 1.0);
      }

      float curve(in vec3 p, in float w){
        vec2 e = vec2(-1., 1.)*w;
        float t1 = map(p + e.yxx), t2 = map(p + e.xxy);
        float t3 = map(p + e.xyx), t4 = map(p + e.yyy);
        return 0.125/(w*w) *(t1 + t2 + t3 + t4 - 4.*map(p));
      }

      void mainImage( out vec4 fragColor, in vec2 fragCoord ){
        vec2 uv = (fragCoord - iResolution.xy*0.5)/iResolution.y;
        vec3 camPos = vec3(0.0, 0.0, iTime*1.5);
        vec3 lookAt = camPos + vec3(0.0, 0.1, 0.5);
        vec3 light_pos = camPos + vec3(0.0, 0.125, -0.125);
        vec3 light_pos2 = camPos + vec3(0.0, 0.0, 6.0);

        lookAt.xy += path(lookAt.z);
        camPos.xy += path(camPos.z);
        light_pos.xy += path(light_pos.z);
        light_pos2.xy += path(light_pos2.z);

        float FOV = PI/3.;
        vec3 forward = normalize(lookAt-camPos);
        vec3 right = normalize(vec3(forward.z, 0., -forward.x )); 
        vec3 up = cross(forward, right);

        vec3 rd = normalize(forward + FOV*uv.x*right + FOV*uv.y*up);
        rd.xy = rot2( path(lookAt.z).x/32. )*rd.xy;

        float t = 0.0, dt;
        for(int i=0; i<128; i++){
          dt = map(camPos + rd*t);
          if(dt<0.005 || t>150.){ break; } 
          t += dt*0.75;
        }

        vec3 sceneCol = vec3(0.);

        if(dt<0.005){
          vec3 sp = t * rd+camPos;
          vec3 sn = getNormal(sp);
          
          const float tSize0 = 1./1.; 
          const float tSize1 = 1./4.;

          if (sp.y<-(FH-0.005)) sn = doBumpMap(iChannel1, sp*tSize1, sn, 0.025);
          else sn = doBumpMap(iChannel0, sp*tSize0, sn, 0.025);

          float ao = calculateAO(sp, sn);

          vec3 ld = light_pos-sp;
          vec3 ld2 = light_pos2-sp;

          float distlpsp = max(length(ld), 0.001);
          float distlpsp2 = max(length(ld2), 0.001);

          ld /= distlpsp;
          ld2 /= distlpsp2;

          float atten = min(1./(distlpsp) + 1./(distlpsp2), 1.);
          float ambience = 0.25;
          float diff = max( dot(sn, ld), 0.0);
          float diff2 = max( dot(sn, ld2), 0.0);
          float spec = pow(max( dot( reflect(-ld, sn), -rd ), 0.0 ), 8.);
          float spec2 = pow(max( dot( reflect(-ld2, sn), -rd ), 0.0 ), 8.);
          float crv = clamp(curve(sp, 0.125)*0.5 + 0.5, .0, 1.);
          float fre = pow( clamp(dot(sn, rd) + 1., .0, 1.), 1.);
          
          vec3 texCol;
          if (sp.y<-(FH - 0.005)) texCol = tex3D(iChannel1, sp*tSize1, sn);
          else texCol = tex3D(iChannel0, sp*tSize0, sn);

          float shading =  crv*0.5 + 0.5; 

          sceneCol = getGrey(texCol)*((diff + diff2)*0.75 + ambience*0.25) + 
                     (spec + spec2)*texCol*2. + fre*crv*texCol.zyx*2.;

          sceneCol *= atten*shading*ao;
          sceneCol *= clamp(1.-abs(curve(sp, 0.0125)), .0, 1.);        
        }

        fragColor = vec4(clamp(sceneCol, 0., 1.), 1.0);
      }

      void main() {
        mainImage(gl_FragColor, gl_FragCoord.xy);
      }
    `;

    // Create and compile shaders
    function createShader(gl: WebGLRenderingContext, type: number, source: string) {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader compile error:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    }

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

    if (!vertexShader || !fragmentShader) {
      console.error('Failed to create shaders');
      setWebGLError(true);
      return;
    }

    // Create program
    const program = gl.createProgram();
    if (!program) {
      setWebGLError(true);
      return;
    }
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program link error:', gl.getProgramInfoLog(program));
      setWebGLError(true);
      return;
    }

    // Setup geometry
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    const positions = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    // Get uniform locations
    const iResolutionLocation = gl.getUniformLocation(program, 'iResolution');
    const iTimeLocation = gl.getUniformLocation(program, 'iTime');

    // Create procedural textures
    function createWallTexture(gl: WebGLRenderingContext, size: number): WebGLTexture | null {
      const texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);
      
      const data = new Uint8Array(size * size * 4);
      for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
          const i = (y * size + x) * 4;
          
          // Create horizontal lines with variation for wood grain effect
          const linePattern = Math.sin(y * 0.5) * 0.5 + 0.5;
          const noise = Math.random() * 0.3;
          const grainNoise = Math.sin(x * 0.1) * Math.sin(y * 0.3) * 0.2;
          
          const baseValue = (linePattern * 0.6 + noise + grainNoise) * 255;
          const value = Math.max(0, Math.min(255, baseValue));
          
          data[i] = value * 0.8;     // R - slightly brownish
          data[i + 1] = value * 0.75; // G
          data[i + 2] = value * 0.65; // B
          data[i + 3] = 255;
        }
      }
      
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, size, size, 0, gl.RGBA, gl.UNSIGNED_BYTE, data);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
      gl.generateMipmap(gl.TEXTURE_2D);
      
      return texture;
    }

    function createFloorTexture(gl: WebGLRenderingContext, size: number): WebGLTexture | null {
      const texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);
      
      const data = new Uint8Array(size * size * 4);
      for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
          const i = (y * size + x) * 4;
          
          // Create brick-like pattern with reddish tones
          const brickX = Math.floor(x / 16);
          const brickY = Math.floor(y / 8);
          const offsetX = (brickY % 2) * 8;
          
          const inBrickX = (x - offsetX) % 16;
          const inBrickY = y % 8;
          
          // Mortar lines
          const isMortar = inBrickX < 1 || inBrickY < 1;
          
          const noise = Math.random() * 0.4;
          let value;
          
          if (isMortar) {
            value = 60 + noise * 20; // Dark mortar
          } else {
            value = 120 + noise * 80; // Brick color variation
          }
          
          data[i] = value * 1.1;      // R - reddish
          data[i + 1] = value * 0.6;  // G
          data[i + 2] = value * 0.4;  // B - brownish
          data[i + 3] = 255;
        }
      }
      
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, size, size, 0, gl.RGBA, gl.UNSIGNED_BYTE, data);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
      gl.generateMipmap(gl.TEXTURE_2D);
      
      return texture;
    }

    const texture0 = createWallTexture(gl, 512);
    const texture1 = createFloorTexture(gl, 512);

    // Handle resize
    function resize() {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      gl.viewport(0, 0, canvas.width, canvas.height);
    }
    resize();
    window.addEventListener('resize', resize);

    // Animation loop
    const startTime = Date.now();
    const LOOP_DURATION = 18000; // 18 seconds
    
    function render() {
      const elapsed = (Date.now() - startTime) % LOOP_DURATION;
      const currentTime = elapsed / 1000;
      setCurrentTime(currentTime);

      gl.useProgram(program);
      gl.uniform3f(iResolutionLocation, canvas!.width, canvas!.height, 1.0);
      gl.uniform1f(iTimeLocation, currentTime);

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, texture0);
      gl.uniform1i(gl.getUniformLocation(program, 'iChannel0'), 0);

      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, texture1);
      gl.uniform1i(gl.getUniformLocation(program, 'iChannel1'), 1);

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      animationFrameRef.current = requestAnimationFrame(render);
    }
    render();

    return () => {
      window.removeEventListener('resize', resize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Calculate opacity for each text section based on time
  const getOpacity = (startTime: number, endTime: number, fadeIn = 0.3, fadeOut = 0.3) => {
    if (currentTime < startTime) return 0;
    if (currentTime > endTime) return 0;
    
    const duration = endTime - startTime;
    const elapsed = currentTime - startTime;
    
    if (elapsed < fadeIn) {
      return elapsed / fadeIn;
    }
    if (elapsed > duration - fadeOut) {
      return (duration - elapsed) / fadeOut;
    }
    return 1;
  };

  const headingColor = isDark ? colors.heading : '#ffffff';
  const bodyColor = isDark ? colors.subtext : '#e5e7eb';

  const primaryButtonStyle = isDark
    ? {
        backgroundColor: colors.card,
        color: colors.heading,
        borderColor: colors.border,
        boxShadow: '0 10px 30px rgba(0,0,0,0.45)',
      }
    : undefined;
  const buttonBaseStyle =
    primaryButtonStyle || {
      backgroundColor: '#ffffff',
      color: '#000000',
      borderColor: 'transparent',
      borderWidth: 0,
    };

  const handleGetStarted = () => {
    navigate('/landing');
  };

  // Fallback UI when WebGL is not available
  if (webGLError) {
    return (
      <div className="fixed inset-0 w-full h-full bg-gradient-to-br from-purple-900 via-purple-700 to-indigo-900">
        {/* Top Right Get Started Button */}
        <div className="absolute top-6 right-6 z-10">
          <button
            onClick={handleGetStarted}
            className="px-6 py-3 rounded-full text-sm font-medium uppercase
                       text-white bg-white/10 backdrop-blur-sm border border-white/20
                       cursor-pointer shadow-md transition-all duration-500 ease-in-out
                       hover:bg-white hover:text-purple-900 hover:shadow-xl
                       active:translate-y-1"
            style={{ letterSpacing: '1.5px' }}
          >
            Get Started &rarr;
          </button>
        </div>
        
        {/* Center Content */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center px-8 text-white">
            <h1 className="text-7xl font-bold mb-4 tracking-tight">UNITED</h1>
            <p className="text-2xl font-light mb-8">Campus, in one place.</p>
            <button
              onClick={handleGetStarted}
              className="px-10 py-4 rounded-full text-base font-medium uppercase
                        bg-white text-purple-900 cursor-pointer shadow-md
                        transition-all duration-500 ease-in-out
                        hover:shadow-xl hover:scale-105 active:translate-y-1"
              style={{ letterSpacing: '1.5px' }}
            >
              Get started &rarr;
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 w-full h-full" style={{ backgroundColor: colors.bg }}>
      <canvas 
        ref={canvasRef} 
        className="w-full h-full block"
        style={{ display: 'block' }}
      />
      
      {/* Top Right Get Started Button */}
      <div className="absolute top-6 right-6 z-10">
        <button
          onClick={handleGetStarted}
          className="px-6 py-3 rounded-full text-sm font-medium uppercase
                     border cursor-pointer shadow-md
                     transition-all duration-500 ease-in-out
                     hover:bg-purple-700 hover:text-white hover:shadow-[0_7px_29px_0px_rgba(93,24,220,1)]
                     active:bg-purple-700 active:text-white active:shadow-none active:translate-y-2"
          style={{
            letterSpacing: '1.5px',
            ...buttonBaseStyle,
          }}
          onMouseEnter={(e) => e.currentTarget.style.letterSpacing = '3px'}
          onMouseLeave={(e) => e.currentTarget.style.letterSpacing = '1.5px'}
        >
          Get Started &rarr;
        </button>
      </div>
      
      {/* Text Overlays */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-center px-8" style={{ color: bodyColor }}>
          
          {/* 0.0-2.5s: UNITED */}
          <div 
            className="transition-opacity duration-300"
            style={{ 
              opacity: getOpacity(0, 2.5),
              display: currentTime >= 0 && currentTime <= 2.5 ? 'block' : 'none'
            }}
          >
            <h1 className="text-7xl font-bold mb-4 tracking-tight" style={{ color: headingColor }}>UNITED</h1>
            <p className="text-2xl font-light" style={{ color: bodyColor }}>Campus, in one place.</p>
          </div>

          {/* 2.5-6.0s: Unite, Collaborate, Achieve */}
          <div 
            className="transition-opacity duration-300"
            style={{ 
              opacity: getOpacity(2.5, 6.0),
              display: currentTime >= 2.5 && currentTime <= 6.0 ? 'block' : 'none'
            }}
          >
            <h2 className="text-5xl font-bold mb-4" style={{ color: headingColor }}>Unite, Collaborate, Achieve</h2>
            <p className="text-2xl font-light" style={{ color: bodyColor }}>Activities, updates, announcements.</p>
          </div>

          {/* 6.0-10.0s: One feed for everything */}
          <div 
            className="transition-opacity duration-300"
            style={{ 
              opacity: getOpacity(6.0, 10.0),
              display: currentTime >= 6.0 && currentTime <= 10.0 ? 'block' : 'none'
            }}
          >
            <h2 className="text-5xl font-bold mb-4" style={{ color: headingColor }}>One feed for everything</h2>
            <p className="text-2xl font-light" style={{ color: bodyColor }}>See what's happening today.</p>
          </div>

          {/* 10.0-14.0s: Chatrooms */}
          <div 
            className="transition-opacity duration-300"
            style={{ 
              opacity: getOpacity(10.0, 14.0),
              display: currentTime >= 10.0 && currentTime <= 14.0 ? 'block' : 'none'
            }}
          >
            <h2 className="text-5xl font-bold mb-4" style={{ color: headingColor }}>Chatrooms that keep you close</h2>
            <p className="text-2xl font-light" style={{ color: bodyColor }}>Talk with classmates & faculty.</p>
          </div>

          {/* 14.0-18.0s: CTA */}
          <div 
            className="transition-opacity duration-300 pointer-events-auto"
            style={{ 
              opacity: getOpacity(14.0, 18.0, 0.4, 0.5),
              display: currentTime >= 14.0 && currentTime <= 18.0 ? 'block' : 'none'
            }}
          >
            <h2 className="text-5xl font-bold mb-8" style={{ color: headingColor }}>Join your campus on UNITED</h2>
            <button
              onClick={handleGetStarted}
              className="px-10 py-4 rounded-full text-base font-medium uppercase
                         border cursor-pointer shadow-md
                         transition-all duration-500 ease-in-out
                         hover:bg-purple-700 hover:text-white hover:shadow-[0_7px_29px_0px_rgba(93,24,220,1)]
                         active:bg-purple-700 active:text-white active:shadow-none active:translate-y-2"
              style={{
                letterSpacing: '1.5px',
                ...buttonBaseStyle,
              }}
              onMouseEnter={(e) => e.currentTarget.style.letterSpacing = '3px'}
              onMouseLeave={(e) => e.currentTarget.style.letterSpacing = '1.5px'}
            >
              Get started &rarr;
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default BlankPage;
