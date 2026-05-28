import Image from 'next/image'

const carouselImages = [
  {
    src: '/images/home-carousel/editorial-1.jpg',
    alt: 'SCENT editorial look featuring the endurance collection',
  },
  {
    src: '/images/home-carousel/editorial-2.jpg',
    alt: 'SCENT endurance collection product detail',
  },
  {
    src: '/images/home-carousel/editorial-3.jpg',
    alt: 'SCENT editorial portrait in endurance apparel',
  },
  {
    src: '/images/home-carousel/editorial-4.jpg',
    alt: 'SCENT campaign image for the endurance collection',
  },
  {
    src: '/images/home-carousel/editorial-5.jpg',
    alt: 'SCENT monochrome streetwear editorial',
  },
  {
    src: '/images/home-carousel/editorial-6.jpg',
    alt: 'SCENT endurance collection lifestyle image',
  },
]

export function HomeImageCarousel() {
  return (
    <section className="bg-background py-6 md:py-10" aria-labelledby="home-carousel-title">
      <h2 id="home-carousel-title" className="sr-only">
        SCENT editorial image carousel
      </h2>

      <div className="home-carousel-mask">
        <div className="home-carousel-track">
          {[false, true].map((isDuplicate) => (
            <div
              key={isDuplicate ? 'duplicate' : 'primary'}
              className="home-carousel-set"
              aria-hidden={isDuplicate}
            >
              {carouselImages.map((image) => (
                <div
                  key={`${isDuplicate ? 'duplicate' : 'primary'}-${image.src}`}
                  className="relative h-56 w-36 flex-none overflow-hidden bg-secondary sm:h-72 sm:w-48 md:h-96 md:w-64"
                >
                  <Image
                    src={image.src}
                    alt={isDuplicate ? '' : image.alt}
                    fill
                    sizes="(min-width: 768px) 256px, (min-width: 640px) 192px, 144px"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
