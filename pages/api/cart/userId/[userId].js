import { prisma } from "@/prisma/prisma";
import { getToken } from "next-auth/jwt";

const deleteExpiredCartItems = async (userId) => {
  const now = new Date();
  await prisma.cart.deleteMany({
    where: {
      userId,
      expiresAt: {
        lt: now,
      },
    },
  });
};

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).end();
  }

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const { userId } = req.query;
    await deleteExpiredCartItems(userId); // Call to delete expired items

    const userWithCart = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        cart: {
          include: {
            product: {
              select: {
                id: true,
                slug: true,
                name: true,
                image: true,
                price: true,
                category: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!userWithCart) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(userWithCart.cart);
  } catch (error) {
    console.error("Error fetching user's cart:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
