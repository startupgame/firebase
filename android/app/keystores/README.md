# Android App Signing Information

This directory contains the keystore files for signing the Android app.

## Production Keystore

- **File**: upload-key.keystore
- **Alias**: upload-alias
- **Store Password**: [secure-password]
- **Key Password**: [secure-password]

## Important Notes

1. **DO NOT commit the keystore passwords to version control!**
2. **DO backup the keystores and passwords securely!**
3. When using Google Play App Signing, this keystore is used as the "upload key".

## Google Play App Signing

For production releases, you should enable Google Play App Signing. This allows Google to manage the signing key used to verify your app, adding an extra layer of security.

When using Google Play App Signing:
- Google maintains the official signing key for your app
- You use the upload key (in this directory) to sign your app before uploading
- Google re-signs your app with the official key before distributing to users

## Setup Instructions

1. Create a Google Play Developer account if you don't have one
2. Create your app on Google Play Console
3. Go to Setup > App integrity > App signing
4. Follow the enrollment instructions for Google Play App Signing
