async function test() {
  try {
    const res = await fetch('http://localhost:3000/overview');
    console.log('Status:', res.status);
    const html = await res.text();
    const links = [...html.matchAll(/<link[^>]+>/g)].map(m => m[0]);
    console.log('Link tags:');
    links.forEach(l => console.log('  ', l));

    const cssHrefMatch = html.match(/href="(\/_next\/static\/css\/[^"]+)"/);
    if (cssHrefMatch) {
      const cssUrl = 'http://localhost:3000' + cssHrefMatch[1];
      console.log('Fetching CSS from:', cssUrl);
      const cssRes = await fetch(cssUrl);
      console.log('CSS Status:', cssRes.status, 'Content-Type:', cssRes.headers.get('content-type'));
      const cssText = await cssRes.text();
      console.log('CSS size:', cssText.length);
    } else {
      console.log('NO CSS LINK FOUND IN HTML!');
    }
  } catch (err) {
    console.error('Test error:', err);
  }
}
test();
