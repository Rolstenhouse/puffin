# deploy build in ease

(optionally to register a new eas device (not necessary))
eas device:create

### promoting to testflight

`update version in ios/info.plist`
CFBundleVersion ->
CFBundleShortVersionString ->

## cloud

eas build --platform ios
eas submit -p ios

## local

eas build --platform ios --local
eas submit -p ios --path=<path>

example path ./build-1717799029031.ipa

### Go to app in the app store

https://appstoreconnect.apple.com/apps/6504051806/testflight/ios
