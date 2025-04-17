import { useThemeStore } from '../../store/themeStore';
import BackgroundAnimation from './ParticlesAnimation';
import RainAnimation from './RainAnimation';
import GalaxyAnimation from './GalaxyAnimation';

export default function BackgroundWrapper() {
  const { animationTheme } = useThemeStore();

  return (
    <div className='z-0 overflow-hidden'>
      {animationTheme === 'particles' ? (
        <BackgroundAnimation />
      ) : animationTheme === 'rain' ? (
        <RainAnimation />
      ) : animationTheme === 'galaxy' ? (
        <GalaxyAnimation />
      ) : null}
    </div>
  );
}
