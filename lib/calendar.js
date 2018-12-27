const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
const { cal } = require('../config');

// If modifying these scopes, delete credentials.json.
const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];
const TOKEN_PATH = 'credentials.json';

// Load client secrets from a local file.
function calendarRequest( handle ) {
    return rej => {
        try {
            return authorize(cal, listEvents(handle)(rej));
        } catch (err) {
            return console.log('Error loading client secret file:', err);
        }
    };
}

//calendarRequest(n => console.log(n))(e => console.log(e))


/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 * @return {function} if error in reading credentials.json asks for a new one.
 */
function authorize(credentials, callback) {
    const {client_secret, client_id, redirect_uris} = credentials.installed;
    let token = {};
    const oAuth2Client = new google.auth.OAuth2(
        client_id, client_secret, redirect_uris[0]);

    // Check if we have previously stored a token.
    try {
        token = {"access_token":"ya29.Glv5Bci6a-J4GQdcuQf_zpu0oEffmD63iGntMaD00zgIDPM-SLxI_3TMMbD1FGoiyS7eaM52FBKP3O5zGJAcjP39gThMVMURgV82X9QvmrDaHEfwaGFN8Hkt4j36","token_type":"Bearer","refresh_token":"1/km04DNhvMbvfjiu0bbdubqXFGVygY2TAXNTvYcQwZTs","expiry_date":1531635355187};
    } catch (err) {
        return getAccessToken(oAuth2Client, callback);
    }
    oAuth2Client.setCredentials(token);
    callback(oAuth2Client);
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getAccessToken(oAuth2Client, callback) {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
    });
    console.log('Authorize this app by visiting this url:', authUrl);
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    rl.question('Enter the code from that page here: ', (code) => {
        rl.close();
        oAuth2Client.getToken(code, (err, token) => {
            if (err) return callback(err);
            oAuth2Client.setCredentials(token);
            // Store the token to disk for later program executions
            try {
                cal.token = token
                console.log('Token stored to', TOKEN_PATH);
            } catch (err) {
                console.error(err);
            }
            return callback(oAuth2Client);
        });
    });
}

/**
 * Lists the next 10 events on the user's primary calendar.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function listEvents( handle ) {
    return (rej) => (auth) => {
        const calendar = google.calendar({version: 'v3', auth});
        calendar.events.list({
            calendarId: 'primary',
            timeMin: (new Date()).toISOString(),
            maxResults: 10,
            singleEvents: true,
            orderBy: 'startTime',
        }, (err, res) => {
            if (err) return rej(err);
            return handle(res.data.items);

        });

    }
}

module.exports = { calendarRequest }
