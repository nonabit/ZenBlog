import type { HomeLandingProps } from '@/features/home/types';
import HomeHeroSection from '@/features/home/sections/HomeHeroSection.client';
import HomeWritingSection from '@/features/home/sections/HomeWritingSection.client';
import HomePhotographySection from '@/features/home/sections/HomePhotographySection.client';
import HomeProjectsSection from '@/features/home/sections/HomeProjectsSection.client';

export default function HomeLanding({ posts, photos, projects, lang, t }: HomeLandingProps) {
  return (
    <div className="mx-auto px-6 py-16 sm:py-24">
      {/* Hero 和 Writing 区：窄宽度 640px */}
      <div className="max-w-2xl mx-auto">
        <HomeHeroSection t={t} />
        <HomeWritingSection posts={posts} lang={lang} t={t} />
      </div>

      {/* Photography 和 Projects 区：宽宽度 960px */}
      <div className="max-w-4xl mx-auto">
        <HomePhotographySection photos={photos} lang={lang} t={t} />
        <HomeProjectsSection projects={projects} lang={lang} t={t} />
      </div>
    </div>
  );
}
