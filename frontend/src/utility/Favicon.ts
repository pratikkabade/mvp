export const setFavicon = (url: any) => {
   const link = document.createElement('link');
   const oldLink = document.querySelector('link[rel="icon"]');
   if (oldLink) {
      document.head.removeChild(oldLink);
   }
   link.rel = 'icon';
   link.href = url;
   document.head.appendChild(link);
};