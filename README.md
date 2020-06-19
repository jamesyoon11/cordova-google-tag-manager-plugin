# cordova-google-tag-manager-plugin
> Cordova plugin for Google Tag Manager for Android/iOS

## Installing

You can install the latest version of the plugin directly from git through the Cordova CLI:
```bash
cordova plugin add https://github.com/jamesyoon11/cordova-google-tag-manager-plugin.git
```

## Plugin variables
- `ANDROID_CONTAINER_LOCATION` - The folder location where the GTM container file for Android (ex GTM-xxxxx.json)
- `IOS_CONTAINER_LOCATION` - The folder location where the GTM container file for iOS (ex GTM-xxxxx.json)

**Example Usage:**
```bash
cordova cordova-google-tag-manager-plugin \
        --variable ANDROID_CONTAINER_LOCATION=../ios/container \
        --variable IOS_CONTAINER_LOCATION=../android/container \
```        

