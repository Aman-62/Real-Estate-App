import { fetchPropertyById } from "@/lib/actions/property.actions";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { formatIndianPrice } from "@/lib/utils";
import PostReview from "@/components/forms/PostReview";
import { fetchReviews } from "@/lib/actions/review.actions";
import Image from "next/image";

const Page = async ({ params }: { params: { id: string } }) => {
  if (!params.id) return null;

  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo.onboarded) redirect("/onboarding");

  const property = await fetchPropertyById(params.id);
  let allReviews = [];
  allReviews = await fetchReviews(property._id);
  console.log(allReviews);

  const {
    _id,
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
    community,
    reviews,
    createdAt,
  } = property;

  const priceINR = formatIndianPrice(price);
  const paymentType = status === "rent" ? "/month" : null;

  return (
    <section>
      <div>
        <div className="flex justify-between items-center">
          <div>
            <Badge>{status}</Badge>
            <h1 className="text-heading1-bold">{propertyTitle}</h1>
            <p className="mb-4">
              <span className="text-small-regular">{address}</span>
            </p>
            bed {bedroom} - bath {bathroom} - area {area}ftsq
          </div>

          <div>
            <span className="text-heading2-semibold">₹{priceINR}</span>
            {paymentType}
          </div>
        </div>

        <div className="mt-4">
          <h2 className="text-heading4-medium">About Property</h2>
          <p className="text-body-normal">{description}</p>
        </div>

        <div className="mt-4">
          <h2 className="text-heading4-medium">Basic Details</h2>
          <ul className="flex gap-2 flex-wrap">
            {features.map((feature: string, index: number) => (
              <li key={index}>
                {"> "}
                {feature}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-4">
          <h2 className="text-heading4-medium">PostReview</h2>
          <PostReview propertyId={_id} userId={userInfo._id} />
          {allReviews.map((review) => {
            const {
              _id,
              author: { image, name },
              rating,
              comment,
            } = review;
            return (
              <div key={_id} className="mt-3  p-2 bg-white shadow rounded-lg">
                <div className="flex gap-3 items-center">
                  <Image
                    width={34}
                    height={34}
                    className="rounded-full"
                    src={image}
                    alt="profile"
                  />
                  <div className="flex">
                    {rating}
                    <Image
                      src={"/assets/heart-filled.svg"}
                      width={24}
                      height={24}
                      alt="star"
                    />
                  </div>
                </div>
                <div className="mt-2">
                  <p>{comment}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
export default Page;
