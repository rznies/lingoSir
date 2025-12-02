import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, BookOpen, Calendar, Clock } from "lucide-react";
import { getPostById } from "../services/wordpress";
import { Badge } from "@/components/design/Badge";
import { Button } from "@/components/design/Button";
import { Card } from "@/components/design/Card";

export function BlogPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPost() {
      try {
        const data = await getPostById(id);
        setPost(data);
      } catch (err) {
        setError(err.message || "Failed to load post");
      } finally {
        setLoading(false);
      }
    }
    fetchPost();
  }, [id]);

  const featuredImage = post?._embedded?.["wp:featuredmedia"]?.[0]?.source_url;

  return (
    <div className="min-h-screen bg-[#f8f8f8] text-[#111]">
      {/* Header */}
      <header className="border-b-4 border-black bg-white">
        <div className="container mx-auto flex items-center justify-between px-4 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center border-4 border-black bg-[#004B8D]">
              <BookOpen size={24} strokeWidth={3} className="text-white" />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.3em] text-gray-500">
                Insights
              </p>
              <p className="text-2xl font-black uppercase tracking-tight">
                Global<span className="text-[#E60023]">Blog</span>
              </p>
            </div>
          </div>
          <Button
            variant="secondary"
            className="gap-2 px-5 py-2 text-sm"
            onClick={() => navigate("/blog")}
          >
            <ArrowLeft size={18} strokeWidth={3} />
            Back to Blog
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        {loading && (
          <Card className="mx-auto max-w-4xl bg-white">
            <div className="flex items-center gap-3">
              <div className="h-6 w-6 animate-spin rounded-full border-4 border-[#F8D300] border-t-transparent" />
              <p className="font-bold uppercase tracking-wide text-gray-600">
                Loading post...
              </p>
            </div>
          </Card>
        )}

        {error && (
          <div className="mx-auto max-w-4xl space-y-4">
            <Card className="bg-[#E60023]">
              <p className="font-bold text-white">Error: {error}</p>
            </Card>
            <Link
              to="/blog"
              className="inline-block font-bold text-[#004B8D] hover:underline"
            >
              ← Back to Blog
            </Link>
          </div>
        )}

        {!loading && !error && post && (
          <article className="mx-auto max-w-4xl">
            {/* Post Header */}
            <div className="mb-8 space-y-4">
              <Badge color="bg-[#E60023]">Article</Badge>
              <h1
                className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight leading-tight"
                dangerouslySetInnerHTML={{ __html: post.title.rendered }}
              />
              <div className="flex flex-wrap items-center gap-4 text-sm font-semibold text-gray-600">
                <span className="flex items-center gap-2">
                  <Calendar size={16} strokeWidth={3} className="text-[#004B8D]" />
                  {new Date(post.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
                <span className="flex items-center gap-2">
                  <Clock size={16} strokeWidth={3} className="text-[#F8D300]" />
                  {Math.ceil(post.content.rendered.split(" ").length / 200)} min
                  read
                </span>
              </div>
            </div>

            {/* Featured Image */}
            {featuredImage && (
              <div className="mb-8 overflow-hidden border-4 border-black shadow-[6px_6px_0px_0px_#111]">
                <img
                  src={featuredImage}
                  alt=""
                  className="w-full object-cover"
                />
              </div>
            )}

            {/* Post Content */}
            <Card className="bg-white">
              <div
                className="prose prose-lg max-w-none 
                  [&>p]:mb-6 [&>p]:text-base [&>p]:leading-relaxed [&>p]:text-gray-800
                  [&>h2]:mt-10 [&>h2]:mb-4 [&>h2]:text-2xl [&>h2]:font-black [&>h2]:uppercase [&>h2]:tracking-tight
                  [&>h3]:mt-8 [&>h3]:mb-3 [&>h3]:text-xl [&>h3]:font-bold [&>h3]:uppercase
                  [&>ul]:my-6 [&>ul]:ml-6 [&>ul]:list-disc [&>ul>li]:mb-2 [&>ul>li]:font-medium
                  [&>ol]:my-6 [&>ol]:ml-6 [&>ol]:list-decimal [&>ol>li]:mb-2 [&>ol>li]:font-medium
                  [&>blockquote]:my-6 [&>blockquote]:border-l-4 [&>blockquote]:border-[#F8D300] [&>blockquote]:pl-4 [&>blockquote]:italic
                  [&>a]:text-[#004B8D] [&>a]:font-bold [&>a]:underline [&>a:hover]:text-[#E60023]
                  [&>img]:my-6 [&>img]:border-4 [&>img]:border-black
                  [&>pre]:my-6 [&>pre]:border-4 [&>pre]:border-black [&>pre]:bg-[#111] [&>pre]:p-4 [&>pre]:text-white
                  [&>code]:bg-[#F8D300] [&>code]:px-1 [&>code]:font-mono"
                dangerouslySetInnerHTML={{ __html: post.content.rendered }}
              />
            </Card>

            {/* Back Link */}
            <div className="mt-8">
              <Button
                variant="secondary"
                className="gap-2"
                onClick={() => navigate("/blog")}
              >
                <ArrowLeft size={18} strokeWidth={3} />
                Back to all posts
              </Button>
            </div>
          </article>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t-4 border-black bg-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="font-bold text-gray-600">
            © 2024 GlobalMeme. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
