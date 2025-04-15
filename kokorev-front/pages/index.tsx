'use client';

import { title } from '@/components/primitives';
import { SkillCard } from '@/components/skillCard';
import { skillsConfig } from '@/config/skills';
import DefaultLayout from '@/layouts/default';
import { PhotoPreview } from '@/components/photoPreview';

export default function IndexPage() {
  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-xl text-center justify-center">
          <span className={title()}>Make&nbsp;</span>
          <span className={title({ color: 'violet' })}>beautiful&nbsp;</span>
          <br />
          <span className={title()}>with me</span>
        </div>
      </section>
      <section className="grid grid-cols-1 sm:grid-rows-2 sm:grid-cols-2 gap-4 py-8 md:py-10">
        {skillsConfig.map((skill: { title: string; description: string }) => (
          <SkillCard key={skill.title} description={skill.description} title={skill.title} />
        ))}
      </section>
      <PhotoPreview />
    </DefaultLayout>
  );
}
