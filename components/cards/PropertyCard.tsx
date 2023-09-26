import { formatIndianPrice, shortenPropertyTitle } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

interface Props {
  id: string;
  currentUserId: string;
  propertyTitle: string;
  status: string;
  address: string;
  price: string;
  bedroom: string;
  bathroom: string;
  image: string[];
  author: {
    name: string;
    image: string;
    id: string;
  };
}

const PropertyCard = ({
  id,
  currentUserId,
  propertyTitle,
  status,
  address,
  price,
  bedroom,
  bathroom,
  image,
  author,
}: Props) => {
  const priceINR = formatIndianPrice(price);
  const formatPropertyTitle = shortenPropertyTitle(propertyTitle);

  return (
    <article className="p-4 rounded-xl border border-red-50 bg-white">
      <div className="w-full h-full rounded-md overflow-hidden">
        <Image
          alt="property"
          width={300}
          height={150}
          src={image[0]}
          className="w-full object-cover"
        />
      </div>

      {/* //* card body */}
      <div className="flex flex-col gap-4 mt-[10px]">
        <div className="flex justify-between items-center">
          <div>
            <Link href={`/property/${id}`}>
              <h3 className="text-heading4-medium">{formatPropertyTitle}</h3>
              <p className="text-small-regular">{address}</p>
            </Link>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div>₹{priceINR}/Months</div>
          <div className="flex items-center gap-1">
            <div>
              bed <span>{bedroom}</span>
            </div>
            <div>
              bath <span>{bathroom}</span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};
export default PropertyCard;
