interface ThemeProps {
  primaryColor?: string;
  accentColor?: string;
  fontHeading?: string;
  fontBody?: string;
}

interface RichContentProps {
  title?: string;
  blocks?: Array<{ type: 'text' | 'image' | 'heading'; content: string }>;
  layout?: 'stacked' | 'side-by-side';
  image?: string;
  imagePosition?: 'left' | 'right';
  backgroundColor?: string;
  theme?: ThemeProps;
}

export default function RichContent({ title, blocks = [], layout = 'stacked', image, imagePosition = 'right', backgroundColor, theme }: RichContentProps) {
  if (layout === 'side-by-side' && image) {
    const imgEl = <img src={image} alt={title || ''} className="w-full h-full object-cover rounded-xl" />;
    const textEl = (
      <div className="flex flex-col justify-center">
        {title && <h2 className="text-3xl font-bold mb-6" style={{ fontFamily: theme?.fontHeading }}>{title}</h2>}
        <div className="space-y-4">
          {blocks.map((block, i) => {
            if (block.type === 'heading') return <h3 key={i} className="text-2xl font-semibold" style={{ fontFamily: theme?.fontHeading }}>{block.content}</h3>;
            return <p key={i} className="text-gray-600 leading-relaxed" style={{ fontFamily: theme?.fontBody }}>{block.content}</p>;
          })}
        </div>
      </div>
    );

    return (
      <section className="py-20" style={{ backgroundColor: backgroundColor || undefined }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {imagePosition === 'left' ? <>{imgEl}{textEl}</> : <>{textEl}{imgEl}</>}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20" style={{ backgroundColor: backgroundColor || undefined }}>
      <div className="max-w-3xl mx-auto px-6">
        {title && <h2 className="text-3xl font-bold mb-8" style={{ fontFamily: theme?.fontHeading }}>{title}</h2>}
        <div className="space-y-6">
          {blocks.map((block, i) => {
            if (block.type === 'heading') return <h3 key={i} className="text-2xl font-semibold" style={{ fontFamily: theme?.fontHeading }}>{block.content}</h3>;
            if (block.type === 'image') return <img key={i} src={block.content} alt="" className="w-full rounded-xl" />;
            return <p key={i} className="text-gray-600 leading-relaxed" style={{ fontFamily: theme?.fontBody }}>{block.content}</p>;
          })}
        </div>
      </div>
    </section>
  );
}
