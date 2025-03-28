import { BookmarkButton } from "@/components/bookmark-button";
import { FeatureList } from "@/components/feature-list";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { VideoPlayerProvider } from "@/components/video-player";
import { getItemBySlug, getItems } from "@/data";
import { editFlag } from "@/flags";
import { ExternalLink, Youtube } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{
    id: string; // This is actually the slug now, but keeping the param name for compatibility
  }>;
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const item = await getItemBySlug(params.id);

  if (!item) {
    return {
      title: "Not Found",
    };
  }

  return {
    title: `${item.name} - ${item.type === "agent" ? "Agent" : "Tool"}`,
    description: item.description,
    openGraph: {
      title: `${item.name} - ${item.type === "agent" ? "Agent" : "Tool"}`,
      description: item.description,
    },
  };
}

export const dynamicParams = true;

export async function generateStaticParams() {
  const items = await getItems("all");
  return items.map((item) => ({
    id: item.slug,
  }));
}

export default async function ItemPage(props: Props) {
  const params = await props.params;
  const [item, canEdit] = await Promise.all([getItemBySlug(params.id), editFlag()]);

  if (!item) {
    notFound();
  }

  return (
    <main className="container mx-auto py-6 max-w-4xl">
      {/* Header Section */}
      <div className="flex items-start justify-between mb-8">
        <div className="space-y-3">
          <div className="flex items-center gap-4">
            <h1 className="text-4xl font-bold tracking-tight">{item.name}</h1>
            {item.isNew && <Badge variant="secondary">New</Badge>}
          </div>
          <p className="text-lg text-muted-foreground leading-relaxed">{item.description}</p>
          <div className="flex gap-4 pt-2">
            <Button asChild variant="default">
              <Link
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                Visit {item.type === "agent" ? "Agent" : "Tool"}
                <ExternalLink className="h-4 w-4" />
              </Link>
            </Button>
            {item.demoVideo && (
              <Button asChild variant="secondary">
                <Link
                  href={item.demoVideo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  Watch Demo
                  <Youtube className="h-4 w-4" />
                </Link>
              </Button>
            )}
            <BookmarkButton
              item={{
                id: item.slug,
                name: item.name,
                description: item.description,
                href: item.href,
                type: item.type,
                avatar: item.avatar ?? undefined,
              }}
            />
          </div>
        </div>
        <Avatar className="h-20 w-20">
          <AvatarImage src={item.avatar ?? ""} alt={item.name} />
          <AvatarFallback>{item.name.charAt(0)}</AvatarFallback>
        </Avatar>
      </div>

      <Separator className="my-8" />

      {/* Main Content */}
      <div className="space-y-12">
        {/* Metadata Section */}
        <section className="grid grid-cols-2 gap-8">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Category</h2>
            <p className="text-muted-foreground">{item.category}</p>
          </div>
          {item.pricingModel && (
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">Pricing</h2>
              <p className="text-muted-foreground capitalize">{item.pricingModel}</p>
            </div>
          )}
          {item.tags && item.tags.length > 0 && (
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">Tags</h2>
              <div className="flex flex-wrap gap-2">
                {item.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Demo Video Section */}
        {item.demoVideo && (
          <>
            <section className="space-y-4">
              <h2 className="text-xl font-semibold">Demo</h2>
            </section>
            <VideoPlayerProvider url={item.demoVideo} features={item.features} title={item.name}>
              {item.features && item.features.length > 0 && (
                <FeatureList features={item.features} />
              )}
            </VideoPlayerProvider>
          </>
        )}

        {/* Use Cases Section */}
        {item.whoIsItFor && item.whoIsItFor.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">Who is it for?</h2>
            <ul className="grid gap-3 text-muted-foreground">
              {item.whoIsItFor?.map((who) => (
                <li key={who} className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>{who}</span>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>

      {/* Key Benefits Section */}
      {item.keybenefits && item.keybenefits.length > 0 && (
        <section className="space-y-4 mt-4">
          <h2 className="text-xl font-semibold">Key Benefits</h2>
          <ul className="grid gap-3 text-muted-foreground">
            {item.keybenefits?.map((benefit) => (
              <li key={benefit} className="flex items-start">
                <span className="mr-2">•</span>
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <Separator className="my-8" />

      {/* Footer Navigation */}
      <div className="flex justify-between items-center">
        <Button variant="ghost" asChild>
          <Link href={`/${item.type === "agent" ? "" : "tools"}`}>
            ← Back to {item.type === "agent" ? "Agents" : "Tools"}
          </Link>
        </Button>
        {canEdit && (
          <Button variant="outline" asChild>
            <Link href={`/a/${item.slug}/edit`}>Edit</Link>
          </Button>
        )}
      </div>
    </main>
  );
}
