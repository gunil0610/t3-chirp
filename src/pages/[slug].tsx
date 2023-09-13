import { type NextPage } from "next";
import Head from "next/head";
import { api } from "~/utils/api";

import { createServerSideHelpers } from "@trpc/react-query/server";
import {
  GetStaticPaths,
  GetStaticPropsContext,
  InferGetStaticPropsType,
} from "next";
import { prisma } from "server/context";
import { appRouter } from "server/routers/_app";
import superjson from "superjson";
import { trpc } from "utils/trpc";

const ProfilePage: NextPage = () => {
  const { data, isLoading } = api.profile.getUserByUsername.useQuery({
    username: "gunil",
  });

  if (isLoading) return <div>Loading...</div>;
  if (!data) return <div>404</div>;

  return (
    <>
      <Head>
        <title>Profile</title>
      </Head>
      <main className="flex h-screen justify-center">
        <div>Profile View</div>
      </main>
    </>
  );
};

export async function getStaticProps(
  context: GetStaticPropsContext<{ id: string }>,
) {
  const helpers = createServerSideHelpers({
    router: appRouter,
    ctx: {},
    transformer: superjson, // optional - adds superjson serialization
  });
  const id = context.params?.id as string;
  // prefetch `post.byId`
  await helpers.post.byId.prefetch({ id });
  return {
    props: {
      trpcState: helpers.dehydrate(),
      id,
    },
    revalidate: 1,
  };
}
export default ProfilePage;
