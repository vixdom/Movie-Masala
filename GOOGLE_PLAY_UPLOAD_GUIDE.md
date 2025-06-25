# Google Play Store Upload Guide - Movie Masala

## Step-by-Step Upload Process

### 1. Build Your App for Release
```bash
cd android
./release-build.sh
```
This creates:
- `app-release.aab` (Upload this to Play Store)
- `app-release.apk` (For testing)

### 2. Access Google Play Console
1. Go to https://play.google.com/console
2. Sign in with your Google Developer account
3. If first time: Pay $25 registration fee

### 3. Create New App
1. Click "Create app"
2. Fill out:
   - **App name**: "Movie Masala"
   - **Default language**: English (United States)
   - **App or game**: Game
   - **Free or paid**: Free

### 4. Upload Your App Bundle
1. Go to "Release" → "Production"
2. Click "Create new release"
3. Upload `app-release.aab` file
4. Add release notes: "Initial release of Movie Masala - Bollywood Word Search game"

### 5. Store Listing (Required)
**App details:**
- **App name**: Movie Masala
- **Short description**: "Find hidden Bollywood star names in this addictive Hindi cinema puzzle game!"
- **Full description**: (Use the one from PLAY_STORE_CHECKLIST.md)
- **App icon**: Upload your 512x512 icon
- **Category**: Games → Puzzle
- **Tags**: bollywood, word search, puzzle, hindi, movies

**Graphics:**
- **App icon**: 512×512 PNG (you have this)
- **Feature graphic**: 1024×500 PNG banner (create this)
- **Phone screenshots**: 2-8 images (capture from your app)

### 6. Content Rating
1. Go to "Policy" → "App content"
2. Complete questionnaire:
   - Target age: 13+
   - Content: No violence, no inappropriate content
   - Ads: None (currently)

### 7. Privacy Policy (Required)
Create a simple privacy policy or use a generator:
```
Movie Masala does not collect any personal information.
All gameplay data is stored locally on your device.
No internet connection is required to play.
```
Upload to your website or use a free hosting service.

### 8. Release Summary
Before publishing, ensure:
- ✅ App bundle uploaded
- ✅ Store listing complete
- ✅ Content rating complete
- ✅ Privacy policy added
- ✅ Release signed and ready

### 9. Submit for Review
1. Click "Review release"
2. Confirm all details
3. Click "Start rollout to production"

**Review time**: 1-7 days typically

### 10. Post-Launch
- Monitor reviews and ratings
- Update app as needed
- Consider adding features like:
  - More word categories
  - Leaderboards
  - Daily challenges

## Troubleshooting

**If upload fails:**
- Check AAB file size (under 150MB)
- Ensure proper signing
- Verify all required fields completed

**If rejected:**
- Review Google's feedback
- Fix issues and resubmit
- Common issues: privacy policy, content rating

## Marketing Tips
- Share on social media
- Ask friends/family to download and rate
- Consider creating promotional videos
- Engage with Bollywood communities online

Your app is ready for the world! 🎬✨