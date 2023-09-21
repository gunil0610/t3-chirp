import type { NextPage } from "next";
import {
  GetStaticPaths,
  GetStaticPropsContext,
  InferGetStaticPropsType,
} from "next";
import Head from "next/head";
import { api } from "~/utils/api";

import { createServerSideHelpers } from "@trpc/react-query/server";
import superjson from "superjson";
import { prisma } from "~/server/db";
import { appRouter } from "~/server/api/root";
import { PageLayout } from "~/components/layout";
import Image from "next/image";

const profilePicSize = 128;

type PageProps = InferGetStaticPropsType<typeof getStaticProps>;

const ProfilePage: NextPage<PageProps> = ({ username }) => {
  const { data, isLoading } = api.profile.getUserByUsername.useQuery({
    username,
  });

  if (isLoading) {
    console.log("loading");
  }
  if (!data) return <div>404</div>;

  return (
    <>
      <Head>
        <title>{data.username}</title>
      </Head>
      <PageLayout>
        <div className="relative h-36 bg-slate-600 ">
          <Image
            src={data.imageUrl}
            alt={`${data.username ?? ""}'s profile pic`}
            height={128}
            width={128}
            className={`absolute bottom-0 left-0 -mb-[64px] ml-4 rounded-full border-4 border-black bg-black`}
          />
        </div>

        <div className="h-[64px]"></div>
        <div className="p-4 text-2xl font-bold">{`@${data.username}`}</div>
        <div className="border-b border-slate-400"></div>
      </PageLayout>
    </>
  );
};

export async function getStaticProps(
  context: GetStaticPropsContext<{ slug: string }>,
) {
  const ssg = createServerSideHelpers({
    router: appRouter,
    ctx: { prisma, userId: null },
    transformer: superjson, // optional - adds superjson serialization
  });
  const slug = context.params?.slug;

  if (typeof slug !== "string") throw new Error("no slug");

  const username = slug.replace("@", "");

  // prefetch `post.byId`
  await ssg.profile.getUserByUsername.prefetch({ username });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      username,
    },
  };
}

export const getStaticPaths: GetStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};

export default ProfilePage;
