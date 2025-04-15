import { FC, Fragment } from 'react';

interface IImageCardProps {
  imageSrc: string;
  title: string;
  description: string;
  mode?: 'hover' | 'hover-selected' | 'selected' | 'selectable';
  onClick?: () => void;
}

const CardModification = (props: Omit<IImageCardProps, 'imageSrc'>) => {
  switch (props.mode) {
    case 'hover':
    case 'hover-selected':
      return (
        <Fragment>
          <div className="absolute opacity-0 group-hover:opacity-100 inset-0 bg-black bg-opacity-50 transition-opacity duration-300 backdrop-blur-sm " />

          <div className="absolute opacity-0 group-hover:opacity-100 flex  inset-0  items-center justify-center p-4 text-center text-white">
            <div className="text-center">
              <h3 className="text-2xl font-semibold">{props.title}</h3>
              <p className="text-sm">{props.description}</p>
            </div>
          </div>

          {props.mode === 'hover-selected' && (
            <div className="absolute inset-0 border-4 border-green-500" />
          )}
        </Fragment>
      );

    case 'selected':
      return <div className="absolute inset-0 border-4 border-green-500" />;

    case 'selectable':
      return (
        <div className="absolute opacity-0 group-hover:opacity-100 inset-0 border-4 border-green-500 transition-opacity duration-300" />
      );

    default:
      return null;
  }
};

export const ImageCard: FC<IImageCardProps> = ({ imageSrc, title, description, mode, onClick }) => {
  return (
    <div
      className="group relative overflow-hidden rounded-lg shadow-lg cursor-pointer"
      onClick={onClick}
    >
      <img
        alt={title}
        className="w-full h-full object-cover transition-transform duration-300"
        src={imageSrc}
      />

      <CardModification description={description} mode={mode} title={title} />
    </div>
  );
};
