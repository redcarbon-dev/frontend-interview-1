import { type NextPage } from "next";
import Head from "next/head";

import { api } from "~/utils/api";

const Home: NextPage = () => {
  const q = api.incidents.listIncindets.useQuery({
    skip: 0,
    take: 200,
    order: {
      severity: "desc",
    },
    filter: {
      // assegnees: ["yoda@redcarbon.ai"],
    },
  });

  return (
    <>
      <Head>
        <title>RedCarbon Interview</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <pre className="m-2 p-2 ring-1">{JSON.stringify(q.data, null, 2)}</pre>
      </main>
    </>
  );
};

export default Home;
