# deploy to local phone

eas build --profile development --platform ios

->
eas device:create


### promoting to testflight

npm install -g eas-cli