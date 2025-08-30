export function isMobile(): boolean {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

export function getDeviceType(): 'mobile' | 'desktop' {
  return isMobile() ? 'mobile' : 'desktop';
}