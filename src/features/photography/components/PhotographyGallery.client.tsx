import type { PhotographyDateGroup } from '@/features/photography/server';
import type { PhotoExif } from '@/types/content';
import type { TranslationDictionary } from '@/shared/i18n/types';

interface PhotographyGalleryProps {
  groups: PhotographyDateGroup[];
  t: TranslationDictionary;
}

function buildExifLine(exif?: PhotoExif): string | undefined {
  const camera = [exif?.brand, exif?.model].filter(Boolean).join(' ');
  const base = [camera, exif?.focalLength, exif?.aperture, exif?.shutterSpeed].filter(Boolean);

  if (exif?.iso) {
    base.push(`ISO ${exif.iso}`);
  }

  if (base.length === 0) return undefined;
  return base.join(' · ');
}

function getFallbackAspectRatio(index: number): string {
  const presets = ['4 / 5', '3 / 2', '1 / 1', '2 / 3', '5 / 4'];
  return presets[index % presets.length];
}

export default function PhotographyGallery({ groups, t }: PhotographyGalleryProps) {
  const allPhotos = groups.flatMap((group) => group.photos);
  const title = t['photography.title'];
  const description = t['photography.description'];

  return (
    <div className="w-full">
      <div className="mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <h1 className="font-heading text-4xl sm:text-5xl font-normal tracking-tight text-zinc-900 dark:text-zinc-100 mb-6">
          {title}
        </h1>
        <p className="font-light text-lg text-zinc-500 dark:text-zinc-400 leading-relaxed">
          {description}
        </p>
      </div>

      {allPhotos.length === 0 ? (
        <div className="py-20 text-center border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl">
          <p className="text-zinc-400 font-mono text-sm">{t['photography.empty']}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-10">
          {allPhotos.map((photo, index) => {
            const exifLine = buildExifLine(photo.data.exif);
            const ratio =
              photo.data.imageWidth && photo.data.imageHeight
                ? `${photo.data.imageWidth} / ${photo.data.imageHeight}`
                : getFallbackAspectRatio(index);

            return (
              <article key={photo.slug} className="space-y-2">
                <div
                  className="w-full overflow-hidden border border-[#e5e5e5] dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900"
                  style={{ aspectRatio: ratio }}
                >
                  <img
                    src={photo.data.imageSrc}
                    alt={photo.data.title}
                    loading="lazy"
                    className="block w-full h-full object-cover"
                  />
                </div>
                {photo.data.location && (
                  <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-zinc-500 dark:text-zinc-400">
                    {photo.data.location}
                  </p>
                )}
                <h3 className="font-heading text-[15px] font-semibold leading-[1.4] text-[#0c0a09] dark:text-zinc-100">
                  {photo.data.title}
                </h3>
                {exifLine && (
                  <p className="font-mono text-xs uppercase tracking-[0.02em] leading-[1.4] text-[#78716c] dark:text-zinc-400">
                    {exifLine}
                  </p>
                )}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
