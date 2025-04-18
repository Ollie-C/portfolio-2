import { useRef, useEffect } from 'react';
import * as THREE from 'three';

export default function BackgroundAnimation() {
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

    // Create particles
    const particlesGeometry = new THREE.BufferGeometry();
    const count = 1500;

    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count * 3; i += 3) {
      // Positions
      positions[i] = (Math.random() - 0.5) * 10; // x
      positions[i + 1] = (Math.random() - 0.5) * 10; // y
      positions[i + 2] = (Math.random() - 0.5) * 10; // z

      // Colors - significantly reduced blue, more muted tones
      const mixFactor = Math.random();
      // More dark amber/moss to muted purple-red (less blue tones)
      colors[i] = mixFactor * 0.12 + (1 - mixFactor) * 0.4; // R (increased red)
      colors[i + 1] = mixFactor * 0.6 + (1 - mixFactor) * 0.18; // G (muted green)
      colors[i + 2] = mixFactor * 0.5 + (1 - mixFactor) * 0.32; // B (significantly reduced blue)
    }

    particlesGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(positions, 3)
    );
    particlesGeometry.setAttribute(
      'color',
      new THREE.BufferAttribute(colors, 3)
    );

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.03,
      sizeAttenuation: true,
      vertexColors: true,
      transparent: true,
      alphaMap: createCircleTexture(),
      depthWrite: false,
    });

    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

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

      context.beginPath();
      context.arc(centerX, centerY, radius, 0, Math.PI * 2, false);
      context.closePath();

      context.fillStyle = 'white';
      context.fill();

      const texture = new THREE.Texture(canvas);
      texture.needsUpdate = true;
      return texture;
    }

    // Animation
    let mouseX = 0;
    let mouseY = 0;
    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    function onDocumentMouseMove(event: MouseEvent) {
      mouseX = (event.clientX - windowHalfX) * 0.0003;
      mouseY = (event.clientY - windowHalfY) * 0.0003;
    }

    document.addEventListener('mousemove', onDocumentMouseMove);

    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }

    window.addEventListener('resize', onWindowResize);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      // Rotate particles slowly (reduced speed)
      particles.rotation.x += 0.0001;
      particles.rotation.y += 0.0002;

      // Move based on mouse position (reduced sensitivity)
      particles.rotation.x += mouseY * 0.02;
      particles.rotation.y += mouseX * 0.02;

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
