import { useRouter } from "next/dist/client/router";
import Link from "next/link";
import { supabase } from "../db";
import { useState } from "react";
import Image from "next/image";
import { NextSeo } from "next-seo";

export default function Index({ links }) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    // check if a url is a youtube url or not regex
    const regex =
      /(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?/;
    const match = url.match(regex);

    if (match) {
      setLoading(true);
      const response = await fetch(`/api/getInfo?url=${url}`);
      const json = await response.json();
      const videoId = url.match(
        /(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]+)/
      );

      const { data, error } = await supabase
        .from("links")
        .insert([{ og_link: url, shorten_link: videoId[1], data: json }]);

      setLoading(false);

      if (error) alert(error.message);
      if (data) {
        router.push(
          `http://twitter.com/share?text=${json.title}&url=https://linkrrr.vercel.app/${videoId[1]}`
        );
      }
    } else alert("Please enter a valid youtube url");
  };

  return (
    <div className="container">
      <NextSeo
        title="Linkr"
        description="Show YouTube Thumbnail preview in Twitter mobile"
        openGraph={{
          url: "https://linkrrr.vercel.app/",
          title: "Linkr - Show YouTube Thumbnail preview in Twitter mobile",
          images: [
            {
              url: "https://og-image.vercel.app/**Linkr**%20-%20Show%20YouTube%20Thumbnail%20preview%20in%20Twitter%20mobile%20.png?theme=light&md=1&fontSize=100px&images=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fvercel-triangle-black.svg",
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
      <div className="nav">
        <p>Linkr 🚀</p>
        <Link href="https://rzp.io/l/tcyc111j">
          <a className="donate-btn">Donate</a>
        </Link>
      </div>

      {/* hero */}
      <h1 className="hero-text">
        Share YouTube videos to Twitter with thumbnail preview
      </h1>

      <input
        className="inp"
        type="text"
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Enter YouTube video URL"
      />
      <button disabled={loading} className="btn" onClick={handleSubmit}>
        {loading ? "Loading..." : "Share to twitter"}
      </button>

      {/* links */}
      <h1 style={{ textAlign: "center" }}>Recent links</h1>
      <div className="links">
        {links.map((link) => (
          <div className="link" key={link.id}>
            <Link href={`/${link.shorten_link}`}>
              <a>
                <Image
                  src={link.data.thumbnail}
                  width={40}
                  height={25}
                  layout="responsive"
                  alt="thumbnail"
                />
              </a>
            </Link>
            <div className="row">
              <p>{link.data.title}</p>
              <button
                className="copy"
                onClick={async () => {
                  await navigator.clipboard.writeText(
                    `https://linkrrr.vercel.app/${link.shorten_link}`
                  );
                  alert("Copied!");
                }}
              >
                Copy URL
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export async function getServerSideProps() {
  let { data: links, error } = await supabase.from("links").select("*");

  return {
    props: {
      links: links,
    },
  };
}
