# Story Submission Flow Implementation Plan

**Target User:** German-speaking elderly authors (65-75+)
**Core Goal:** Enable story authors to answer weekly questions via text OR voice
**Critical Success Factor:** Interface must be so simple that someone who's never used a voice recorder can succeed on first try

---

## 1. Files to Create/Modify

### New Pages (App Router)

```
src/app/(dashboard)/write/page.tsx              # Main story writing page
src/app/(dashboard)/write/layout.tsx            # Dashboard layout with navigation
src/app/(dashboard)/stories/page.tsx            # List of author's stories (for later)
src/app/(dashboard)/stories/[id]/page.tsx       # View/edit individual story (for later)
```

### API Routes

```
src/app/api/stories/route.ts                    # POST - Create story, GET - List stories
src/app/api/stories/[id]/route.ts               # GET, PATCH, DELETE - Manage single story
src/app/api/stories/[id]/audio/route.ts         # POST - Upload audio file
src/app/api/stories/[id]/photos/route.ts        # POST - Upload photos
src/app/api/transcribe/route.ts                 # POST - Transcribe audio via Gladia
src/app/api/upload/presigned-url/route.ts       # GET - Get S3 presigned URL for uploads
```

### Components - Story Writing

```
src/components/story/question-display.tsx       # Shows current week's question (large, clear)
src/components/story/writing-mode-selector.tsx  # Toggle: Text vs Voice (big buttons)
src/components/story/text-editor.tsx            # Large textarea with accessibility
src/components/story/voice-recorder.tsx         # Main voice recording interface
src/components/story/audio-playback.tsx         # Play recorded audio before submit
src/components/story/photo-uploader.tsx         # Drag-drop + file picker for photos
src/components/story/photo-grid.tsx             # Preview uploaded photos
src/components/story/story-preview.tsx          # Preview before final submission
src/components/story/save-draft-button.tsx      # Auto-save + manual save
src/components/story/submit-button.tsx          # Final submission with confirmation
```

### Components - Voice Recording (Detailed)

```
src/components/voice/record-button.tsx          # Large circular record button (animated)
src/components/voice/recording-indicator.tsx    # Visual feedback (pulse, timer)
src/components/voice/recording-timer.tsx        # Display recording duration
src/components/voice/playback-controls.tsx      # Play, pause, re-record
src/components/voice/volume-meter.tsx           # Show audio levels while recording
src/components/voice/transcription-editor.tsx   # Edit transcribed text
src/components/voice/permission-prompt.tsx      # Guide user through mic permissions
```

### Hooks

```
src/hooks/use-audio-recorder.ts                 # Web Audio API wrapper
src/hooks/use-transcription.ts                  # Handle transcription API calls
src/hooks/use-photo-upload.ts                   # Handle photo resize + S3 upload
src/hooks/use-story-draft.ts                    # Auto-save draft functionality
src/hooks/use-story-submission.ts               # Story creation/update logic
```

### Utilities

```
src/lib/audio/recorder.ts                       # MediaRecorder setup and config
src/lib/audio/audio-processing.ts               # Convert audio formats
src/lib/transcription/gladia-client.ts          # Gladia API integration
src/lib/storage/s3-upload.ts                    # S3 upload helpers
src/lib/image/resize.ts                         # Client-side image optimization
src/lib/image/validate.ts                       # Image validation (size, format, DPI)
```

### Types

```
src/types/story.ts                              # Story, Draft, Question types
src/types/audio.ts                              # AudioRecording, Transcription types
src/types/upload.ts                             # UploadProgress, S3Config types
```

### Files to Modify

```
prisma/schema.prisma                            # Add Story.audioUrl, Story.photos[] if needed
src/app/(dashboard)/layout.tsx                  # Add dashboard navigation
.env.example                                    # Add Gladia API key, S3 config
```

---

## 2. Voice Recording Approach

### Decision: Web Audio API with MediaRecorder (No External Library)

**Why NOT use a library:**
- MediaRecorder is well-supported in modern browsers
- Elderly users likely use recent browsers (family member setup)
- Full control over UX and error handling
- Smaller bundle size
- Can customize for German transcription needs

**Technical Stack:**
```typescript
// Browser APIs
MediaRecorder API          // Record audio
Web Audio API              // Volume meter, audio visualization
MediaStream API            // Microphone access
Blob API                   // Handle recorded audio data
```

**Audio Format:**
- **Recording:** WebM (Opus codec) - Best browser support
- **Fallback:** MP4 (AAC codec) - For Safari
- **Gladia supports:** MP3, WAV, WebM, M4A, OGG
- **Our approach:** Record in WebM, convert to WAV for transcription if needed

### Voice Recording Flow

```
1. User clicks "Aufnehmen" (Record) button
   ↓
2. Request microphone permission (with clear German instructions)
   ↓
3. Show permission dialog guidance: "Klicken Sie 'Erlauben'"
   ↓
4. Start recording (show BIG visual indicator: red pulse, timer)
   ↓
5. Show volume meter (so user knows it's working)
   ↓
6. User clicks "Stopp" button
   ↓
7. Show playback: "Möchten Sie die Aufnahme anhören?"
   ↓
8. Options: Play, Re-record, Keep & Transcribe
   ↓
9. If "Keep": Upload to S3, send to Gladia for transcription
   ↓
10. Show transcribed text in editable textarea
   ↓
11. User can edit transcription, then submit
```

### Key UX Principles for 75-Year-Olds

**1. One Action at a Time**
```
❌ BAD: Multiple buttons visible (Record, Pause, Stop, Delete)
✅ GOOD: Only show relevant button for current state
  - Not recording: Show only "Aufnehmen" button
  - Recording: Show only "Stopp" button
  - Recorded: Show only "Anhören" and "Neu aufnehmen"
```

**2. Massive Visual Feedback**
```
✅ Red pulsing circle while recording (120px diameter minimum)
✅ Large timer: "00:34" (48px font size)
✅ Animated volume bars (so they know mic is working)
✅ Success checkmark after recording stops
```

**3. Forgiving and Reversible**
```
✅ Can re-record unlimited times
✅ Auto-save draft every 30 seconds
✅ Can switch to text input anytime
✅ Clear "Abbrechen" (Cancel) button always visible
```

**4. Clear Instructions in Context**
```
✅ Before recording: "Klicken Sie auf 'Aufnehmen' und erzählen Sie Ihre Geschichte"
✅ During recording: "Sprechen Sie jetzt... Klicken Sie 'Stopp' wenn Sie fertig sind"
✅ After recording: "Hören Sie Ihre Aufnahme ab oder nehmen Sie sie neu auf"
```

---

## 3. German Transcription Strategy

### Primary: Gladia API

**Why Gladia:**
- Mentioned in CLAUDE.md as voice-to-text option
- Real-time and asynchronous transcription
- Good German language support
- Reasonable pricing (~$0.30/hour of audio)
- Simple REST API

**Gladia Configuration:**
```typescript
{
  language: 'de',                    // German
  language_behaviour: 'automatic',   // Auto-detect dialect
  enable_code_switching: false,      // Stick to German
  transcription_hint: '',            // Optional: provide context
  subtitles: false,                  // We only need text
  diarization: false,                // Single speaker
  output_format: 'json'
}
```

**Fallback: Google Cloud Speech-to-Text (Chirp 3)**
```typescript
// If Gladia fails or times out
{
  languageCode: 'de-DE',
  model: 'chirp_3',
  enableAutomaticPunctuation: true,
  enableWordTimeOffsets: false  // Not needed for our use case
}
```

### Handling Dialect Variations

German dialects we need to support:
- **Standard German** (Hochdeutsch) - Most common
- **Bavarian** (Bairisch) - Southern Germany, Austria
- **Swiss German** (Schweizerdeutsch) - Switzerland
- **Low German** (Plattdeutsch) - Northern Germany
- **Austrian German** - Austria

**Strategy:**
1. Use Gladia's automatic language detection
2. Allow users to edit transcription (ALWAYS)
3. Show transcription confidence score
4. If confidence < 80%, show warning: "Bitte überprüfen Sie den Text"
5. Provide feedback mechanism: "War die Transkription korrekt?"

### Transcription Flow

```typescript
// 1. Upload audio to S3
const audioUrl = await uploadToS3(audioBlob);

// 2. Send to Gladia for transcription
const transcription = await transcribeAudio({
  audioUrl,
  language: 'de',
  userId: user.id  // For logging/debugging
});

// 3. Store transcription with confidence score
await prisma.story.update({
  where: { id: storyId },
  data: {
    audioUrl,
    content: transcription.text,
    transcriptionConfidence: transcription.confidence,
    transcriptionService: 'gladia',
    transcribedAt: new Date()
  }
});

// 4. Show editable text to user
// User can fix any transcription errors before final submit
```

### Error Handling

```typescript
// Transcription can fail for many reasons
try {
  const result = await gladia.transcribe(audioUrl);
  return result.text;
} catch (error) {
  if (error.code === 'TIMEOUT') {
    // Audio too long or service slow
    return fallbackToGoogleSpeech(audioUrl);
  } else if (error.code === 'UNSUPPORTED_LANGUAGE') {
    // Fallback to manual text input
    showNotification('Die automatische Transkription ist fehlgeschlagen. Bitte geben Sie Ihren Text manuell ein.');
    return null;
  } else {
    // Log error, show graceful message
    logError(error, { userId, audioUrl });
    return null;
  }
}
```

---

## 4. Photo Upload Approach

### Client-Side Resize Before S3 Upload

**Why client-side resize:**
- Faster uploads (smaller files)
- Lower bandwidth costs for users
- Reduces S3 storage costs
- Better UX (upload completes quickly)
- Still maintain quality for print (300 DPI target)

**Library: `browser-image-compression`**
```bash
npm install browser-image-compression
```

**Photo Upload Specifications:**

```typescript
// For web display
const WEB_SIZE = {
  maxWidth: 1920,
  maxHeight: 1920,
  quality: 0.85,
  format: 'jpeg'
};

// For print (book generation)
const PRINT_SIZE = {
  maxWidth: 3000,
  maxHeight: 3000,
  quality: 0.92,
  format: 'jpeg',
  // At 6x9" book size, 3000px = 333 DPI (exceeds 300 DPI requirement)
};
```

### Photo Upload Flow

```
1. User selects/drops photo(s)
   ↓
2. Validate: file type (JPEG, PNG, HEIC), size < 20MB
   ↓
3. Show preview thumbnails
   ↓
4. Client-side compress:
   - Create web version (for display)
   - Create print version (for book)
   ↓
5. Get presigned S3 URLs from backend
   ↓
6. Upload both versions to S3 (parallel)
   ↓
7. Show upload progress bar (per photo)
   ↓
8. Save S3 URLs to Story.photos[] array
   ↓
9. Show success: "✓ Foto hochgeladen"
```

### Photo Upload Component UX

**Accessibility for Elderly Users:**

```tsx
// Large drop zone (minimum 200px height)
<div className="border-4 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-blue-500 transition-colors">
  {/* Icon - 64px size */}
  <PhotoIcon className="h-16 w-16 mx-auto text-gray-400" />

  {/* Clear instructions - 18px font */}
  <p className="mt-4 text-lg font-medium">
    Ziehen Sie Fotos hierher oder klicken Sie zum Auswählen
  </p>

  {/* Large button fallback - min 44x44px */}
  <button className="mt-4 px-8 py-4 text-lg bg-blue-600 text-white rounded-lg">
    Fotos auswählen
  </button>
</div>
```

**Photo Validation:**

```typescript
const validatePhoto = (file: File): { valid: boolean; error?: string } => {
  // File type
  const allowedTypes = ['image/jpeg', 'image/png', 'image/heic', 'image/heif'];
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Bitte wählen Sie ein Foto im JPG, PNG oder HEIC Format.'
    };
  }

  // File size (max 20MB original)
  const maxSize = 20 * 1024 * 1024;
  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'Das Foto ist zu groß. Bitte wählen Sie ein Foto unter 20 MB.'
    };
  }

  return { valid: true };
};
```

### S3 Storage Structure

```
s3://foreverstory-prod/
├── audio/
│   └── {userId}/
│       └── {storyId}/
│           └── recording-{timestamp}.webm
├── photos/
│   └── {userId}/
│       └── {storyId}/
│           ├── {photoId}-web.jpg      (1920px, for display)
│           └── {photoId}-print.jpg    (3000px, for book)
└── books/
    └── ... (future)
```

**Security Considerations:**
- Presigned URLs with 15-minute expiry
- User can only upload to their own folder
- Validate userId from session on backend
- Scan uploads for malware (future enhancement)

---

## 5. Database Schema Updates

### Story Model Additions

```prisma
model Story {
  id                      String    @id @default(cuid())
  authorId                String
  subscriptionId          String
  questionId              String

  // Content (text OR transcribed from audio)
  content                 String?   @db.Text

  // Audio recording
  audioUrl                String?   // S3 URL to audio file
  audioDuration           Int?      // Duration in seconds
  transcriptionConfidence Float?    // 0.0 to 1.0
  transcriptionService    String?   // 'gladia' or 'google'
  transcribedAt           DateTime?

  // Photos
  photos                  Json      // Array of {id, webUrl, printUrl, caption}

  // Metadata
  inputMode               String    // 'text' or 'voice'
  status                  String    // 'draft' | 'submitted' | 'published'
  wordCount               Int?

  // Timestamps
  createdAt               DateTime  @default(now())
  updatedAt               DateTime  @updatedAt
  submittedAt             DateTime?

  // Relations
  author                  User      @relation(fields: [authorId], references: [id])
  subscription            Subscription @relation(fields: [subscriptionId], references: [id])
  question                Question  @relation(fields: [questionId], references: [id])

  @@index([authorId])
  @@index([subscriptionId])
  @@index([questionId])
  @@index([status])
}
```

**Migration command:**
```bash
npm run db:generate
npm run db:migrate -- --name add_audio_photos_to_stories
```

---

## 6. Implementation Phases

### Phase 1: Foundation & Text Input (Day 1-2)

**Goal:** Basic story writing with text input only

**Tasks:**
1. **Database migration** - Add audioUrl, photos, transcription fields
2. **Create page structure** - `/write` page with dashboard layout
3. **Question display component** - Show current week's question (mock data)
4. **Writing mode selector** - Toggle Text/Voice (only text works initially)
5. **Text editor component** - Large textarea with:
   - 18px font minimum
   - High contrast mode
   - Character count
   - Auto-save every 30 seconds
6. **Draft saving** - POST `/api/stories` with status='draft'
7. **Submit button** - Final submission with confirmation dialog

**Acceptance Criteria:**
- [ ] User can see a question
- [ ] User can write text response
- [ ] Draft auto-saves every 30 seconds
- [ ] User can submit final story
- [ ] Story appears in database with correct userId

**Testing:**
- Manually create Question in DB
- Test with screen reader (VoiceOver/NVDA)
- Test on mobile (Safari iOS, Chrome Android)

---

### Phase 2: Voice Recording (Day 3-5)

**Goal:** Record audio with playback, no transcription yet

**Tasks:**
8. **Microphone permission flow** - Request access with clear German instructions
9. **Record button component** - Large (120px), animated, single-state
10. **Recording indicator** - Pulsing red circle, timer, volume meter
11. **Audio recording hook** - `useAudioRecorder()` with MediaRecorder
12. **Stop recording** - Save audio Blob
13. **Playback controls** - Play recorded audio, re-record option
14. **S3 upload** - Presigned URL endpoint, upload audio file
15. **Save audio URL** - Update Story.audioUrl in database

**Acceptance Criteria:**
- [ ] User can grant microphone permission
- [ ] Recording starts/stops correctly
- [ ] Visual feedback is clear (pulsing, timer)
- [ ] User can play back recording
- [ ] User can re-record unlimited times
- [ ] Audio uploads to S3 successfully
- [ ] Audio URL saved to database

**Testing:**
- Test on Mac (Chrome, Safari, Firefox)
- Test on Windows (Chrome, Edge)
- Test permission denial (show fallback to text)
- Test with different microphones (laptop, headset, USB)

---

### Phase 3: German Transcription (Day 6-7)

**Goal:** Convert audio to editable German text

**Tasks:**
16. **Gladia API integration** - Create client in `lib/transcription/gladia-client.ts`
17. **Transcription endpoint** - POST `/api/transcribe` (server-side)
18. **Transcription UI** - Show loading state: "Ihre Aufnahme wird transkribiert..."
19. **Editable transcription** - Show transcribed text in textarea (large font)
20. **Confidence indicator** - Show warning if < 80% confidence
21. **Error handling** - Fallback to Google Speech-to-Text if Gladia fails
22. **Store transcription** - Save to Story.content + metadata

**Acceptance Criteria:**
- [ ] Audio file transcribes to German text
- [ ] Transcription appears in editable textarea
- [ ] User can edit transcription before submitting
- [ ] Confidence score stored in database
- [ ] Errors show user-friendly German message
- [ ] Fallback to text input if transcription fails

**Testing:**
- Test with clear German audio (Hochdeutsch)
- Test with dialect audio (Bavarian, Swiss)
- Test with background noise
- Test with very long recordings (5+ minutes)
- Test transcription accuracy (manually verify)

---

### Phase 4: Photo Upload (Day 8-9)

**Goal:** Add photos to stories with print-quality optimization

**Tasks:**
23. **Photo upload component** - Drag-drop + file picker
24. **Photo validation** - Check file type, size, format
25. **Client-side resize** - Create web + print versions
26. **Upload progress** - Show per-photo progress bars
27. **Photo preview grid** - Show uploaded photos with remove option
28. **S3 upload** - Upload both versions, get URLs
29. **Save photo metadata** - Store in Story.photos[] JSON array
30. **Photo captions** - Optional text caption per photo

**Acceptance Criteria:**
- [ ] User can select multiple photos
- [ ] Photos resize correctly (web: 1920px, print: 3000px)
- [ ] Upload progress shows for each photo
- [ ] User can preview uploaded photos
- [ ] User can remove photos before submitting
- [ ] User can add captions to photos
- [ ] Photos appear in database Story.photos array

**Testing:**
- Test with large photos (20MB HEIC from iPhone)
- Test with multiple photos (10+ at once)
- Test drag-and-drop vs file picker
- Verify print quality (check DPI calculation)
- Test on slow connection (3G throttling)

---

### Phase 5: Polish & Accessibility (Day 10-11)

**Goal:** Ensure elderly-friendly UX and full accessibility

**Tasks:**
31. **Accessibility audit** - Test with screen reader
32. **Keyboard navigation** - All actions keyboard-accessible
33. **High contrast mode** - Test in OS high contrast mode
34. **Touch target sizing** - Verify all buttons ≥ 44x44px
35. **Font sizing** - Verify all text ≥ 16px (14px minimum)
36. **Loading states** - Clear feedback for all async actions
37. **Error messages** - User-friendly German for all errors
38. **German copy review** - All text uses formal "Sie"
39. **Mobile responsive** - Test on iPhone, Android
40. **Story preview** - Show preview before final submit

**Acceptance Criteria:**
- [ ] All WCAG 2.1 AA standards met
- [ ] Keyboard-only navigation works
- [ ] Screen reader announces all actions
- [ ] High contrast mode renders correctly
- [ ] Mobile touch targets are large enough
- [ ] All German copy is grammatically correct
- [ ] Loading/error states are clear

**Testing:**
- Full accessibility audit (Lighthouse, axe DevTools)
- Test with 70+ year old user (if possible)
- Test with screen reader (VoiceOver, NVDA)
- Test on mobile devices
- Cross-browser testing (Chrome, Safari, Firefox, Edge)

---

### Phase 6: Integration & Testing (Day 12-13)

**Goal:** End-to-end testing with real data

**Tasks:**
41. **Seed database** - Create test users, subscriptions, questions
42. **Manual testing** - Complete full story submission flow
43. **Edge case testing** - Test error scenarios
44. **Performance testing** - Test with large audio files
45. **Security review** - Verify S3 permissions, user isolation
46. **Documentation** - Add to README, create user guide
47. **Analytics events** - Track story submissions, errors

**Test Scenarios:**
- [ ] Text-only story (no audio, no photos)
- [ ] Voice-only story (audio + transcription, no photos)
- [ ] Full multimedia story (audio + photos)
- [ ] Multiple photos (10+ photos)
- [ ] Long recording (10+ minutes)
- [ ] Draft save and resume later
- [ ] Switch from voice to text mid-story
- [ ] Network interruption during upload
- [ ] Microphone permission denied
- [ ] Transcription failure
- [ ] S3 upload failure

---

## 7. Environment Variables

Add to `.env.local`:

```bash
# Gladia API
GLADIA_API_KEY=your-gladia-api-key

# Google Cloud (fallback)
GOOGLE_CLOUD_PROJECT=your-project-id
GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json

# AWS S3 (Hetzner Object Storage or AWS Frankfurt)
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=eu-central-1
S3_BUCKET=foreverstory-dev
S3_ENDPOINT=https://s3.eu-central-1.wasabisys.com  # If using Hetzner/Wasabi
```

Add to `.env.example`:

```bash
# Transcription Services
GLADIA_API_KEY=your-gladia-key
GOOGLE_CLOUD_PROJECT=your-gcp-project
GOOGLE_APPLICATION_CREDENTIALS=/path/to/credentials.json

# Object Storage (S3-compatible)
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
AWS_REGION=eu-central-1
S3_BUCKET=foreverstory-dev
S3_ENDPOINT=https://your-endpoint  # Optional for S3-compatible services
```

---

## 8. Key Dependencies

```bash
# Install all at once
npm install \
  browser-image-compression \
  @aws-sdk/client-s3 \
  @aws-sdk/s3-request-presigner \
  react-dropzone \
  zustand

npm install -D \
  @types/node
```

**Dependencies breakdown:**
- `browser-image-compression` - Client-side photo resize
- `@aws-sdk/client-s3` - S3 uploads
- `@aws-sdk/s3-request-presigner` - Presigned URLs for uploads
- `react-dropzone` - Drag-and-drop file upload
- `zustand` - Client state for recording/upload state

---

## 9. German Copy Reference

### Main Writing Page

```typescript
const COPY = {
  // Page heading
  title: 'Ihre Geschichte schreiben',
  subtitle: 'Frage der Woche',

  // Mode selector
  modeText: 'Text eingeben',
  modeVoice: 'Aufnehmen',

  // Text input
  placeholderText: 'Schreiben Sie Ihre Antwort hier...',
  characterCount: '{count} Zeichen',
  wordCount: '{count} Wörter',

  // Voice recording
  recordButton: 'Aufnehmen',
  recordingButton: 'Aufnahme läuft...',
  stopButton: 'Stopp',
  playButton: 'Anhören',
  reRecordButton: 'Neu aufnehmen',
  keepRecordingButton: 'Aufnahme verwenden',

  // Recording states
  recordingInstructions: 'Klicken Sie auf "Aufnehmen" und erzählen Sie Ihre Geschichte.',
  recordingActive: 'Sprechen Sie jetzt... Klicken Sie "Stopp" wenn Sie fertig sind.',
  recordingComplete: 'Aufnahme beendet. Möchten Sie sie anhören?',

  // Transcription
  transcribing: 'Ihre Aufnahme wird transkribiert...',
  transcriptionComplete: 'Transkription abgeschlossen. Bitte überprüfen und bearbeiten Sie den Text.',
  transcriptionLowConfidence: 'Die automatische Transkription war unsicher. Bitte überprüfen Sie den Text sorgfältig.',
  transcriptionFailed: 'Die Transkription ist fehlgeschlagen. Bitte geben Sie Ihren Text manuell ein.',

  // Photo upload
  photoDropzone: 'Ziehen Sie Fotos hierher oder klicken Sie zum Auswählen',
  photoSelect: 'Fotos auswählen',
  photoUploading: 'Foto wird hochgeladen...',
  photoCaption: 'Bildunterschrift (optional)',
  photoRemove: 'Entfernen',

  // Saving
  savingDraft: 'Entwurf wird gespeichert...',
  draftSaved: 'Entwurf gespeichert',
  saveDraftButton: 'Entwurf speichern',
  submitButton: 'Geschichte absenden',

  // Confirmation
  submitConfirmTitle: 'Geschichte absenden?',
  submitConfirmMessage: 'Möchten Sie Ihre Geschichte jetzt absenden? Sie können sie später nicht mehr bearbeiten.',
  submitConfirmYes: 'Ja, absenden',
  submitConfirmNo: 'Noch nicht',

  // Success
  submitSuccess: 'Ihre Geschichte wurde erfolgreich abgesendet!',
  submitSuccessMessage: 'Vielen Dank für Ihre Geschichte. Ihre Familie kann sie jetzt lesen.',

  // Errors
  errorMicPermission: 'Mikrofon-Zugriff verweigert. Bitte erlauben Sie den Zugriff in Ihren Browser-Einstellungen.',
  errorRecording: 'Aufnahme fehlgeschlagen. Bitte versuchen Sie es erneut oder verwenden Sie die Text-Eingabe.',
  errorUpload: 'Upload fehlgeschlagen. Bitte überprüfen Sie Ihre Internetverbindung.',
  errorNetwork: 'Netzwerkfehler. Bitte überprüfen Sie Ihre Internetverbindung.',
  errorGeneric: 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.',
};
```

---

## 10. Success Criteria

**Story Submission Flow is complete when:**

- [ ] User can view their current question
- [ ] User can write story using text input (large, accessible)
- [ ] User can record story using voice (with playback)
- [ ] Audio transcribes to editable German text
- [ ] User can upload photos with drag-drop or file picker
- [ ] Photos resize correctly for web and print
- [ ] Draft auto-saves every 30 seconds
- [ ] User can submit final story
- [ ] All UI elements meet accessibility requirements (WCAG 2.1 AA)
- [ ] All text is in German (formal "Sie")
- [ ] Works on desktop (Chrome, Safari, Firefox, Edge)
- [ ] Works on mobile (iOS Safari, Android Chrome)
- [ ] Microphone permission denial falls back gracefully
- [ ] Transcription failure falls back to text input
- [ ] Upload failures show retry option
- [ ] Story appears in database with all metadata

---

## 11. Known Risks & Mitigations

| Risk | Mitigation |
|------|-----------|
| **Elderly users can't grant mic permission** | Clear step-by-step instructions with screenshots, phone support number |
| **German dialect not recognized** | Allow text editing after transcription, feedback mechanism |
| **Large audio files timeout** | Show progress indicator, split long recordings, set max 10 minutes |
| **Photo upload fails on slow connection** | Show progress bar, allow retry, compress more aggressively |
| **Browser doesn't support MediaRecorder** | Feature detection, fallback to text input only |
| **Transcription costs too high** | Set max audio length (10 min = ~$0.05/story), monitor usage |
| **User loses work due to browser crash** | Auto-save draft every 30 seconds, localStorage backup |
| **Audio quality too poor for transcription** | Show volume meter during recording, require minimum volume |

---

## 12. Future Enhancements (Not in MVP)

**Features to add later:**
- [ ] Story editing after submission (for authors only)
- [ ] Rich text formatting (bold, italic, lists)
- [ ] Voice recording pause/resume
- [ ] Background noise reduction
- [ ] Auto-detect optimal transcription service (A/B test)
- [ ] Photo rotation/cropping
- [ ] Video recording (short clips)
- [ ] Story templates/prompts
- [ ] Writing progress tracker
- [ ] Share draft with family for feedback
- [ ] Export story as PDF

---

## 13. Testing Checklist

### Pre-Implementation Testing
- [ ] Review plan with stakeholders
- [ ] Verify Gladia API key works
- [ ] Verify S3 bucket exists and is accessible
- [ ] Test MediaRecorder browser support

### During Implementation Testing
- [ ] Test each component in isolation
- [ ] Test with real elderly user (if possible)
- [ ] Test on slow network (3G throttling)
- [ ] Test with screen reader after each phase

### Post-Implementation Testing
- [ ] Full end-to-end flow (text)
- [ ] Full end-to-end flow (voice)
- [ ] Full end-to-end flow (photos)
- [ ] Cross-browser testing
- [ ] Mobile device testing
- [ ] Accessibility audit
- [ ] Performance testing (Lighthouse)
- [ ] Security review

---

## 14. Next Steps After Approval

Once this plan is approved:

1. **Day 1:** Run Phase 1 (database migration, page structure, text input)
2. **Day 3:** Run Phase 2 (voice recording, no transcription yet)
3. **Day 6:** Run Phase 3 (add Gladia transcription)
4. **Day 8:** Run Phase 4 (photo upload)
5. **Day 10:** Run Phase 5 (accessibility polish)
6. **Day 12:** Run Phase 6 (testing, documentation)

**Estimated total:** 13 development days (~2.5 weeks)

After completion, we'll have a fully functional story submission flow ready for user testing.

---

**Ready for review and approval.**
