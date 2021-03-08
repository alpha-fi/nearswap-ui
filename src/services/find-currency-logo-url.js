export default function findCurrencyLogoUrl(newTokenIndex, tokens) {
  let hasImage = tokens[newTokenIndex].logoURL;

  // Only display image on button if it exists
  if (hasImage) {
    if (tokens[newTokenIndex].logoURL.startsWith("ipfs://")) {
      return (window.config.ipfsPrefix + tokens[newTokenIndex].logoURL.substring(7));
    } else {
      return tokens[newTokenIndex].logoURL;
    }
  }

  return "";
}