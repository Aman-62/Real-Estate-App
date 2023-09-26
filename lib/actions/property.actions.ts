"use server";

import { revalidatePath } from "next/cache";
import Property from "../models/property.model";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";

interface Params {
  propertyTitle: string;
  status: string;
  type: string;
  price: string;
  area: string;
  bedroom: string;
  bathroom: string;
  profile_photo: string[];
  address: string;
  city: string;
  state: string;
  pinCode: string;
  description: string;
  age: string;
  garage: string;
  rooms: string;
  features: string[];
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;

  author: string;
  communityId: string | null;
  path: string;
}
export async function createProperty({
  propertyTitle,
  status,
  type,
  price,
  area,
  bedroom,
  bathroom,
  profile_photo,
  address,
  city,
  state,
  pinCode,
  description,
  age,
  garage,
  rooms,
  features,
  ownerName,
  ownerEmail,
  ownerPhone,

  author,
  communityId,
  path,
}: Params) {
  try {
    connectToDB();

    const createProperty = await Property.create({
      propertyTitle,
      status,
      type,
      price,
      area,
      bedroom,
      bathroom,
      profile_photo,
      address,
      city,
      state,
      pinCode,
      description,
      age,
      garage,
      rooms,
      features,
      ownerName,
      ownerEmail,
      ownerPhone,

      author,
      community: null,
    });

    await User.findByIdAndUpdate(author, {
      $push: { properties: createProperty._id },
    });

    revalidatePath(path);
  } catch (error: any) {
    console.log("🚀 ~ file: property.actions.ts:94 ~ error̥:", error.message);
  }
}

export async function fetchProperties(pageNumber = 1, pageSize = 20) {
  connectToDB();

  // calc the number of properties to skip
  const skipAmount = (pageNumber - 1) * pageSize;

  // Fetch properties
  const propertiesQuery = Property.find()
    .sort({ createdAt: "desc" })
    .skip(skipAmount)
    .limit(pageSize)
    .populate({ path: "author", model: User });

  const totalPostCount = await Property.countDocuments();

  const properties = await propertiesQuery.exec();

  const isNext = totalPostCount > skipAmount + properties.length;

  return { properties, isNext };
}

export async function fetchPropertyById(id: string) {
  connectToDB();

  try {
    const property = await Property.findById(id)
      .populate({
        path: "author",
        model: User,
        select: "_id id name image",
      })
      .exec();

    return property;
  } catch (error: any) {
    console.log(
      "🚀 ~ file: property.actions.ts:130 ~ fetchPropertyById ~ error̥: ",
      error.message
    );
  }
}
