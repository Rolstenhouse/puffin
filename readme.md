# deploy build in ease

(optionally to register a new eas device (not necessary))
eas device:create

### promoting to testflight

`update version in app.json`
eas build --platform ios

eas submit -p ios
