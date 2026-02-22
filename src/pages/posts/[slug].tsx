import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Head from "next/head";
import { prisma } from "@/lib/prisma";

type PostPageProps = {
  post: {
    id: string;
    title: string;
    content: string;
    createdAt: string;
    author: {
      name: string | null;
      email: string;
    };
    topics: Array<{
      topicId: string;
      topicName: string;
    }>;
  };
};

export const getServerSideProps: GetServerSideProps<PostPageProps> = async ({ params }) => {
  const slug = params?.slug;

  if (typeof slug !== "string") {
    return { notFound: true };
  }

  const post = await prisma.post.findUnique({
    where: { slug },
    include: {
      author: { select: { name: true, email: true } },
      topics: { include: { topic: { select: { name: true } } } },
    },
  });

  if (!post || !post.published) {
    return { notFound: true };
  }

  return {
    props: {
      post: {
        id: post.id,
        title: post.title,
        content: post.content,
        createdAt: post.createdAt.toISOString(),
        author: {
          name: post.author.name,
          email: post.author.email,
        },
        topics: post.topics.map((t) => ({
          topicId: t.topicId,
          topicName: t.topic.name,
        })),
      },
    },
  };
};

export default function PostPage({
  post,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <>
      <Head>
        <title>{post.title} | Sosyall Philosophy</title>
      </Head>

      <main style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
        <h1>{post.title}</h1>
        <p style={{ opacity: 0.7 }}>
          {post.author.name ?? post.author.email} · {new Date(post.createdAt).toLocaleDateString("el-GR")}
        </p>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
          {post.topics.map((t) => (
            <span
              key={t.topicId}
              style={{ border: "1px solid #ddd", padding: "4px 8px", borderRadius: 999 }}
            >
              {t.topicName}
            </span>
          ))}
        </div>

        <article style={{ whiteSpace: "pre-wrap", lineHeight: 1.6 }}>{post.content}</article>
      </main>
    </>
  );
}
