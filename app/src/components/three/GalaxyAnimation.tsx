import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useThemeStore } from '../../store/themeStore';

export default function GalaxyAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isDarkMode = useThemeStore((s) => s.modeTheme === 'dark');

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();

    // Camera setup - increased FOV for a wider, more immersive view
    const camera = new THREE.PerspectiveCamera(
      90, // Wider FOV
      window.innerWidth / window.innerHeight,
      0.1,
      100,
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

    // Galaxy parameters - super multi-colored spiral
    const params = {
      count: 12000,
      size: 0.025,
      radius: 8,
      branches: 8,
      randomnessPower: 4,
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

      // Light theme: use normal blending + lower opacity so centre doesn't blow out
      const blending = isDarkMode
        ? THREE.AdditiveBlending
        : THREE.NormalBlending;
      const opacity = isDarkMode ? 1.0 : 0.75;

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

        // Color – same palette as particles: dark amber/moss to muted purple-red
        const mixFactor = Math.random();
        colors[i3] = mixFactor * 0.12 + (1 - mixFactor) * 0.4; // R
        colors[i3 + 1] = mixFactor * 0.6 + (1 - mixFactor) * 0.18; // G
        colors[i3 + 2] = mixFactor * 0.5 + (1 - mixFactor) * 0.32; // B

        // Scale - vary the size more for visual interest
        const isCenterStar = Math.random() > 0.996;
        scales[i] = isCenterStar
          ? params.size * 3 // Occasionally make a star much brighter
          : params.size * (0.7 + Math.random() * 0.6); // Normal variation
      }

      particlesGeometry.setAttribute(
        'position',
        new THREE.BufferAttribute(positions, 3),
      );
      particlesGeometry.setAttribute(
        'color',
        new THREE.BufferAttribute(colors, 3),
      );
      particlesGeometry.setAttribute(
        'scale',
        new THREE.BufferAttribute(scales, 1),
      );

      // Material – additive on dark (glow), normal on light (keeps colour in centre)
      particlesMaterial = new THREE.PointsMaterial({
        size: params.size,
        sizeAttenuation: true,
        depthWrite: false,
        blending,
        vertexColors: true,
        transparent: true,
        alphaMap: createCircleTexture(),
        opacity,
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
        radius,
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
  }, [isDarkMode]);

  return (
    <div
      ref={containerRef}
      className='fixed top-0 left-0 w-full h-full pointer-events-none z-0'
      aria-hidden='true'
    />
  );
}
