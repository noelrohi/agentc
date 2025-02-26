"use client";

import { autofillItem, createItem, updateItem } from "@/app/actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Textarea } from "@/components/ui/textarea";
import { getItem } from "@/data";
import { insertItemSchema } from "@/db/zod";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { useFieldArray, useForm, useFormContext } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface EditPageProps {
  item: Awaited<ReturnType<typeof getItem>> | null;
  id: number | null;
}

export default function UpsertAgentForm({ item, id }: EditPageProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [step, setStep] = useState<"initial" | "review">(
    item ? "review" : "initial",
  );
  const [isGenerating, setIsGenerating] = useState(false);

  const form = useForm<z.infer<typeof insertItemSchema>>({
    resolver: zodResolver(insertItemSchema),
    defaultValues: item
      ? {
          ...item,
          keybenefits: item.keybenefits ?? [],
          whoIsItFor: item.whoIsItFor ?? [],
          features: item.features ?? [],
        }
      : {
          name: "",
          slug: "",
          description: "",
          category: "",
          href: "",
          avatar: "",
          demoVideo: "",
          type: "agent",
          isNew: true,
          pricingModel: "freemium",
          tags: [],
          keybenefits: [],
          whoIsItFor: [],
          features: [],
        },
  });

  async function onSubmit(values: z.infer<typeof insertItemSchema>) {
    try {
      startTransition(async () => {
        if (id) {
          const slug = await updateItem(id, values);
          router.push(`/a/${slug}`);
        } else {
          const slug = await createItem(values);
          router.push(`/a/${slug}`);
        }
        router.refresh();
      });
    } catch (error) {
      console.error("Failed to update item:", error);
    }
  }

  const handleGenerate = async () => {
    const websiteUrl = form.getValues("href");
    const videoUrl = form.getValues("demoVideo");

    if (!websiteUrl) {
      toast.error("Website URL is required");
      return;
    }

    setIsGenerating(true);

    try {
      const { website, video } = await autofillItem({
        videoUrl: videoUrl ?? null,
        websiteUrl,
      });

      form.setValue("name", website.object.data.name);
      form.setValue("description", website.object.data.description);
      form.setValue("category", website.object.data.category);
      form.setValue("href", website.object.data.href);
      form.setValue("avatar", website.object.data.avatar);
      form.setValue("pricingModel", website.object.data.pricingModel);
      form.setValue("whoIsItFor", website.object.data.whoIsItFor);
      form.setValue("keybenefits", website.object.data.keybenefits);
      form.setValue(
        "slug",
        website.object.data.name.toLowerCase().replace(/\s+/g, "-"),
      );
      form.setValue(
        "tags",
        website.object.data.tags?.map((t) => t.toLowerCase()) ?? [],
      );

      if (video) {
        form.setValue(
          "features",
          video.features.map((f) => ({
            feature: f.feature,
            description: f.description,
            timestampStart: Math.round(f.timestampStart),
            timestampEnd: Math.round(f.timestampEnd),
          })),
        );
      }

      setStep("review");
    } catch (error) {
      toast.error(`Failed to generate data: ${error}`);
      console.error("Failed to generate data:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="container py-8">
      {step === "initial" ? (
        <InitialSubmissionForm
          form={form}
          isGenerating={isGenerating}
          onGenerate={handleGenerate}
        />
      ) : (
        <ReviewForm
          form={form}
          onSubmit={onSubmit}
          isPending={isPending}
          isEditing={!!id}
          handleGenerate={handleGenerate}
        />
      )}
    </div>
  );
}

function InitialSubmissionForm({
  form,
  isGenerating,
  onGenerate,
}: {
  form: any;
  isGenerating: boolean;
  onGenerate: () => Promise<void>;
}) {
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Submit a New Agent or Tool</CardTitle>
        <CardDescription>
          Let AI do the heavy lifting! Just provide the website URL and
          optionally a demo video URL.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isGenerating ? (
          <GeneratingState />
        ) : (
          <Form {...form}>
            <form className="space-y-6">
              <FormField
                control={form.control}
                name="href"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Website URL <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com" {...field} />
                    </FormControl>
                    <FormDescription>
                      The official website of the agent or tool
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="demoVideo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Demo Video URL</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://youtube.com/watch?v=..."
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      A YouTube video demonstrating the agent or tool (highly
                      recommended for better results)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Type <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <select
                        className={cn(
                          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                        )}
                        {...field}
                      >
                        <option value="agent">Agent</option>
                        <option value="tool">Tool</option>
                      </select>
                    </FormControl>
                    <FormDescription>
                      Is this an AI agent or a tool?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="button"
                className="w-full"
                onClick={onGenerate}
                disabled={isGenerating}
              >
                Generate with AI
              </Button>
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  );
}

function GeneratingState() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((prev) => (prev + 1) % 4);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const steps = [
    {
      title: "Scraping website data",
      description: "Extracting information from the provided URL",
    },
    {
      title: "Processing video content",
      description: "Analyzing video content and extracting key features",
    },
    {
      title: "Generating metadata",
      description: "Creating tags, categories, and other metadata",
    },
    {
      title: "Finalizing content",
      description: "Putting everything together for your review",
    },
  ];

  return (
    <div className="py-10 space-y-8">
      <div className="flex justify-center">
        <div className="w-16 h-16 relative">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary" />
          <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
        </div>
      </div>

      <div className="text-center space-y-2">
        <h3 className="text-lg font-medium">{steps[step].title}</h3>
        <p className="text-muted-foreground">{steps[step].description}</p>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between">
          {steps.map((_, index) => (
            <div
              key={index}
              className={cn(
                "w-3 h-3 rounded-full",
                index === step ? "bg-primary" : "bg-muted",
              )}
            />
          ))}
        </div>
        <p className="text-center text-sm text-muted-foreground">
          This may take a minute or two. We're using AI to generate high-quality
          content.
        </p>
      </div>
    </div>
  );
}

function ReviewForm({
  form,
  onSubmit,
  isPending,
  isEditing,
  handleGenerate,
}: {
  form: any;
  onSubmit: (values: any) => Promise<void>;
  isPending: boolean;
  isEditing: boolean;
  handleGenerate: () => Promise<void>;
}) {
  const formValues = form.getValues();
  const [isRegenerating, setIsRegenerating] = useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {isEditing ? "Edit Item" : "Review Generated Data"}
        </CardTitle>
        <CardDescription>
          {isEditing
            ? "Make changes to the agent or tool information."
            : "Review and edit the AI-generated information before submitting."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isRegenerating ? (
          <GeneratingState />
        ) : (
          <>
            <div className="mb-8 p-4 bg-muted rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium text-lg">AI-Generated Preview</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={async () => {
                    setIsRegenerating(true);
                    try {
                      await handleGenerate();
                    } finally {
                      setIsRegenerating(false);
                    }
                  }}
                >
                  Regenerate with AI
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center">
                    {formValues.avatar && (
                      <div className="mr-3 h-10 w-10 overflow-hidden rounded-full">
                        <img
                          src={formValues.avatar}
                          alt={formValues.name}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "https://via.placeholder.com/40";
                          }}
                        />
                      </div>
                    )}
                    <div>
                      <p className="font-medium">{formValues.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {formValues.category}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm">
                    {formValues.description?.substring(0, 150)}...
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-1">Generated Data:</h4>
                  <ul className="text-sm space-y-1">
                    <li>
                      • {formValues.keybenefits?.length || 0} key benefits
                    </li>
                    <li>
                      • {formValues.whoIsItFor?.length || 0} target audiences
                    </li>
                    <li>• {formValues.features?.length || 0} features</li>
                    <li>• {formValues.tags?.length || 0} tags</li>
                    {formValues.pricingModel && (
                      <li>• Pricing: {formValues.pricingModel}</li>
                    )}
                  </ul>
                </div>
              </div>
            </div>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slug</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter slug" {...field} />
                      </FormControl>
                      <FormDescription>
                        URL-friendly version of the name (auto-generated, but
                        you can edit it)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter description"
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter category" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="href"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter URL" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="avatar"
                  render={({ field: { onChange, value } }) => (
                    <FormItem>
                      <FormLabel>Avatar URL</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter avatar URL"
                          onChange={onChange}
                          value={value ?? ""}
                        />
                      </FormControl>
                      <FormDescription>Avatar image URL</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="demoVideo"
                  render={({ field: { onChange, value } }) => (
                    <FormItem>
                      <FormLabel>Demo Video URL</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter demo video URL"
                          onChange={onChange}
                          value={value ?? ""}
                        />
                      </FormControl>
                      <FormDescription>Demo video URL</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type</FormLabel>
                      <FormControl>
                        <select
                          className={cn(
                            "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                          )}
                          {...field}
                        >
                          <option value="agent">Agent</option>
                          <option value="tool">Tool</option>
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="pricingModel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pricing Model</FormLabel>
                      <FormControl>
                        <select
                          className={cn(
                            "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                          )}
                          {...field}
                          value={field.value || ""}
                        >
                          <option value="" disabled>
                            Select a pricing model
                          </option>
                          <option value="free">Free</option>
                          <option value="paid">Paid</option>
                          <option value="freemium">Freemium</option>
                        </select>
                      </FormControl>
                      <FormDescription>
                        How is this agent or tool priced?
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {isEditing && (
                  <FormField
                    control={form.control}
                    name="isNew"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">New Badge</FormLabel>
                          <FormDescription>
                            Show a "New" badge on this item
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Checkbox
                            checked={field.value ?? true}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                )}
                <TagsFormField />
                <WhoIsItForFormField />
                <KeyBenefitsFormField />
                <FeaturesFormField />
                <div className="flex justify-end space-x-2">
                  <Button type="submit" disabled={isPending}>
                    {isPending
                      ? "Saving..."
                      : isEditing
                      ? "Save Changes"
                      : "Submit"}
                  </Button>
                </div>
              </form>
            </Form>
          </>
        )}
      </CardContent>
    </Card>
  );
}

function TagsFormField() {
  const form = useFormContext<z.infer<typeof insertItemSchema>>();
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "tags" as never,
  });

  return (
    <FormField
      control={form.control}
      name="tags"
      render={() => (
        <FormItem>
          <FormLabel>Tags</FormLabel>
          <div className="space-y-2">
            {fields.map((field, index) => (
              <div key={field.id} className="flex gap-2">
                <FormControl>
                  <Input
                    {...form.register(`tags.${index}`)}
                    placeholder="Enter a tag"
                  />
                </FormControl>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => remove(index)}
                >
                  <span className="sr-only">Remove tag</span>✕
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append("")}
            >
              Add Tag
            </Button>
          </div>
          <FormDescription>
            Add tags to help categorize this item
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function WhoIsItForFormField() {
  const form = useFormContext<z.infer<typeof insertItemSchema>>();
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "whoIsItFor" as never,
  });

  return (
    <FormField
      control={form.control}
      name="whoIsItFor"
      render={() => (
        <FormItem>
          <FormLabel>Who is it for?</FormLabel>
          <div className="space-y-2">
            {fields.map((field, index) => (
              <div key={field.id} className="flex gap-2">
                <FormControl>
                  <Input
                    {...form.register(`whoIsItFor.${index}`)}
                    placeholder="Enter a use case"
                  />
                </FormControl>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => remove(index)}
                >
                  <span className="sr-only">Remove who is it for</span>✕
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append("")}
            >
              Add Who is it for
            </Button>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function KeyBenefitsFormField() {
  const form = useFormContext<z.infer<typeof insertItemSchema>>();
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "keybenefits" as never,
  });

  return (
    <FormField
      control={form.control}
      name="keybenefits"
      render={() => (
        <FormItem>
          <FormLabel>Key Benefits</FormLabel>
          <div className="space-y-2">
            {fields.map((field, index) => (
              <div key={field.id} className="flex gap-2">
                <FormControl>
                  <Input
                    {...form.register(`keybenefits.${index}`)}
                    placeholder="Enter a key benefit"
                  />
                </FormControl>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => remove(index)}
                >
                  <span className="sr-only">Remove key benefit</span>✕
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append("")}
            >
              Add Key Benefit
            </Button>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function FeaturesFormField() {
  const form = useFormContext<z.infer<typeof insertItemSchema>>();
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "features",
  });

  return (
    <FormField
      control={form.control}
      name="features"
      render={() => (
        <FormItem>
          <FormLabel>Features</FormLabel>
          <div className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="space-y-2 rounded-lg border p-4">
                <FormField
                  control={form.control}
                  name={`features.${index}.feature`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Feature Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter feature name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`features.${index}.description`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter feature description"
                          className="min-h-[60px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name={`features.${index}.timestampStart`}
                    render={({ field: { value, onChange, ...field } }) => (
                      <FormItem>
                        <FormLabel>Start Time (seconds)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Start time"
                            {...field}
                            value={value ?? ""}
                            onChange={(e) => {
                              const val = e.target.value;
                              onChange(val ? Number.parseInt(val) : undefined);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`features.${index}.timestampEnd`}
                    render={({ field: { value, onChange, ...field } }) => (
                      <FormItem>
                        <FormLabel>End Time (seconds)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="End time"
                            {...field}
                            value={value ?? ""}
                            onChange={(e) => {
                              const val = e.target.value;
                              onChange(val ? Number.parseInt(val) : undefined);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => remove(index)}
                  className="w-full"
                >
                  Remove Feature
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                append({
                  feature: "",
                  description: "",
                  timestampStart: undefined,
                  timestampEnd: undefined,
                })
              }
            >
              Add Feature
            </Button>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
