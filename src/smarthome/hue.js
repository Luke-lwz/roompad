import huejay from "huejay";

"https://github.com/sqmk/huejay"

import localStorage from "../localStorage/localStorage.js";

let bridge;

async function getHueClient() {
    const bridges = await huejay.discover({ strategy: 'upnp' });
    if (!bridges?.[0]) return null
    bridge = bridges[0];




    // localStorage.removeItem("hue-user")
    const user = await getUser();


    let client = new huejay.Client({
        host: bridge.ip,
        username: user?.username || undefined
    });



    try {
        await client.bridge.isAuthenticated()
        console.log('Successful Hue authentication');
    } catch (err) {
        console.log('Could not authenticate Hue');
        localStorage.removeItem("hue-user");
        return null
    }


    return client;











}




async function getUser() {
    let user;

    user = JSON.parse(localStorage.getItem("hue-user") || "null");

    if (!user) {
        return await createUser() || null;
    }


    return user || null;
}





async function createUser() {
    if (!bridge) return null;
    let client = new huejay.Client({
        host: bridge?.ip,
    });
    try {
        let user = new client.users.User;

        user.deviceType = 'roompad'; // Default is 'huejay'

        const newUser = await client.users.create(user);

        if (newUser) {
            localStorage.setItem("hue-user", JSON.stringify(newUser?.attributes?.attributes));
            return newUser?.attributes?.attributes
        }

        return null
    } catch (err) {
        console.log("Philips Hue Bridge link button not pressed...")
        return null;
    }
}



export default getHueClient



