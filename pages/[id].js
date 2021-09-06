import { useRouter } from "next/dist/client/router";
import { supabase } from "../db";
import { NextSeo } from "next-seo";
import { useEffect } from "react";

const Redirect = ({ links }) => {
  const router = useRouter();
  useEffect(() => {
    router.replace(links.og_link);
  }, []);
  return (
    <NextSeo
      title={links.data.title}
      description={links.data.description.simpleText}
      openGraph={{
        url: "https://upgrab.in",
        title: links.data.title,
        description: links.data.description.simpleText,
        images: [
          {
            url: links.data.thumbnail,
            width: 1920,
            height: 1080,
            alt: `hero image`,
          },
        ],
        site_name: "linkr",
      }}
      twitter={{
        handle: "@pratamanitej",
        site: "@linkr",
        cardType: "summary_large_image",
      }}
    />
  );
};

export default Redirect;

export async function getServerSideProps({ params }) {
  const { id } = params;

  let { data: links, error } = await supabase
    .from("links")
    .select("*")
    .eq("shorten_link", id);

  return {
    props: {
      links: links[0],
    },
  };
}
