import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

export default function RainAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      95,
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

    // Create raindrops
    const rainGeometry = new THREE.BufferGeometry();
    const count = 3000;

    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const velocities = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      // Random position across screen width
      positions[i3] = (Math.random() - 0.5) * 20;
      // Random height, some above viewport
      positions[i3 + 1] = Math.random() * 30 - 10;
      // Random depth
      positions[i3 + 2] = (Math.random() - 0.3) * 10;

      // Random raindrop size
      sizes[i] = Math.random() * 0.04 + 0.01;

      // Random velocity (falling speed)
      velocities[i] = Math.random() * 0.005 + 0.01;
    }

    rainGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(positions, 3)
    );
    rainGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    // Create a custom shader material for raindrops
    const rainMaterial = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      uniforms: {
        time: { value: 0 },
        color: { value: new THREE.Color(0x5599cc) },
      },
      vertexShader: `
        attribute float size;
        varying vec3 vColor;
        uniform float time;
        
        void main() {
          vColor = vec3(1, 1, 1); // Darker blue color
          
          // Compute position with time-based animation
          vec3 pos = position;
          pos.y = mod(pos.y - time, 30.0) - 10.0; // Cycle through Y position for endless rain
          
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = size * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        
        void main() {
          // Create a raindrop shape (elongated at bottom)
          vec2 coord = gl_PointCoord - vec2(0.5, 0.5);
          float distanceSquared = coord.x * coord.x + coord.y * coord.y;
          if (distanceSquared > 0.25) discard; // Circular mask
          
          // Add gradient and transparency
          float alpha = smoothstep(0.25, 0.0, distanceSquared);
          
          // Elongate bottom slightly
          if (coord.y > 0.0) {
            alpha *= smoothstep(0.25, 0.0, coord.y * coord.y * 2.0 + coord.x * coord.x);
          }
          
          // Final color with gradient and transparency
          gl_FragColor = vec4(vColor, alpha * 0.6);
        }
      `,
    });

    const rain = new THREE.Points(rainGeometry, rainMaterial);
    scene.add(rain);

    // Animation variables
    let time = 0;

    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }

    window.addEventListener('resize', onWindowResize);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      // Update time for rain animation
      time += 0.025;
      rainMaterial.uniforms.time.value = time;

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', onWindowResize);
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }

      rainGeometry.dispose();
      rainMaterial.dispose();
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
