"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";

import Image from "next/image";
import { ChangeEvent, useState } from "react";
import { areBase64Images } from "@/lib/utils";
import { useUploadThing } from "@/lib/uploadThing";
import { usePathname, useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Checkbox } from "../ui/checkbox";
import { features } from "../../constants/index";
import { PropertyValidation } from "@/lib/validation/property";
import { createProperty } from "@/lib/actions/property.actions";

// import { updateUser } from "@/lib/actions/user.actions";

const PostProperty = ({ userId }: { userId: string }) => {
  const router = useRouter();
  const pathname = usePathname();
  //* working with profile photo
  const [files, setFiles] = useState<File[]>([]);
  const { startUpload } = useUploadThing("media");

  const handleImage = (
    e: ChangeEvent<HTMLInputElement>,
    fieldChange: (value: string | string[]) => void
  ) => {
    e.preventDefault();

    // const fileReader = new FileReader();

    if (e.target.files && e.target.files.length > 0) {
      //! const file = e.target.files[0];
      const selectedFiles = Array.from(e.target.files);

      setFiles(selectedFiles);

      const imageDataUrls: string[] = [];

      for (const file of selectedFiles) {
        if (!file.type.includes("image")) continue;

        const fileReader = new FileReader();

        fileReader.onload = (event) => {
          const imageDataUrl = event.target?.result?.toString() || "";
          imageDataUrls.push(imageDataUrl);

          // If all files have been processed, call fieldChange with an array of image URLs
          if (imageDataUrls.length === selectedFiles.length) {
            fieldChange(imageDataUrls);
          }
        };

        fileReader.readAsDataURL(file);
      }
    }
  };

  const form = useForm<z.infer<typeof PropertyValidation>>({
    resolver: zodResolver(PropertyValidation),
    defaultValues: {
      propertyTitle: "",
      status: "",
      type: "",
      price: "",
      area: "",
      bedroom: "",
      bathroom: "",
      profile_photo: [],
      address: "",
      city: "",
      state: "",
      pinCode: "",
      description: "",
      age: "",
      garage: "",
      rooms: "",
      features: ["airCondition", "bedding", "internet"],
      ownerName: "",
      ownerEmail: "",
      ownerPhone: "",

      accountId: userId,
    },
  });

  async function onSubmit(values: z.infer<typeof PropertyValidation>) {
    const images = values.profile_photo; // Assuming it's an array of image strings

    const updatedImages = [];

    for (const imageData of images) {
      if (areBase64Images([imageData])) {
        // Convert the base64 data to a Blob
        const byteCharacters = atob(imageData.split(",")[1]);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: "image/jpeg" }); // You may need to adjust the type as needed

        // Create a File object from the Blob
        const file = new File([blob], "image.jpg", { type: "image/jpeg" }); // You can adjust the file name and type

        // Upload the image
        const imgRes = await startUpload([file]); // Pass it as an array

        if (imgRes && imgRes[0].fileUrl) {
          updatedImages.push(imgRes[0].fileUrl); // Push the updated image URL to the array
        } else {
          // Handle the case where the image upload failed
          updatedImages.push(imageData); // Keep the original image data in case of failure
        }
      } else {
        // If the image data is not a valid base64 image, keep it as-is
        updatedImages.push(imageData);
      }
    }

    values.profile_photo = updatedImages; // Update the 'values' array with the updated images

    await createProperty({
      propertyTitle: values.propertyTitle,
      status: values.status,
      type: values.type,
      price: values.price,
      area: values.area,
      bedroom: values.bedroom,
      bathroom: values.bathroom,
      profile_photo: values.profile_photo,
      address: values.address,
      city: values.city,
      state: values.state,
      pinCode: values.pinCode,
      description: values.description,
      age: values.age,
      garage: values.garage,
      rooms: values.rooms,
      features: values.features,
      ownerName: values.ownerName,
      ownerEmail: values.ownerEmail,
      ownerPhone: values.ownerPhone,

      author: userId,
      communityId: null,
      path: pathname,
    });

    router.push("/");
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col justify-start gap-5 mt-4"
      >
        <h2 className="font-bold text-heading4-medium">Basic Information</h2>
        {/*//* property-title */}
        <FormField
          control={form.control}
          name="propertyTitle"
          render={({ field }) => (
            <FormItem className="flex flex-col  gap-3 w-full">
              <FormLabel className="text-base-semibold text-dark-1">
                Property Title
              </FormLabel>
              <FormControl>
                <Input
                  type="text"
                  className="account-form_input no-focus"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/*//* status */}
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Rent or Sale" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="rent">Rent</SelectItem>
                  <SelectItem value="sale">Sale</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/*//* type */}
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Property Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Type of Property" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="houses">Houses</SelectItem>
                  <SelectItem value="apartment">Apartment</SelectItem>
                  <SelectItem value="villas">Villas</SelectItem>
                  <SelectItem value="commercial">Commercial</SelectItem>
                  <SelectItem value="offices">Offices</SelectItem>
                  <SelectItem value="pg">PG</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/*//* price */}
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem className="flex flex-col  gap-3 w-full">
              <FormLabel className="text-base-semibold text-dark-1">
                Price
              </FormLabel>
              <FormControl>
                <Input
                  type="text"
                  className="account-form_input no-focus"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/*//* area */}
        <FormField
          control={form.control}
          name="area"
          render={({ field }) => (
            <FormItem className="flex flex-col  gap-3 w-full">
              <FormLabel className="text-base-semibold text-dark-1">
                Area
              </FormLabel>
              <FormControl>
                <Input
                  type="text"
                  className="account-form_input no-focus"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/*//* bedrooms */}
        <FormField
          control={form.control}
          name="bedroom"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bedrooms</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="3">3</SelectItem>
                  <SelectItem value="4">4</SelectItem>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="6">6</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/*//* bathrooms */}
        <FormField
          control={form.control}
          name="bathroom"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bathrooms</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="3">3</SelectItem>
                  <SelectItem value="4">4</SelectItem>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="6">6</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <h2 className="font-bold text-heading4-medium">Gallery</h2>
        {/*//* gallery */}
        <FormField
          control={form.control}
          name="profile_photo"
          render={({ field }) => (
            <FormItem className="flex items-center gap-4">
              <FormLabel className="text-base-semibold text-dark-1">
                Upload Gallery
                {/* {Array.isArray(field.value) ? (
                  field.value.map((file, index) => (
                    <Image
                      key={index}
                      src={URL.createObjectURL(file)}
                      alt={`profile photo ${index}`}
                      width={96}
                      height={96}
                      priority
                      className="rounded-full object-contain"
                    />
                  ))
                ) : field.value instanceof File ? (
                  <Image
                    src={URL.createObjectURL(field.value)}
                    alt="profile photo"
                    width={96}
                    height={96}
                    priority
                    className="rounded-full object-contain"
                  />
                ) : (
                  <Image
                    src={"/assets/profile.svg"}
                    alt="profile photo"
                    width={24}
                    height={24}
                    priority
                    className="rounded-full"
                  />
                )} */}
              </FormLabel>
              <FormControl className="flex-1 text-base-semibold text-green-200">
                <Input
                  type="file"
                  accept="image/*"
                  placeholder="upload a photo "
                  multiple
                  className="account-form_image-input"
                  onChange={(e) => {
                    handleImage(e, field.onChange);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <h2 className="font-bold text-heading4-medium">Location</h2>
        {/*//* address */}
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem className="flex flex-col  gap-3 w-full">
              <FormLabel className="text-base-semibold text-dark-1">
                Address
              </FormLabel>
              <FormControl>
                <Input
                  type="text"
                  className="account-form_input no-focus"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/*//* city */}
        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem className="flex flex-col  gap-3 w-full">
              <FormLabel className="text-base-semibold text-dark-1">
                City
              </FormLabel>
              <FormControl>
                <Input
                  type="text"
                  className="account-form_input no-focus"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/*//* state */}
        <FormField
          control={form.control}
          name="state"
          render={({ field }) => (
            <FormItem className="flex flex-col  gap-3 w-full">
              <FormLabel className="text-base-semibold text-dark-1">
                State
              </FormLabel>
              <FormControl>
                <Input
                  type="text"
                  className="account-form_input no-focus"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/*//* pinCode */}
        <FormField
          control={form.control}
          name="pinCode"
          render={({ field }) => (
            <FormItem className="flex flex-col  gap-3 w-full">
              <FormLabel className="text-base-semibold text-dark-1">
                Pin Code
              </FormLabel>
              <FormControl>
                <Input
                  type="text"
                  className="account-form_input no-focus"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <h2 className="font-bold text-heading4-medium">Detailed Information</h2>
        {/*//* description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="flex flex-col  gap-3 w-full">
              <FormLabel className="text-base-semibold text-dark-1">
                Description
              </FormLabel>
              <FormControl>
                <Textarea
                  rows={10}
                  className="account-form_input no-focus"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/*//* age */}
        <FormField
          control={form.control}
          name="age"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Building Age (optional)</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="0 - 5 years">0 - 5 Years</SelectItem>
                  <SelectItem value="0 - 10 years">0 - 10 Years</SelectItem>
                  <SelectItem value="0 - 15 years">0 - 15 Years</SelectItem>
                  <SelectItem value="0 - 20 years">0 - 20 Years</SelectItem>
                  <SelectItem value="20+ years">20+ Years</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/*//* garage */}
        <FormField
          control={form.control}
          name="garage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Garage (optional)</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="3">3</SelectItem>
                  <SelectItem value="4">4</SelectItem>
                  <SelectItem value="5">5</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/*//* rooms */}
        <FormField
          control={form.control}
          name="rooms"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rooms (optional)</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="3">3</SelectItem>
                  <SelectItem value="4">4</SelectItem>
                  <SelectItem value="5">5</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/*//* features */}
        <FormField
          control={form.control}
          name="features"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-base">Sidebar</FormLabel>
                <FormDescription>
                  Select the items you want to display in the sidebar.
                </FormDescription>
              </div>
              {features.map((item) => (
                <FormField
                  key={item.id}
                  control={form.control}
                  name="features"
                  render={({ field }) => {
                    return (
                      <FormItem
                        key={item.id}
                        className="flex flex-row items-start space-x-3 space-y-0"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(item.id)}
                            onCheckedChange={(checked: any) => {
                              return checked
                                ? field.onChange([...field.value, item.id])
                                : field.onChange(
                                    field.value?.filter(
                                      (value) => value !== item.id
                                    )
                                  );
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">
                          {item.label}
                        </FormLabel>
                      </FormItem>
                    );
                  }}
                />
              ))}
              <FormMessage />
            </FormItem>
          )}
        />

        <h2 className="font-bold text-heading4-medium">Detailed Information</h2>
        {/*//* ownerName */}
        <FormField
          control={form.control}
          name="ownerName"
          render={({ field }) => (
            <FormItem className="flex flex-col  gap-3 w-full">
              <FormLabel className="text-base-semibold text-dark-1">
                Name
              </FormLabel>
              <FormControl>
                <Input
                  type="text"
                  className="account-form_input no-focus"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/*//* ownerEmail */}
        <FormField
          control={form.control}
          name="ownerEmail"
          render={({ field }) => (
            <FormItem className="flex flex-col  gap-3 w-full">
              <FormLabel className="text-base-semibold text-dark-1">
                Email
              </FormLabel>
              <FormControl>
                <Input
                  type="text"
                  className="account-form_input no-focus"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/*//* ownerPhone */}
        <FormField
          control={form.control}
          name="ownerPhone"
          render={({ field }) => (
            <FormItem className="flex flex-col  gap-3 w-full">
              <FormLabel className="text-base-semibold text-dark-1">
                Phone (optional)
              </FormLabel>
              <FormControl>
                <Input
                  type="text"
                  className="account-form_input no-focus"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};

export default PostProperty;
