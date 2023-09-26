import { fetchPropertyById } from "@/lib/actions/property.actions";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { formatIndianPrice } from "@/lib/utils";
import PostReview from "@/components/forms/PostReview";

const Page = async ({ params }: { params: { id: string } }) => {
  if (!params.id) return null;

  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo.onboarded) redirect("/onboarding");

  const property = await fetchPropertyById(params.id);

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
        </div>
      </div>
    </section>
  );
};
export default Page;
