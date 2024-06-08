.PHONY: deploy

# The path to your plist file
PLIST=./ios/puffin/Info.plist


deploy:
	@echo "Incrementing build number..."
	@/usr/libexec/PlistBuddy -c "Print :CFBundleVersion" $(PLIST) | awk '{print $$1 + 1}' | xargs -I {} /usr/libexec/PlistBuddy -c "Set :CFBundleVersion {}" $(PLIST)
	@echo "Build number updated."
	@echo "Running eas build..."
	eas build --platform ios --local 
	@echo "Build complete."
	@echo "Running eas submit..."
	@make submit
	# @LATEST_IPA=$$(ls -t *.ipa | head -n 1); \
	# echo "Submitting $$LATEST_IPA to EAS..."; \
	# eas submit -p ios --path="$$LATEST_IPA"
	# @echo "Submit complete."

submit:
	@echo "Running eas submit..."
	@LATEST_IPA=$$(ls -t *.ipa | head -n 1); \
	echo "Submitting $$LATEST_IPA to EAS..."; \
	eas submit -p ios --path="$$LATEST_IPA"