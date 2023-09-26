"use server";

import { revalidatePath } from "next/cache";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";

interface Params {
  userId: string;
  username: string;
  name: string;
  bio: string;
  image: string;
  path: string;
}
export async function updateUser({
  userId,
  username,
  name,
  bio,
  image,
  path,
}: Params): Promise<void> {
  try {
    connectToDB();

    await User.findOneAndUpdate(
      { id: userId },
      {
        username: username.toLowerCase(),
        name,
        bio,
        image,
        onboarded: true,
      },
      { upsert: true }
    );

    if (path === "/profile/edit") {
      revalidatePath(path);
    }
  } catch (error: any) {
    throw new Error(
      `file: user.actions.ts:34 ~ updateUser ~ : Failed to create/update user - ${error.message}`
    );
  }
}

export async function fetchUser(userId: string) {
  try {
    connectToDB();

    const user = await User.findOne({ id: userId });
    // .populate({
    //   path: 'communities',
    //   model: Community
    // });
    return user;
  } catch (error: any) {
    throw new Error(
      `file: user.actions.ts:34 ~ updateUser ~ : Failed to fetch user - ${error.message}`
    );
  }
}
