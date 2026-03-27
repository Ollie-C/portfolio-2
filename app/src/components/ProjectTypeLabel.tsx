import { useTranslation } from 'react-i18next';

interface ProjectTypeLabelProps {
  projectType: 'client' | 'personal';
  className?: string;
}

export default function ProjectTypeLabel({
  projectType,
  className = '',
}: ProjectTypeLabelProps) {
  const { t } = useTranslation();

  return (
    <div
      className={`text-[11px] font-mono uppercase tracking-[0.18em] text-primary/75 ${className}`}>
      {t(`projectType.${projectType}`)}
    </div>
  );
}
