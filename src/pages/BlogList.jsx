import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, BookOpen } from "lucide-react";
import { getPosts } from "../services/wordpress";
import { Badge } from "@/components/design/Badge";
import { Button } from "@/components/design/Button";
import { Card } from "@/components/design/Card";

export function BlogList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchPosts() {
      try {
        const data = await getPosts();
        setPosts(data);
      } catch (err) {
        setError(err.message || "Failed to load posts");
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

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
            onClick={() => navigate("/")}
          >
            <ArrowLeft size={18} strokeWidth={3} />
            Back home
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="mb-12 max-w-3xl space-y-4">
          <Badge color="bg-[#004B8D]">Latest Posts</Badge>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight">
            Stories from the meme frontlines.
          </h1>
          <p className="text-base sm:text-lg font-semibold text-gray-600">
            Tips, tutorials, and tales from the world of multilingual meme
            creation.
          </p>
        </div>

        {loading && (
          <Card className="bg-white">
            <div className="flex items-center gap-3">
              <div className="h-6 w-6 animate-spin rounded-full border-4 border-[#F8D300] border-t-transparent" />
              <p className="font-bold uppercase tracking-wide text-gray-600">
                Loading posts...
              </p>
            </div>
          </Card>
        )}

        {error && (
          <Card className="bg-[#E60023]">
            <p className="font-bold text-white">Error: {error}</p>
          </Card>
        )}

        {!loading && !error && (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => {
              const featuredImage =
                post._embedded?.["wp:featuredmedia"]?.[0]?.source_url;

              return (
                <Link key={post.id} to={`/blog/${post.id}`} className="group">
                  <Card className="h-full bg-white transition-all hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none">
                    {featuredImage && (
                      <div className="relative -m-6 mb-4 overflow-hidden border-b-4 border-black">
                        <img
                          src={featuredImage}
                          alt=""
                          className="h-48 w-full object-cover transition-transform group-hover:scale-105"
                        />
                      </div>
                    )}
                    <div className="space-y-3">
                      <h2
                        className="text-xl font-black uppercase tracking-tight text-[#111] group-hover:text-[#004B8D]"
                        dangerouslySetInnerHTML={{
                          __html: post.title.rendered,
                        }}
                      />
                      <div
                        className="text-sm font-medium text-gray-600 line-clamp-3 [&>p]:m-0"
                        dangerouslySetInnerHTML={{
                          __html: post.excerpt.rendered,
                        }}
                      />
                      <p className="text-xs font-black uppercase tracking-widest text-[#E60023]">
                        Read more →
                      </p>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}

        {!loading && !error && posts.length === 0 && (
          <Card className="bg-[#F8D300]">
            <p className="font-bold text-black">
              No posts found. Check back soon!
            </p>
          </Card>
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
