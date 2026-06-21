const { WebcastPushConnection } = require("tiktok-live-connector");

const username = "lily180321"; // The streamer from the screenshot

const tiktokLiveConnection = new WebcastPushConnection(username);

tiktokLiveConnection.connect().then(state => {
    console.info(`Connected to roomId ${state.roomId}`);
    console.info(`Room Info like_count: ${state.roomInfo.like_count}`);
    console.info(`Room Info viewer_count: ${state.roomInfo.user_count || state.roomInfo.viewer_count}`);

    setInterval(async () => {
        try {
            const roomInfo = await tiktokLiveConnection.getRoomInfo();
            console.log("Polled roomInfo like_count:", roomInfo.like_count, "user_count:", roomInfo.user_count);
        } catch (e) {
            console.error(e);
        }
    }, 5000);
}).catch(err => {
    console.error('Failed to connect', err);
});
