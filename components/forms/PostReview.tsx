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
import { ChangeEvent, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { ReviewValidation } from "@/lib/validation/review";
import { createProperty } from "@/lib/actions/property.actions";
import { createReview } from "@/lib/actions/review.actions";

const PostReview = ({
  propertyId,
  userId,
}: {
  propertyId: string;
  userId: string;
}) => {
  const form = useForm<z.infer<typeof ReviewValidation>>({
    resolver: zodResolver(ReviewValidation),
    defaultValues: {
      rating: "",
      comment: "",
      propertyId: propertyId,
      authorId: userId,
    },
  });

  async function onSubmit(values: z.infer<typeof ReviewValidation>) {
    await createReview({
      propertyId: values.propertyId,
      authorId: values.authorId,
      rating: Number(values.rating),
      comment: values.comment,
    });
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col justify-start gap-5 mt-4"
      >
        {/*//* rating */}
        <FormField
          control={form.control}
          name="rating"
          render={({ field }) => (
            <FormItem>
              <FormLabel>rating</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Type of Property" />
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

        {/*//* comment */}
        <FormField
          control={form.control}
          name="comment"
          render={({ field }) => (
            <FormItem className="flex flex-col  gap-3 w-full">
              <FormLabel className="text-base-semibold text-dark-1">
                Comment
              </FormLabel>
              <FormControl>
                <Textarea
                  rows={6}
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
export default PostReview;
