import { useRouter } from "next/dist/client/router";
import Link from "next/link";
import { supabase } from "../db";
import { useState } from "react";
import { nanoid } from "nanoid";

export default function Index() {
  const [url, setUrl] = useState("");
  const [data, setData] = useState("");
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
      <button disabled={loading} className="btn" onClick={handleSubmit}>
        {loading ? "Loading..." : "Share to twitter"}
      </button>

      {data && <p>{data}</p>}
    </div>
  );
}
