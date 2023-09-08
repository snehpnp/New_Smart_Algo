
//  1= Market Hub, 2=  'Alice Blue, 3= Master Trust , 4 = Motilal Oswal, 5=Zebull ,
//  6=IIFl , 7=Kotak , 8=Mandot , 9=Choice, 10=Anand Rathi, 11=B2C, 13=Angel,
// 13 =Fyers , 14 = 5-Paisa , 15 Zerodha ,


export const loginWithApi = (broker_id, UserDetails) => {
    if (broker_id === "1" || broker_id === 1) {
        alert("broker-1")
    }
    if (broker_id === "2" || broker_id === 2) {
        window.location.href = `https://ant.aliceblueonline.com/?appcode=${UserDetails.app_id}`;
        console.log("Alice Blue");
        console.log("UserDetails", UserDetails);
    }
    if (broker_id === "3" || broker_id === 3) {
        alert("broker-3")
    }
    if (broker_id === "4" || broker_id === 4) {
        alert("broker-4")
    }
    if (broker_id === "5" || broker_id === 5) {
        alert("broker-5")
    }
    if (broker_id === "6" || broker_id === 6) {
        alert("broker-6")
    }
    if (broker_id === "7" || broker_id === 7) {
        alert("broker-7")
    }
    if (broker_id === "8" || broker_id === 8) {
        alert("broker-8")
    }
    if (broker_id === "9" || broker_id === 9) {
        alert("broker-9")
    }
    if (broker_id === "10" || broker_id === 10) {
        alert("broker-10")
    }
    if (broker_id === "11" || broker_id === 11) {
        alert("broker-11")
    }

    if (broker_id === "12" || broker_id === 12) {
        alert("broker-12")
    }

    if (broker_id === "13" || broker_id === 13) {
        alert("broker-13")
    }

    if (broker_id === "15" || broker_id === 15) {
        alert("broker-15")
    }
    if (broker_id === "16" || broker_id === 16) {
        alert("broker-16")
    }
    if (broker_id === "17" || broker_id === 17) {
        alert("broker-17")
    }
    if (broker_id === "19" || broker_id === 19) {
        alert("broker-19")
    }
    if (broker_id === "20" || broker_id === 20) {
        alert("broker-20")
    }
    if (broker_id === "21" || broker_id === 21) {
        alert("broker-21")
    }
    if (broker_id === "22" || broker_id === 22) {
        alert("broker-22")
    }


}