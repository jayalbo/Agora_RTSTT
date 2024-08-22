# Agora Real-time Speech to Text Demo w/ Translation.

This is a simple demo of Agora Speech to Text SDK. It demonstrates how to use the Agora Speech to Text SDK to transcribe and translate speech to text.

## Prerequisites

- Agora.io Developer Account
- Agora App ID
- Enable Agora Real-time Speech to text service (v2 Console)

## Installation

1. Clone the repository to your local machine.
2. Install the dependencies by running `npm install`.
3. Copy the `.env.example` file to `.env` and fill in the `APP_ID`, `APP_KEY` (Customer Id), and `APP_SECRET` (Customer Secret) with your own values and set `LANG_INPUT` and `LANG_OUTPUT` to the language you want to transcribe from and to respectively.
4. Set appId in `public/audience.html` and `public/host.html` to your own Agora App ID.
5. Set Agora RTC Token in `public/audience.html` and `public/host.html` to your own Agora RTC Token (if required)
6. Run the application by running `npm start`.
7. Open the browser and navigate to `http://localhost:3000/host.html` to start the host.
8. Open the browser and navigate to `http://localhost:3000/audience.html` to start the audience.


## Resources

- Supported languages - https://docs.agora.io/en/real-time-stt/develop/supported-languages
- API Reference - https://docs.agora.io/en/real-time-stt/get-started/quickstart
- Customer Id & Customer Secret - https://console.agora.io/restfulApi
