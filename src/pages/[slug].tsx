import type { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const slug = params?.slug;

  if (typeof slug !== "string") {
    return { notFound: true };
  }

  return {
    redirect: {
      destination: `/posts/${slug}`,
      permanent: false,
    },
  };
};

export default function LegacyPostSlugRedirectPage() {
  return null;
}
