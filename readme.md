# deploy build in ease

(optionally to register a new eas device (not necessary))
eas device:create

### promoting to testflight

`update version in ios/info.plist`
CFBundleVersion ->
CFBundleShortVersionString ->
eas build --platform ios

eas submit -p ios

### Go to app in the app store

https://appstoreconnect.apple.com/apps/6504051806/testflight/ios
