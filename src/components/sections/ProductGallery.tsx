interface ProductGalleryProps {
  title?: string;
  products?: Array<{ name: string; image: string; description?: string; price?: string; link?: string }>;
  layout?: 'grid' | 'carousel';
}

export default function ProductGallery({ title, products = [], layout = 'grid' }: ProductGalleryProps) {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        {title && <h2 className="text-3xl font-bold text-center mb-12">{title}</h2>}
        <div className={layout === 'grid' ? 'grid grid-cols-1 md:grid-cols-3 gap-8' : 'flex gap-6 overflow-x-auto pb-4'}>
          {products.map((product, i) => (
            <div key={i} className={`bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow ${layout === 'carousel' ? 'min-w-[300px]' : ''}`}>
              <img src={product.image} alt={product.name} className="w-full h-64 object-cover" />
              <div className="p-5">
                <h3 className="font-semibold text-lg">{product.name}</h3>
                {product.description && <p className="text-gray-600 text-sm mt-2">{product.description}</p>}
                <div className="mt-4 flex items-center justify-between">
                  {product.price && <span className="text-lg font-bold">{product.price}</span>}
                  {product.link && (
                    <a href={product.link} className="text-sm text-blue-600 hover:underline">了解详情 →</a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
