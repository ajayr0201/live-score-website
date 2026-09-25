useEffect(() => {
  const userAgent = navigator.userAgent || '';
  
  if (/android/i.test(userAgent)) {
    // Automatic app kholne ki koshish mat karo
    // Instead, download.html par bhejo with video code
    const timer = setTimeout(() => {
      window.location.href = '/download.html?code=' + params.code;
    }, 500);
  }
}, []);
