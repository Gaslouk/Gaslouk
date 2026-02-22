// PAGES_ROUTER_OK
import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Head from "next/head";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

type PostListItem = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  createdAt: string; // ISO string για να περνάει safely στο props
};

export const getServerSideProps: GetServerSideProps<{ posts: PostListItem[] }> = async () => {
  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    select: { id: true, title: true, slug: true, excerpt: true, createdAt: true },
    take: 20,
  });

  return {
    props: {
      posts: posts.map((p) => ({
        ...p,
        createdAt: p.createdAt.toISOString(),
      })),
    },
  };
};

export default function HomePage({
  posts,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <>
      <Head>
        <title>Sosyall Philosophy</title>
        <meta name="description" content="Thoughts, essays, and discussions" />
      </Head>

      <main style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
        <h1 style={{ margin: 0 }}>Sosyall Philosophy (Pages Router)</h1>
        <p style={{ marginTop: 8, opacity: 0.75 }}>
          Δημοσιεύσεις φιλοσοφίας, ιδεών και διαλόγου.
        </p>

        <section style={{ marginTop: 24, display: "grid", gap: 16 }}>
          {posts.length === 0 ? (
            <p>Δεν υπάρχουν δημοσιευμένα posts ακόμη.</p>
          ) : (
            posts.map((p) => (
              <article
                key={p.id}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: 12,
                  padding: 16,
                }}
              >
                <h2 style={{ margin: 0, fontSize: 20 }}>
                  <Link href={`/posts/${p.slug}`}>{p.title}</Link>
                </h2>

                {p.excerpt ? <p style={{ marginTop: 10 }}>{p.excerpt}</p> : null}

                <small style={{ opacity: 0.7 }}>
                  {new Date(p.createdAt).toLocaleDateString("el-GR")}
                </small>
              </article>
            ))
          )}
        </section>
      </main>
    </>
  );
}