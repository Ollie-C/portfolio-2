import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

export default function GalaxyAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();

    // Camera setup - increased FOV for a wider, more immersive view
    const camera = new THREE.PerspectiveCamera(
      90, // Wider FOV
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    // Adjusted camera position for a better default view
    camera.position.set(3, 1, 4);

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);

    // Clean up any existing canvas
    if (containerRef.current.firstChild) {
      containerRef.current.removeChild(containerRef.current.firstChild);
    }
    containerRef.current.appendChild(renderer.domElement);

    // Galaxy parameters - optimized for visual appeal
    const params = {
      count: 18000, // Good balance of performance and visual density
      size: 0.035, // Smaller particles for a more starry appearance
      radius: 8, // Slightly larger radius for a wider galaxy
      branches: 8, // 3 spiral arms looks good
      colorInside: new THREE.Color('#443223'), // Warm center
      colorOutside: new THREE.Color('#25307f'), // White edges
      randomnessPower: 4, // Increased for more natural spread
      insideColor: 0xffffff,
      outsideColor: 0xffffff,
    };

    // Create galaxy
    let particles: THREE.Points;
    let particlesGeometry: THREE.BufferGeometry;
    let particlesMaterial: THREE.PointsMaterial;

    const generateGalaxy = () => {
      // Dispose of old galaxy if it exists
      if (particles) {
        particlesGeometry.dispose();
        particlesMaterial.dispose();
        scene.remove(particles);
      }

      // Create geometry
      particlesGeometry = new THREE.BufferGeometry();
      const positions = new Float32Array(params.count * 3);
      const colors = new Float32Array(params.count * 3);
      const scales = new Float32Array(params.count);

      for (let i = 0; i < params.count; i++) {
        const i3 = i * 3;

        // Position
        const radius = Math.random() * params.radius;
        const branchAngle =
          ((i % params.branches) / params.branches) * Math.PI * 2;
        const spinAngle = radius * 0.5; // Smaller values create tighter spirals

        const randomX =
          Math.pow(Math.random(), params.randomnessPower) *
          (Math.random() < 0.5 ? 1 : -1) *
          0.8 *
          radius;
        const randomY =
          Math.pow(Math.random(), params.randomnessPower) *
          (Math.random() < 0.5 ? 1 : -1) *
          0.4 *
          radius;
        const randomZ =
          Math.pow(Math.random(), params.randomnessPower) *
          (Math.random() < 0.5 ? 1 : -1) *
          0.4 *
          radius;

        positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX;
        positions[i3 + 1] = randomY;
        positions[i3 + 2] =
          Math.sin(branchAngle + spinAngle) * radius + randomZ;

        // Color
        const mixRatio = radius / params.radius;
        const insideColor = params.colorInside;
        const outsideColor = params.colorOutside;

        const color = insideColor.clone().lerp(outsideColor, mixRatio);

        colors[i3] = color.r;
        colors[i3 + 1] = color.g;
        colors[i3 + 2] = color.b;

        // Scale - vary the size more for visual interest
        const isCenterStar = Math.random() > 0.996;
        scales[i] = isCenterStar
          ? params.size * 3 // Occasionally make a star much brighter
          : params.size * (0.7 + Math.random() * 0.6); // Normal variation
      }

      particlesGeometry.setAttribute(
        'position',
        new THREE.BufferAttribute(positions, 3)
      );
      particlesGeometry.setAttribute(
        'color',
        new THREE.BufferAttribute(colors, 3)
      );
      particlesGeometry.setAttribute(
        'scale',
        new THREE.BufferAttribute(scales, 1)
      );

      // Material
      particlesMaterial = new THREE.PointsMaterial({
        size: params.size,
        sizeAttenuation: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexColors: true,
        transparent: true,
        alphaMap: createCircleTexture(),
      });

      // Points
      particles = new THREE.Points(particlesGeometry, particlesMaterial);
      scene.add(particles);
    };

    // Create texture for particles
    function createCircleTexture() {
      const canvas = document.createElement('canvas');
      canvas.width = 32;
      canvas.height = 32;

      const context = canvas.getContext('2d');
      if (!context) return null;

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = canvas.width / 3;

      // Create gradient for better defined edges
      const gradient = context.createRadialGradient(
        centerX,
        centerY,
        0,
        centerX,
        centerY,
        radius
      );

      gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
      gradient.addColorStop(0.8, 'rgba(255, 255, 255, 0.8)');
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

      context.beginPath();
      context.arc(centerX, centerY, radius, 0, Math.PI * 2, false);
      context.closePath();

      context.fillStyle = gradient;
      context.fill();

      const texture = new THREE.Texture(canvas);
      texture.needsUpdate = true;
      return texture;
    }

    generateGalaxy();

    // Movement tracking - reduced sensitivity for smoother motion
    let mouseX = 0;
    let mouseY = 0;
    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    function onDocumentMouseMove(event: MouseEvent) {
      mouseX = (event.clientX - windowHalfX) * 0.0005;
      mouseY = (event.clientY - windowHalfY) * 0.0001;
    }

    document.addEventListener('mousemove', onDocumentMouseMove);

    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }

    window.addEventListener('resize', onWindowResize);

    // Animation loop
    const clock = new THREE.Clock();

    const animate = () => {
      requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Smooth rotation with good default speed
      particles.rotation.y = elapsedTime * 0.07;

      // Add subtle mouse influence
      particles.rotation.y += mouseX * 0;
      particles.rotation.x += mouseY * 0.01;

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', onWindowResize);
      document.removeEventListener('mousemove', onDocumentMouseMove);

      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }

      particlesGeometry.dispose();
      particlesMaterial.dispose();
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
