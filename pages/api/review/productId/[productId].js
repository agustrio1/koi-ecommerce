import { prisma } from "@/prisma/prisma";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).end();
  }

  const { productId } = req.query; 

  try {
    // console.log("Received productId:", productId); 

    const reviews = await prisma.review.findMany({
      where: {
        productId: productId,
      },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
    });

    // console.log("Fetched reviews:", reviews); 

    if (reviews.length === 0) {
      return res.status(404).json({ error: "No reviews found for this product" });
    }

    res.status(200).json(reviews);
  } catch (error) {
    console.error("Failed to fetch reviews:", error);
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
}
