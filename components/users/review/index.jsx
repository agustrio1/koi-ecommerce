import React, { useState, useEffect } from "react";
import Image from "next/image";
import { FiTrash } from "react-icons/fi";
import { RiStarFill, RiStarLine } from "react-icons/ri";
import { getSession } from "next-auth/react";
import { Button } from "@/components/ui/Button";
import { useTheme } from "next-themes";

const Review = () => {
  const [reviews, setReviews] = useState([]);
  const [message, setMessage] = useState("");

  const { theme } = useTheme();

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const session = await getSession();
        if (!session) {
          setMessage("No session found.");
          return;
        }

        const response = await fetch(
          `/api/review/getUserId/${session.user.id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch reviews");
        }

        const data = await response.json();
        if (Array.isArray(data) && data.length === 0) {
          setMessage("Tidak ada atau belum ada review.");
        } else if (data.error) {
          setMessage(data.error);
        } else {
          setReviews(data);
        }
      } catch (error) {
        setMessage("Error fetching reviews.");
        console.error("Error fetching reviews:", error);
      }
    };

    fetchReviews();
  }, []);

  const handleDelete = async (reviewId) => {
    try {
      const response = await fetch(`/api/review/delete/${reviewId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete review");
      }

      setReviews(reviews.filter((review) => review.id !== reviewId));
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        i <= rating ? (
          <RiStarFill key={i} className="text-yellow-500 mr-1" />
        ) : (
          <RiStarLine key={i} className="text-gray-300 mr-1" />
        )
      );
    }
    return stars;
  };

  return (
    <div className={`container mx-auto px-4 py-8`}>
      <h1 className="text-2xl font-bold mb-4">Review</h1>
      {message && <p>{message}</p>}
      {reviews.length > 0 ? (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {reviews.map((review) => (
            <li
              key={review.id}
              className="border border-gray-300 rounded-lg p-4">
              <div className="flex flex-col md:flex-row">
                <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-4">
                  <Image
                    src={review.product.image}
                    alt={review.product.name}
                    width={100}
                    height={100}
                    style={{
                      width: "auto",
                      height: "auto",
                      objectPosition: "center",
                      margin: "0 auto",
                    }}
                  />
                </div>
                <div className="flex-grow my-auto mx-auto lg:ml-8 ">
                  <h2 className="text-lg font-bold mb-2">
                    {review.product.name}
                  </h2>
                  <div className="flex items-center mb-2">
                    {renderStars(review.rating)}
                  </div>
                  <p className="text-md mb-2">Review: {review.comment}</p>
                  <p className=" text-sm font-semibold mb-2">
                    - {review.user.name}
                  </p>
                </div>
                <div className="flex-shrink-0 my-auto mx-auto">
                  <Button
                    onClick={() => handleDelete(review.id)}
                    className="bg-red-500 hover:bg-red-700 text-white "
                    icon={<FiTrash />}
                  >
                   <FiTrash />
                  </Button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>Tidak ada atau belum ada review.</p>
      )}
    </div>
  );
};

export default Review;
