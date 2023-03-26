import Head from "next/head";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import { GetStaticProps, NextPage } from "next";
import { ApolloClient, gql, InMemoryCache } from "@apollo/client";

const inter = Inter({ subsets: ["latin"] });

export const getStaticProps: GetStaticProps = async () => {
  const client = new ApolloClient({
    uri: "https://spacex-production.up.railway.app/",
    cache: new InMemoryCache(),
  });

  const { data } = await client.query<Launches>({
    query: gql`
      query GetLaunches {
        launchesPast(limit: 12) {
          id
          launch_date_local
          links {
            article_link
          }
          rocket {
            rocket_name
          }
          mission_name
        }
      }
    `,
  });

  return {
    props: {
      launches: data.launchesPast,
    },
  };
};

type Launch = {
  id: string;
  launch_date_local: string;
  links: {
    article_link: string;
  };
  rocket: {
    rocket_name: string;
  };
  mission_name: string;
};

type Launches = {
  launchesPast: Launch[];
};

const Home: NextPage<{ launches: Launch[] }> = ({ launches }) => {
  return (
    <>
      <Head>
        <title>Space X to the Mars</title>
        <meta name="description" content="Let's go to Mars" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div className={styles.center}>
          <h1>SpaceX Launches</h1>
        </div>
        <div className={styles.description}>
          <h3>Check out past SpaceX launches!</h3>
        </div>
        <div className={styles.grid}>
          {launches.map((launch: Launch) => (
            <a
              key={launch.id}
              href={launch.links.article_link}
              className={styles.card}
              target="_blank"
              rel="noopener noreferrer"
            >
              <h2 className={inter.className}>
                {launch.mission_name}
                <span>-&gt;</span>
              </h2>
              <p className={inter.className}>{launch.rocket.rocket_name}</p>
              <p className={inter.className}>
                Launch Date:{" "}
                {new Date(launch.launch_date_local).toLocaleDateString()}
              </p>
            </a>
          ))}
        </div>
      </main>
    </>
  );
};
export default Home;
