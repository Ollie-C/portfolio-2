import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

interface FloatingCubeProps {
  size?: number;
  color?: string;
  speed?: number;
  position?: [number, number, number];
  className?: string;
}

export default function FloatingCube({
  size = 100,
  color = '#2dd4bf',
  speed = 1,
  position = [0, 0, 0],
  className = '',
}: FloatingCubeProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();

    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
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

    // Create cube
    const geometry = new THREE.BoxGeometry();

    // Apply gradient material
    const gradientMaterial = new THREE.ShaderMaterial({
      uniforms: {
        color1: { value: new THREE.Color(color) },
        color2: { value: new THREE.Color('#a855f7') },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 color1;
        uniform vec3 color2;
        varying vec2 vUv;
        
        void main() {
          gl_FragColor = vec4(mix(color1, color2, vUv.y), 1.0);
        }
      `,
    });

    const cube = new THREE.Mesh(geometry, gradientMaterial);
    cube.position.set(position[0], position[1], position[2]);
    scene.add(cube);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      cube.rotation.x += 0.01 * speed;
      cube.rotation.y += 0.015 * speed;
      cube.position.y =
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
      gradientMaterial.dispose();
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
