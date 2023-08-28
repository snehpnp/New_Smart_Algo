export const  check_Device = () => {
    const userAgent = navigator.userAgent;
    const isMobileApp = /Mobile|Android|iPhone/i.test(userAgent);
    if (isMobileApp) {
      return "App"
    } else {
     return 'Web'
    }
}


