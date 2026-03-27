import { useTranslation } from 'react-i18next';

interface ProjectContributionBarProps {
  codeWrittenPercentage: number;
  className?: string;
}

const clampPercentage = (value: number) => Math.min(100, Math.max(0, value));

export default function ProjectContributionBar({
  codeWrittenPercentage,
  className = '',
}: ProjectContributionBarProps) {
  const { t } = useTranslation();
  const writtenByMe = clampPercentage(Math.round(codeWrittenPercentage));
  const aiAssisted = 100 - writtenByMe;

  return (
    <div className={className}>
      <div className='mb-2 flex items-center justify-between gap-3 text-[11px] font-mono uppercase tracking-[0.18em] text-muted-foreground/80'>
        <span>
          {t('projectContribution.writtenByMe')} {writtenByMe}%
        </span>
        <span>
          {t('projectContribution.aiAssisted')} {aiAssisted}%
        </span>
      </div>

      <div
        className='flex h-2.5 overflow-hidden rounded-full border border-border/50 bg-muted/30'
        role='img'
        aria-label={t('projectContribution.ariaLabel', {
          writtenByMe,
          aiAssisted,
        })}>
        <div
          className='h-full bg-primary transition-[width] duration-500 ease-out'
          style={{ width: `${writtenByMe}%` }}
        />
        <div
          className='h-full bg-foreground/20 transition-[width] duration-500 ease-out'
          style={{ width: `${aiAssisted}%` }}
        />
      </div>
    </div>
  );
}
