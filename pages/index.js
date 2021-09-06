import { useRouter } from "next/dist/client/router";
import Link from "next/link";
import { supabase } from "../db";
import { useState } from "react";
import { nanoid } from "nanoid";

export default function Index() {
  const [url, setUrl] = useState("");
  const [data, setData] = useState("");
  const router = useRouter();

  const handleSubmit = async () => {
    const response = await fetch(`/api/getInfo?url=${url}`);
    const json = await response.json();
    const videoId = url.match(
      /(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]+)/
    );

    const { data, error } = await supabase
      .from("links")
      .insert([{ og_link: url, shorten_link: videoId, data: json }]);

    if (error) alert(error.message);
    if (data) {
      router.push(
        `http://twitter.com/share?text=${json.title}&url=https://linkrrr.vercel.app/${videoId}`
      );
    }
  };

  return (
    <div className="container">
      <div className="nav">
        <p>Linkr 🚀</p>
        <Link href="/">
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
      <button className="btn" onClick={handleSubmit}>
        Share to twitter
      </button>

      {data && <p>{data}</p>}
    </div>
  );
}
