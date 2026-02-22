mport { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function PostPage({ params }: { params: { slug: string } }) {
  const post = await prisma.post.findUnique({
    where: { slug: params.slug },
    include: { author: { select: { name: true, email: true } }, topics: { include: { topic: true } } },
  });

  if (!post || !post.published) return notFound();

  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
      <h1>{post.title}</h1>
      <p style={{ opacity: 0.7 }}>
        {post.author.name ?? post.author.email} · {new Date(post.createdAt).toLocaleDateString("el-GR")}
      </p>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
        {post.topics.map((t) => (
          <span key={t.topicId} style={{ border: "1px solid #ddd", padding: "4px 8px", borderRadius: 999 }}>
            {t.topic.name}
          </span>
        ))}
      </div>

      <article style={{ whiteSpace: "pre-wrap", lineHeight: 1.6 }}>{post.content}</article>
    </main>
  );
}
