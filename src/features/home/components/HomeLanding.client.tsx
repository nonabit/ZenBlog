import type { HomeLandingProps } from '@/features/home/types';
import HomeHeroSection from '@/features/home/sections/HomeHeroSection.client';
import HomeBentoSection from '@/features/home/sections/HomeBentoSection.client';
import HomeWritingSection from '@/features/home/sections/HomeWritingSection.client';

export default function HomeLanding({ posts, lang, t }: HomeLandingProps) {
  return (
    <div className="max-w-5xl mx-auto px-6 py-16 sm:py-24">
      <HomeHeroSection t={t} />
      <HomeBentoSection t={t} />
      <HomeWritingSection posts={posts} lang={lang} t={t} />
    </div>
  );
}
