function calculateTotalTime(report) {
    // Regular expression to match time formats (e.g., "30 minutes", "1.30 hour", etc.)
    const timeRegex = /(\d+)(?:\.(\d+))?\s*(hour|minute)/gi;
  
    let totalMinutes = 0;
  
    report.match(timeRegex)?.forEach((time) => {
      const match = /(\d+)(?:\.(\d+))?\s*(hour|minute)/i.exec(time);
  
      if (match) {
        const hours = parseInt(match[1], 10); // Integer part
        const fractional = match[2] ? parseInt(match[2], 10) : 0; // Fractional part
        const unit = match[3].toLowerCase(); // Unit of time
  
        if (unit === "hour") {
          totalMinutes += hours * 60 + Math.round((fractional / 100) * 60);
        } else if (unit === "minute") {
          totalMinutes += hours; // Here, `hours` represents minutes.
        }
      }
    });
  
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
  
    return {
      totalMinutes,
      formatted: `${hours} hours and ${minutes} minutes`,
    };
  }
  
  // Example report
  const report = `
  1. Check Adonomist , Corebiz, Tradonn, Sumedha,Darixo - 30 minutes
     - Pm2 Status 
     - Database storage 
     - socket connection , live price update 
     - Target sl Hit and check 
  2.  New Algo Open Position view Date issue - 90 minutes 
  3.  Connect Box Option Chain price not show  - 35 minutes
  4.  Algo Sparks Broker Url Change - 10 minutes 
  5.  Fortune technos Angel client Broker Response and status check- 20 minutes 
  6.  Create New Thread in New Algo socket Releted - 120 minutes
  7.  Outbook Service Page account manager modal open with serve permissions - 10 minutes
  8.  New Algo Admin go to subadmin profile and edit client then show update button remove - 15 minutes
  9.  New Algo Admin to to user profile dont show multypal stratrgy resolved - 10 minutes
  10. New Algo Subadmin List If Status off then not redirect on profile solved - 20 minutes
  11.  New Algo Admin Client list Strategy wise use find filter Add - 90 minutes
  12.  Build Create and today all code update on New Algo and check - 30 minutes
  `;
  
  // Calculate total time
  const totalTime = calculateTotalTime(report);
  
  console.log(`Total Time: ${totalTime.formatted}`);
  