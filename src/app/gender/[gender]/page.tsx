import Link from "next/link";
import { notFound } from "next/navigation";

interface GenderPageProps {
  params: Promise<{ gender: string }>;
}

function getGenderLabel(gender: string): string {
  switch (gender.toUpperCase()) {
    case "MEN":
      return "Men";
    case "WOMEN":
      return "Women";
    case "KIDS":
      return "Kids";
    default:
      return "";
  }
}

const categoryCards = [
  {
    title: "Shoes",
    type: "SHOES",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=600&fit=crop",
    description: "Discover our premium footwear collection",
  },
  {
    title: "Clothing",
    type: "CLOTHING",
    image: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=800&h=600&fit=crop",
    description: "Stylish apparel for every occasion",
  },
  {
    title: "Bags",
    type: "ACCESSORIES",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=600&fit=crop",
    description: "Trendy bags and accessories",
  },
];

export default async function GenderPage({ params }: GenderPageProps) {
  const { gender } = await params;
  const genderUpper = gender.toUpperCase();

  // Validate gender
  if (genderUpper !== "MEN" && genderUpper !== "WOMEN" && genderUpper !== "KIDS") {
    notFound();
  }

  const genderLabel = getGenderLabel(genderUpper);

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-neutral-900 dark:text-white mb-4">
            Shop {genderLabel} Collection
          </h1>
          <p className="text-lg text-neutral-600 dark:text-neutral-400">
            Explore our curated selection of premium products
          </p>
        </div>

        {/* Category Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {categoryCards.map((card) => (
            <Link
              key={card.type}
              href={`/shop?gender=${genderUpper}&type=${card.type}`}
              className="group relative overflow-hidden rounded-2xl aspect-[4/3] bg-neutral-100 dark:bg-neutral-900 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            >
              {/* Background Image */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-110"
                style={{ backgroundImage: `url(${card.image})` }}
              >
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20 group-hover:from-black/90 group-hover:via-black/50 transition-all duration-300" />
              </div>

              {/* Content */}
              <div className="relative h-full flex flex-col justify-end p-6 sm:p-8">
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2 group-hover:translate-y-[-4px] transition-transform duration-300">
                  {card.title}
                </h2>
                <p className="text-white/90 text-sm sm:text-base group-hover:translate-y-[-4px] transition-transform duration-300 delay-75">
                  {card.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

