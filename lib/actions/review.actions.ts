"use server";
import { connectToDB } from "../mongoose";

//* models
import Review from "../models/review.model";
import Property from "../models/property.model";
import User from "../models/user.model";

interface Params {
  propertyId: string;
  rating: number;
  comment: string;
  authorId: string;
}

export async function createReview({
  propertyId,
  rating,
  comment,
  authorId,
}: Params) {
  try {
    connectToDB();
    // console.log(propertyId, rating, comment, authorId);
    const createReview = await Review.create({
      property: propertyId,
      author: authorId,
      rating,
      comment,
    });

    await Property.findByIdAndUpdate(propertyId, {
      $push: { reviews: createReview._id },
    });

    await User.findByIdAndUpdate(authorId, {
      $push: { reviews: createReview._id },
    });
  } catch (error: any) {
    console.error("Error creating review:", error.message);
    throw error; // You can handle this error as needed in your application
  }
}

export async function fetchReviews(propertyId: string) {
  connectToDB();

  // Fetch reviews for the given property
  const reviews = await Review.find({ property: propertyId })
    .sort({
      createdAt: "desc",
    })
    .populate({ path: "author", model: User, select: "_id id name image" })
    .exec();

  return reviews;
}
