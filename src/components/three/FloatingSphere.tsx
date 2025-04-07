import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

interface FloatingSphereProps {
  size?: number;
  color?: string;
  speed?: number;
  position?: [number, number, number];
  className?: string;
}

export default function FloatingSphere({
  size = 100,
  color = '#a855f7',
  speed = 1,
  position = [0, 0, 0],
  className = '',
}: FloatingSphereProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();

    // Camera setup
    const camera = new THREE.PerspectiveCamera(155, 1, 0.1, 1000);
    camera.position.z = 5;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });
    renderer.setSize(size, size);
    renderer.setClearColor(0x000000, 0);

    if (containerRef.current.firstChild) {
      containerRef.current.removeChild(containerRef.current.firstChild);
    }
    containerRef.current.appendChild(renderer.domElement);

    // Create sphere
    const geometry = new THREE.SphereGeometry(1, 32, 32);

    // Create material with noise pattern
    const material = new THREE.ShaderMaterial({
      uniforms: {
        color1: { value: new THREE.Color(color) },
        color2: { value: new THREE.Color('#2dd4bf') },
        time: { value: 0 },
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vPosition;
        void main() {
          vUv = uv;
          vPosition = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 color1;
        uniform vec3 color2;
        uniform float time;
        varying vec2 vUv;
        varying vec3 vPosition;
        
        // Simple noise function
        float noise(vec3 p) {
          return fract(sin(dot(p, vec3(12.9898, 78.233, 45.5432))) * 43758.5453);
        }
        
        void main() {
          float pattern = noise(vPosition * 2.0 + time);
          vec3 finalColor = mix(color1, color2, pattern);
          gl_FragColor = vec4(finalColor, 1.0);
        }
      `,
    });

    const sphere = new THREE.Mesh(geometry, material);
    sphere.position.set(position[0], position[1], position[2]);
    scene.add(sphere);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      material.uniforms.time.value += 0.01 * speed;
      sphere.rotation.y += 0.01 * speed;
      sphere.position.y =
        position[1] + Math.sin(Date.now() * 0.001 * speed) * 0.2;

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }

      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [size, color, speed, position]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ width: size, height: size }}
      aria-hidden='true'
    />
  );
}
