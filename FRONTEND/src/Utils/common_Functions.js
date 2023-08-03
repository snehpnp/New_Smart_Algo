export const getLastFourDigits = (mobileNumber, typeOtp) => {
    if (typeof mobileNumber === 'string' && mobileNumber.length >= 4) {
        if (typeOtp !== "" && typeOtp !== null && typeOtp !== undefined) {
            if (mobileNumber.slice(-4) === typeOtp) {
                return true
            }
            else {
                return 'OTP Not Match';
            }
        }
    }
}