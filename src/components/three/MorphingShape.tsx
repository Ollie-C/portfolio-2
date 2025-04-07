import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

export default function MorphingShape() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 5;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);

    if (containerRef.current.firstChild) {
      containerRef.current.removeChild(containerRef.current.firstChild);
    }
    containerRef.current.appendChild(renderer.domElement);

    // Create a sphere geometry with many segments for smooth morphing
    const geometry = new THREE.IcosahedronGeometry(1.5, 4);
    const initialPositions = geometry.attributes.position.array.slice();

    // Custom shader material with gradient effect
    const material = new THREE.ShaderMaterial({
      transparent: true,
      uniforms: {
        time: { value: 0 },
        mousePosition: { value: new THREE.Vector2(0, 0) },
        mouseInfluence: { value: 0 },
        color1: { value: new THREE.Color(0x2dd4bf) }, // Light teal to match screenshot
        color2: { value: new THREE.Color(0x0d9488) }, // Darker teal for depth
      },
      vertexShader: `
        uniform float time;
        uniform vec2 mousePosition;
        uniform float mouseInfluence;
        varying vec2 vUv;
        varying float vNoise;
        
        // Improved Perlin-like noise function
        float noise(vec3 p) {
          vec3 i = floor(p);
          vec3 f = fract(p);
          f = f * f * (3.0 - 2.0 * f); // Smoother interpolation
          
          float n = i.x + i.y * 157.0 + 113.0 * i.z;
          return mix(
            mix(
              mix(fract(sin(n + 0.0) * 43758.5453), fract(sin(n + 1.0) * 43758.5453), f.x),
              mix(fract(sin(n + 157.0) * 43758.5453), fract(sin(n + 158.0) * 43758.5453), f.x),
              f.y
            ),
            mix(
              mix(fract(sin(n + 113.0) * 43758.5453), fract(sin(n + 114.0) * 43758.5453), f.x),
              mix(fract(sin(n + 270.0) * 43758.5453), fract(sin(n + 271.0) * 43758.5453), f.x),
              f.y
            ),
            f.z
          );
        }
        
        void main() {
          vUv = uv;
          
          // Create a smoother, slower distortion based on position and time
          vec3 pos = position;
          // Reduced frequency and amplitude for gentler motion
          float noise1 = noise(pos * 1.5 + time * 0.05);
          float noise2 = noise(pos * 2.5 - time * 0.08);
          
          // Calculate distance to mouse position in normalized device coords
          vec4 worldPos = modelMatrix * vec4(pos, 1.0);
          vec4 screenPos = projectionMatrix * viewMatrix * worldPos;
          vec2 ndc = screenPos.xy / screenPos.w;
          float distToMouse = length(ndc - mousePosition);
          
          // Apply mouse-based distortion (stronger near mouse)
          float mouseEffect = max(0.0, (0.8 - distToMouse)) * 1.5 * mouseInfluence;
          
          // Apply distortion to vertex - more pronounced and smoother
          pos += normal * (noise1 * 0.25 + noise2 * 0.15); // Increased amplitude
          pos += normal * mouseEffect * 0.5; // Increased mouse effect
          
          vNoise = noise1 * 0.5 + noise2 * 0.5;
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 color1;
        uniform vec3 color2;
        varying vec2 vUv;
        varying float vNoise;
        
        void main() {
          // Create gradient based on noise value and position
          vec3 color = mix(color1, color2, vUv.y + vNoise * 0.5); // Increased noise influence
          
          // Add rim lighting effect
          float rim = smoothstep(0.4, 0.9, 1.0 - vUv.y);
          color = mix(color, vec3(0.7, 0.95, 0.95), rim * 0.3); // Brighter rim with teal tint
          
          // Fade out near edges more gradually
          float alpha = smoothstep(0.0, 0.3, 1.0 - abs(vUv.y * 2.0 - 1.0));
          alpha *= 0.85; // Slightly higher opacity
          
          gl_FragColor = vec4(color, alpha);
        }
      `,
    });

    const shape = new THREE.Mesh(geometry, material);
    scene.add(shape);

    // Mouse tracking variables
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;
    let mouseInfluence = 0;
    let targetMouseInfluence = 0;

    // Track mouse position
    function onDocumentMouseMove(event: MouseEvent) {
      // Convert to normalized device coordinates (-1 to +1)
      targetMouseX = (event.clientX / window.innerWidth) * 2 - 1;
      targetMouseY = -(event.clientY / window.innerHeight) * 2 + 1;

      // Increase influence when mouse moves
      targetMouseInfluence = 1.0;
      // Reset mouse influence decay timer with a longer duration
      clearTimeout(mouseTimeout);
      mouseTimeout = setTimeout(() => {
        targetMouseInfluence = 0;
      }, 2000); // Longer decay (2 seconds)
    }

    let mouseTimeout: ReturnType<typeof setTimeout>;

    document.addEventListener('mousemove', onDocumentMouseMove);

    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }

    window.addEventListener('resize', onWindowResize);

    // Very slow rotation for more stability
    let rotationSpeed = 0.0005;

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      // Much smoother mouse movement with slower interpolation
      mouseX += (targetMouseX - mouseX) * 0.02; // Reduced from 0.05
      mouseY += (targetMouseY - mouseY) * 0.02; // Reduced from 0.05
      mouseInfluence += (targetMouseInfluence - mouseInfluence) * 0.03; // Smoother transition

      // Update uniforms - slower time increment for less vibration
      material.uniforms.time.value += 0.004; // Reduced from 0.01
      material.uniforms.mousePosition.value.set(mouseX, mouseY);
      material.uniforms.mouseInfluence.value = mouseInfluence;

      // Even gentler rotation
      shape.rotation.y += rotationSpeed;
      shape.rotation.z += rotationSpeed * 0.5;

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', onWindowResize);
      document.removeEventListener('mousemove', onDocumentMouseMove);
      clearTimeout(mouseTimeout);

      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }

      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className='fixed top-0 left-0 w-full h-full pointer-events-none z-0'
      aria-hidden='true'
    />
  );
}
