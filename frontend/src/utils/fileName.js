export const getAssetUrl = (fileUrl) => {
  if (!fileUrl || /^(https?:|blob:|data:)/i.test(fileUrl)) return fileUrl;

  const apiUrl = import.meta.env.VITE_API_URL?.replace(/\/+$/, '');
  const assetBaseUrl = apiUrl?.replace(/\/api$/, '');
  if (!assetBaseUrl) return fileUrl;

  return `${assetBaseUrl}${fileUrl.startsWith('/') ? fileUrl : `/${fileUrl}`}`;
};

export const getFileNameFromUrl = (fileUrl, fallback = 'Resume') => {
  if (!fileUrl) return fallback;

  try {
    const pathname = new URL(fileUrl, window.location.origin).pathname;
    const fileName = decodeURIComponent(pathname.split('/').pop() || '');
    return fileName.replace(/^\d+-\d+-/, '') || fallback;
  } catch {
    return fallback;
  }
};
