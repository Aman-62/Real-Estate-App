// import { UserButton } from "@clerk/nextjs";

import PropertyCard from "@/components/cards/PropertyCard";
import { fetchProperties } from "@/lib/actions/property.actions";
import { currentUser } from "@clerk/nextjs";

export default async function Home() {
  const result = await fetchProperties(1, 8);
  const user = await currentUser();

  return (
    <main>
      <h1 className="head-text text-left">Real Estate</h1>

      <section className="mt-9 flex flex-col gap-10 ">
        <h2 className="text-[28px]">Latest Property for Sale</h2>

        {result.properties.length === 0 ? (
          <p className="no-result">No properties found</p>
        ) : (
          <section className="row justify-center gx-3 gy-4">
            {result.properties.map((property) => (
              <div
                key={property._id}
                className="col-xl-3 col-lg-4 col-md-6 col-sm-3"
              >
                <PropertyCard
                  id={property._id}
                  currentUserId={user?.id || ""}
                  propertyTitle={property.propertyTitle}
                  status={property.status}
                  address={property.address}
                  price={property.price}
                  bedroom={property.bedroom}
                  bathroom={property.bathroom}
                  image={property.profile_photo}
                  author={property.author}
                />
              </div>
            ))}
          </section>
        )}
      </section>
    </main>
  );
}
