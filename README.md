# Orantio - A Mobile Messaging Application

Orantio is a mobile messaging platform, designed to enhance your communication experience through seamless connectivity and powerful features. Whether you're chatting one-on-one or collaborating in large groups, our platform provides an intuitive and secure space for all your conversations. With real-time online presence and support for multiple devices, you'll never miss a moment—stay connected effortlessly across all your favorite devices.

> This is the final group project from a course in VNUHCM - University of Science - CS426 - Mobile Device Application Development.

![image](https://github.com/user-attachments/assets/81a1a1a5-3806-40c1-8a49-928236ac4e5d)

Project Documentation (Report):
[Orantio - Final Project Report](https://docs.google.com/document/d/1JKH1tpbLIcx2oh7RjDSPgTujh9yx4NycOP6JxVRhfdg/edit?usp=sharing)

## Features

- **Real-time Messaging**: Send and receive messages instantly with real-time updates.
- **Server-based Architecture**: Connect with others through servers and channels for organized communication.
- **Server Management**: Customize your servers with channels, roles, and permissions.
- **Emojis and Reactions**: Express yourself with custom emojis and reactions in your messages.
- **Attachments**: Share images, videos, and files with your friends.
- **Search Functionality**: Find messages quickly and easily with the advanced search feature.
- **Friend System**: Add friends to your contact list and start chatting with them.
- **Direct Messaging**: Chat one-on-one with your friends.
- **Online Presence**: See who's online and available to chat in real-time.
- **Multiple Devices**: Stay connected across all your devices with seamless synchronization.
- **Push Notifications**: Receive notifications for new messages, mentions, and more even when the app is closed.
- **Profile Customization**: Personalize your profile with a custom avatar, status, and more.

## Releases

The application is currently available on both Android and iOS, you can download it from: [Releases](https://drive.google.com/drive/folders/1f4hMgw-ejAeCoTmEvTNTC5w5bsk0XVha?usp=drive_link).

## Demonstration

Here is the video demo of the project on YouTube: [CS426 - Orantio Demonstration](https://youtu.be/yxmciwkagPo).

## Repositories

The project contains two repositories:

- [Mobile Frontend](https://github.com/mobile-apcs-ntploc21/mobile-frontend): This repository contains all the source code for the Mobile Application that supports both Android and iOS, written in React Native.
  - Number of commits (last updated 15/09/2024): 535 commits.
  - Link to [commit history](https://github.com/mobile-apcs-ntploc21/mobile-frontend/commits/master/).
- [Mobile Backend](https://github.com/mobile-apcs-ntploc21/mobile-backend): This repository contains all the source code for the backend system that handles all the requests from client (Mobile Application).
  - Number of commits (last updated 14/09/2024): 265 commits.
  - Link to [commit history](https://github.com/mobile-apcs-ntploc21/mobile-backend/commits/master/).

## License

This project is licensed under the GNU General Public License v3.0 - see the [LICENSE](https://github.com/mobile-apcs-ntploc21/mobile-backend/blob/master/LICENSE) file for details.

## Technologies

### Mobile:

- [React Native](https://reactnative.dev/)
- [Expo](https://expo.dev/)

### Backend (Server):

- [ExpressJs](https://expressjs.com/)
- [NodeJS](https://nodejs.org/en/)
- [Apollo GraphQL](https://www.apollographql.com/)

### Deployment:

- [Amazon Lightsail](https://aws.amazon.com/free/compute/lightsail)
- [Docker](https://www.docker.com/)
- [NGiNX](https://nginx.org/en/)
- [Amazon Route53](https://aws.amazon.com/route53/) (DNS Service)

### Database

- [MongoDB](https://www.mongodb.com/lp/cloud/atlas/try4)

### Content Storage (Images, Attachments, etc)

- [Amazon S3](https://aws.amazon.com/s3/)
- [Amazon CloudFront](https://aws.amazon.com/cloudfront/) (Content Delivery Network - CDN)

## Installation (Frontend)

### Android SDK

Start by installing the necessary dependencies for Android development, including the Android Studio IDE, Android SDK, and Java Development Kit (JDK). You can follow the instructions on the [React Native documentation](https://reactnative.dev/docs/environment-setup).

### Running the project

1. Clone the repository

```bash
git clone https://github.com/mobile-apcs-ntploc21/mobile-frontend.git
```

2. Install the dependencies

```bash
cd mobile-frontend
npm install
```

3. Set up the environment

Copy the `.env.local.template` file to `.env.local` and fill in the necessary information.

Also, you need to add the `google-services.json` and `fcm-key.json` files to the root of the project to enable Firebase services. For more information, please refer to the [Firebase documentation](https://firebase.google.com/docs/android/setup).

4. Run the project

Currently, the project is configured to run on Android devices. You can run the project using the following command:

```bash
npx expo run:android
```

## Contributor

The project could not have been completed without these developers!

- 22125050 - Nguyễn Thanh Phước Lộc
  - ntploc22@apcs.fitus.edu.vn
- 22125068 - Trương Chí Nhân
  - tcnhan22@apcs.fitus.edu.vn
- 22125076 - Nguyễn Hoàng Phúc
  - nhphuc221@apcs.fitus.edu.vn
- 22125115 - Ngô Hoàng Tuấn
  - nhtuan22@apcs.fitus.edu.vn
- 22125121 - Đinh Hoàng Việt
  - dhviet22@apcs.fitus.edu.vn
