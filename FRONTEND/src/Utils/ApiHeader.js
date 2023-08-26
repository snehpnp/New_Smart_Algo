export const header = (token) => {

    const header = {
        'Content-Type': 'application/json',
        "x-access-token": token
    }
    return header
}