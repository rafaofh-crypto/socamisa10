import axios from "axios";

async function runTestAndAnalyze() {
  const testSlugs = [
    "sovaco-da-pantera",
    "onodi-floripa",
    "real-barreiros-fc",
    "fortaleza-da-ilha",
    "futcafa"
  ];

  const headers = {
    "Accept": "application/json, text/plain, */*",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
    "Referer": "https://cartola.globo.com/",
    "Origin": "https://cartola.globo.com"
  };

  for (const slug of testSlugs) {
    const urls = [
      `https://api.cartola.globo.com/time/slug/${slug}`,
      `https://api.cartola.globo.com/time/slug/${slug}/18`,
      `https://api.cartola.globo.com/time/slug/${slug}/17`
    ];

    for (const url of urls) {
      console.log(`Trying URL: ${url}`);
      try {
        const res = await axios.get(url, { headers, timeout: 5000 });
        console.log(`STATUS: ${res.status}`);
        if (res.status === 200) {
          console.log(`SUCCESS! DataKeys: ${Object.keys(res.data).join(", ")}`);
          // Let's print out the pontos or time info
          console.log(`Points info: ${res.data.pontos ?? "N/A"}, Time info points: ${res.data.time?.pontos ?? "N/A"}`);
        } else {
          console.log(`Returned code ${res.status} but no content.`);
        }
      } catch (err: any) {
        console.log(`FAILED! Status: ${err.response?.status || "None"}. Message: ${err.message}`);
      }
    }
  }
}

runTestAndAnalyze();
