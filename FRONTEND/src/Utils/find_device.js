
export const  check_Device = () => {
    const userAgent = navigator.userAgent;
    const isMobileApp = /Mobile|Android|iPhone/i.test(userAgent);
    if (isMobileApp) {
      console.log('User is using the mobile app.');
    } else {
      console.log('User is using the web app.');
    }
}


