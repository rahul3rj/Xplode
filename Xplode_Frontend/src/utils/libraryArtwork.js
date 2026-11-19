const imageUrl = (value) => {
  if (Array.isArray(value)) return imageUrl(value[0]);
  if (typeof value === "string") return value;
  return value?.url || value?.thumb || "";
};

export function storePortraitArtwork(game) {
  const id = game.steam_appid || game.appid || game.id;
  const portraitAssets = Array.isArray(game.portrait_image)
    ? game.portrait_image.flatMap((image) => typeof image === "string" ? [image] : [image?.url, image?.thumb])
    : [imageUrl(game.portrait_image)];
  const battlefield = Number(id) === 2807960
    ? "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2807960/9aa0e12a58caa5b90fc3f9d4d11085a35b1a65e4/library_capsule.jpg"
    : "";
  const hero = imageUrl(game.hero_image) || imageUrl(game.background_raw) || imageUrl(game.background) || imageUrl(game.header_image) || imageUrl(game.capsule_image);
  return [...new Set([battlefield, ...portraitAssets, imageUrl(game.portraitUrl), imageUrl(game.header_image), hero].filter((source) => typeof source === "string" && source && source !== "/default-game-cover.jpg"))];
}

export function libraryArtwork(game) {
  const id = game.steam_appid;
  const battlefield = Number(id) === 2807960
    ? "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2807960/9aa0e12a58caa5b90fc3f9d4d11085a35b1a65e4/library_capsule.jpg"
    : "";
  return [...new Set([
    ...(game._storePortraitSources || []),
    battlefield,
    imageUrl(game.portrait_image),
    id ? `https://cdn.cloudflare.steamstatic.com/steam/apps/${id}/library_600x900.jpg` : "",
    imageUrl(game.header_image),
    "/defaultbanner.jpg",
  ].filter(Boolean))];
}
