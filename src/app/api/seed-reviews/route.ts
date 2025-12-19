import { db } from "@/lib/db";
import { NextResponse } from "next/server";

const testReviews = [
  {
    rating: 5,
    comment: "Absolutely love these sneakers! The quality is outstanding and they're super comfortable. Perfect fit and great style.",
    userName: "Alex Johnson",
  },
  {
    rating: 5,
    comment: "Best purchase I've made this year! The shoes look even better in person and the delivery was super fast.",
    userName: "Sarah Martinez",
  },
  {
    rating: 4,
    comment: "Great quality and design. They fit perfectly and are very comfortable for daily wear. Highly recommend!",
    userName: "Michael Chen",
  },
  {
    rating: 5,
    comment: "These are amazing! The build quality is top-notch and they're incredibly comfortable. Worth every penny.",
    userName: "Emily Davis",
  },
  {
    rating: 4,
    comment: "Really happy with my purchase. The shoes are stylish and comfortable. Great value for money!",
    userName: "James Wilson",
  },
  {
    rating: 5,
    comment: "Perfect sneakers! They look exactly like the photos and the quality is exceptional. Will definitely buy again!",
    userName: "Olivia Brown",
  },
  {
    rating: 4,
    comment: "Love the design and comfort. The shoes are well-made and look great with any outfit. Very satisfied!",
    userName: "David Lee",
  },
  {
    rating: 5,
    comment: "Incredible quality! These sneakers exceeded my expectations. Super comfortable and stylish. Highly recommend!",
    userName: "Sophia Garcia",
  },
];

export async function GET() {
  try {
    // Get all products that are not archived
    const products = await db.product.findMany({
      where: { isArchived: false },
      take: 10, // Get up to 10 products
    });

    if (products.length === 0) {
      return NextResponse.json(
        { error: "No products found in the database. Please add products first." },
        { status: 400 }
      );
    }

    // Create reviews for different products
    const reviewsToCreate = testReviews.map((review, index) => {
      // Distribute reviews across different products
      const productIndex = index % products.length;
      const product = products[productIndex];

      return {
        rating: review.rating,
        comment: review.comment,
        userName: review.userName,
        productId: product.id,
      };
    });

    // Create all reviews
    const createdReviews = [];
    for (const reviewData of reviewsToCreate) {
      const review = await db.review.create({
        data: reviewData,
      });
      createdReviews.push(review);
    }

    return NextResponse.json({
      success: true,
      message: `Successfully created ${createdReviews.length} reviews!`,
      reviewsCreated: createdReviews.length,
    });
  } catch (error) {
    console.error("Error seeding reviews:", error);
    return NextResponse.json(
      { error: "Failed to seed reviews", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

