import React, { useEffect, useRef } from 'react';
import * as THREE from "three";
import "../../styles/homeBG.css";
import cloud from '../../img/cloud.png';

const SignInBG = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    let scene, camera, renderer;
    let nebulaParticles = [];

    const init = () => {
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(75, window.innerWidth / document.body.scrollHeight, 0.1, 1000);
      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(window.innerWidth, document.body.scrollHeight);
      renderer.setClearColor(0xbbbbff); // Light blue background
      containerRef.current.appendChild(renderer.domElement);

      // Create Nebula
      const nebulaGeometry = new THREE.BufferGeometry();
      const vertices = [];

      for (let i = 0; i < 1000; i++) {
        const x = Math.random() * 2000 - 1000;
        const y = Math.random() * 2000 - 1000;
        const z = Math.random() * 2000 - 1000;
        vertices.push(x, y, z);
      }

      nebulaGeometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

      const smokeTexture = new THREE.TextureLoader().load(cloud);

      const nebulaMaterial = new THREE.PointsMaterial({
        size: Math.random() * 10 + 500,
        map: smokeTexture,
        transparent: true,
        opacity: 0.5,
        depthWrite: false,
        blending: THREE.NormalBlending,
      });

      const nebula = new THREE.Points(nebulaGeometry, nebulaMaterial);
      scene.add(nebula);
      nebulaParticles.push(nebula);

      // Create spotlight in the middle
      const spotLight = new THREE.SpotLight(0xffffff, 10);
      spotLight.position.set(0, 0, 0);
      scene.add(spotLight);

      camera.position.z = 5;
      animate();
    };

    const animate = () => {
      requestAnimationFrame(animate);
      nebulaParticles.forEach((nebula) => {
        nebula.rotation.y += 0.0008;
      });
      renderer.render(scene, camera);
    };

    const handleResize = () => {
      const height = document.body.scrollHeight;
      camera.aspect = window.innerWidth / height;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, height);
    };

    window.addEventListener('resize', handleResize);

    init();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (containerRef.current && containerRef.current.firstChild) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={containerRef} className='bg_container' />;
};

export default SignInBG;
