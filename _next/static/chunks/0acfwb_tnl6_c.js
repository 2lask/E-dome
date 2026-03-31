(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,50235,e=>{"use strict";var t=e.i(43476),o=e.i(71645);e.s(["default",0,function(){let e=(0,o.useRef)(null);return(0,o.useEffect)(()=>{let t,o=e.current;if(!o)return;let i=o.getContext("webgl");if(!i)return;let a=`
      attribute vec4 aVertexPosition;
      void main() { gl_Position = aVertexPosition; }
    `,r=`
      precision highp float;
      uniform vec2 iResolution;
      uniform float iTime;

      const float overallSpeed = 0.2;
      const float gridSmoothWidth = 0.015;
      const float axisWidth = 0.05;
      const float majorLineWidth = 0.025;
      const float minorLineWidth = 0.0125;
      const float majorLineFrequency = 5.0;
      const float minorLineFrequency = 1.0;
      const float scale = 5.0;
      const vec4 lineColor = vec4(0.77, 0.58, 0.42, 1.0);
      const float minLineWidth = 0.01;
      const float maxLineWidth = 0.2;
      const float lineSpeed = 1.0 * overallSpeed;
      const float lineAmplitude = 1.0;
      const float lineFrequency = 0.2;
      const float warpSpeed = 0.2 * overallSpeed;
      const float warpFrequency = 0.5;
      const float warpAmplitude = 1.0;
      const float offsetFrequency = 0.5;
      const float offsetSpeed = 1.33 * overallSpeed;
      const float minOffsetSpread = 0.6;
      const float maxOffsetSpread = 2.0;
      const int linesPerGroup = 16;

      #define drawSmoothLine(pos, halfWidth, t) smoothstep(halfWidth, 0.0, abs(pos - (t)))
      #define drawCrispLine(pos, halfWidth, t) smoothstep(halfWidth + gridSmoothWidth, halfWidth, abs(pos - (t)))
      #define drawCircle(pos, radius, coord) smoothstep(radius + gridSmoothWidth, radius, length(coord - (pos)))

      float random(float t) {
        return (cos(t) + cos(t * 1.3 + 1.3) + cos(t * 1.4 + 1.4)) / 3.0;
      }

      float getPlasmaY(float x, float horizontalFade, float offset) {
        return random(x * lineFrequency + iTime * lineSpeed) * horizontalFade * lineAmplitude + offset;
      }

      void main() {
        vec2 uv = gl_FragCoord.xy / iResolution.xy;
        vec2 space = (gl_FragCoord.xy - iResolution.xy / 2.0) / iResolution.x * 2.0 * scale;

        float horizontalFade = 1.0 - (cos(uv.x * 6.28) * 0.5 + 0.5);
        float verticalFade = 1.0 - (cos(uv.y * 6.28) * 0.5 + 0.5);

        space.y += random(space.x * warpFrequency + iTime * warpSpeed) * warpAmplitude * (0.5 + horizontalFade);
        space.x += random(space.y * warpFrequency + iTime * warpSpeed + 2.0) * warpAmplitude * horizontalFade;

        vec4 lines = vec4(0.0);
        vec4 bgColor1 = vec4(0.03, 0.03, 0.03, 1.0);
        vec4 bgColor2 = vec4(0.06, 0.04, 0.02, 1.0);

        for(int l = 0; l < linesPerGroup; l++) {
          float normalizedLineIndex = float(l) / float(linesPerGroup);
          float offsetTime = iTime * offsetSpeed;
          float offsetPosition = float(l) + space.x * offsetFrequency;
          float rand = random(offsetPosition + offsetTime) * 0.5 + 0.5;
          float halfWidth = mix(minLineWidth, maxLineWidth, rand * horizontalFade) / 2.0;
          float offset = random(offsetPosition + offsetTime * (1.0 + normalizedLineIndex)) * mix(minOffsetSpread, maxOffsetSpread, horizontalFade);
          float linePosition = getPlasmaY(space.x, horizontalFade, offset);
          float line = drawSmoothLine(linePosition, halfWidth, space.y) / 2.0 + drawCrispLine(linePosition, halfWidth * 0.15, space.y);

          float circleX = mod(float(l) + iTime * lineSpeed, 25.0) - 12.0;
          vec2 circlePosition = vec2(circleX, getPlasmaY(circleX, horizontalFade, offset));
          float circle = drawCircle(circlePosition, 0.01, space) * 4.0;

          line = line + circle;
          lines += line * lineColor * rand;
        }

        gl_FragColor = mix(bgColor1, bgColor2, uv.x);
        gl_FragColor *= verticalFade;
        gl_FragColor.a = 1.0;
        gl_FragColor += lines;
      }
    `;function l(e,t,o){let i=e.createShader(t);return(e.shaderSource(i,o),e.compileShader(i),e.getShaderParameter(i,e.COMPILE_STATUS))?i:(e.deleteShader(i),null)}let n=l(i,i.VERTEX_SHADER,a),s=l(i,i.FRAGMENT_SHADER,r);if(!n||!s)return;let f=i.createProgram();if(i.attachShader(f,n),i.attachShader(f,s),i.linkProgram(f),!i.getProgramParameter(f,i.LINK_STATUS))return;let c=i.createBuffer();i.bindBuffer(i.ARRAY_BUFFER,c),i.bufferData(i.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),i.STATIC_DRAW);let d=i.getAttribLocation(f,"aVertexPosition"),m=i.getUniformLocation(f,"iResolution"),h=i.getUniformLocation(f,"iTime"),u=()=>{let e=o.parentElement;e&&(o.width=e.clientWidth,o.height=e.clientHeight,i.viewport(0,0,o.width,o.height))};window.addEventListener("resize",u),u();let p=Date.now(),g=()=>{i.clearColor(0,0,0,1),i.clear(i.COLOR_BUFFER_BIT),i.useProgram(f),i.uniform2f(m,o.width,o.height),i.uniform1f(h,(Date.now()-p)/1e3),i.bindBuffer(i.ARRAY_BUFFER,c),i.vertexAttribPointer(d,2,i.FLOAT,!1,0,0),i.enableVertexAttribArray(d),i.drawArrays(i.TRIANGLE_STRIP,0,4),t=requestAnimationFrame(g)};return g(),()=>{window.removeEventListener("resize",u),cancelAnimationFrame(t)}},[]),(0,t.jsx)("canvas",{ref:e,className:"absolute inset-0 w-full h-full"})}])},9157,e=>{e.n(e.i(50235))}]);