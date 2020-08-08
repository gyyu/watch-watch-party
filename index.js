const clientId = 'YOUR_CLIENT_ID_HERE';
const activeWin = require('active-win');
const RPC = require('discord-rpc');
const client = new RPC.Client({ transport: 'ipc' });
const request = require('request');
const ytApiKey = 'YOUR_API_KEY_HERE';
RPC.register(clientId);

async function getWatchInformation() {
  console.log('Grabbing browser information');
  const window = activeWin.sync();

  if (!window) {
    return;
  }

  try {
    if (window.owner.name.includes('Google Chrome')) {
      const url = window.url;
      const params = url.split('/');
      const liveIndex = params.indexOf('live');
      const vodIndex = params.indexOf('vod');
      const vodsIndex = params.indexOf('vods');

      if (liveIndex > 0) {
        const slug = params[liveIndex + 1]
        const league = slug.toUpperCase();

        client.setActivity({
          details: `Watching ${league}`,
          state: 'Watching a live game',
          largeImageKey: 'lol-esports',
          largeImageText: 'lolesports.com',
          smallImageKey: slug,
          smallImageText: league,
          instance: false
        }).catch(err => {
          console.log(err);
        });
      } else if (vodIndex > 0) {
        const id = params[vodIndex + 3];

        const url = "https://www.googleapis.com/youtube/v3/videos?part=snippet&id=" + id + "&key=" + ytApiKey;

        request({
            method: 'GET',
            url: url
        }, function (err, response, text) {
            if (err) {
                return;
            }

            const json = JSON.parse(text);
            if (!json || json.items < 1) {
              return;
            }           
            const title = json.items[0].snippet.title;
            client.setActivity({
              details: 'Watching a VOD',
              state: title,
              largeImageKey: 'lol-esports',
              largeImageText: 'lolesports.com',
              instance: false
            }).catch(err => {
              console.log(err);
            });
        });
      } else if (vodsIndex > 0) {
        client.setActivity({
          details: 'Browsing lolesports.com',
          state: 'Looking at VODs',
          largeImageKey: 'lol-esports',
          largeImageText: 'lolesports.com',
          instance: false
        }).catch(err => {
          console.log(err);
        });
      } else {
        client.setActivity({
          details: 'Browsing lolesports.com',
          state: 'Looking at content',
          largeImageKey: 'lol-esports',
          largeImageText: 'lolesports.com',
          instance: false
        }).catch(err => {
          console.log(err);
        });
      }
    }
  } catch (e) {
    console.log(e);
  };
}

client.on('ready', () => {
  console.log('Connected to Discord');

  setInterval(() => {
    getWatchInformation();
  }, 1000);
});

client.login({clientId}).catch(console.error);