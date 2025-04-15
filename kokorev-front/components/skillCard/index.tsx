import { FC } from 'react';

type TSkillCardProps = {
  title: string;
  description: string;
};

export const SkillCard: FC<TSkillCardProps> = props => {
  return (
    <div className="bg-default-700/10 rounded-lg border border-white/20">
      <div className="rounded-lg inset-[2px] flex flex-col gap-2  p-4">
        <strong className="text-lg font-semibold">{props.title}</strong>
        <span className="opacity-70">{props.description}</span>
      </div>
    </div>
  );
};
