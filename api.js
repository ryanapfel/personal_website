export async function getWebsiteInfo(url) {
  let links = await fetch(`${url}/infos`);
  let data = await links.json();
  return data[0];
}


export async function getArticle(url, id) {
  let links = await fetch(`${url}/contents/${id}`);
  let data = await links.json();
  return data;
}

export async function getRecentArticles(url, num) {
  let links = await fetch(`${url}/contents?_sort=id:DESC&_limit=${num}`);
  let data = await links.json();
  return data;
}

export async function getAbout(url) {
  let links = await fetch(`${url}/abouts`);
  let data = await links.json();
  return data[0];
}
