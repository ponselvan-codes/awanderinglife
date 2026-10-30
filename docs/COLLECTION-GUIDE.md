# Collection Management Guide

This guide explains how to manage your India PPC & Philately Passport Collection.

---

## Quick Reference

| Task | File to edit |
|------|-------------|
| Add a new PPC | `src/data/ppc.json` |
| Add a new Passport entry | `src/data/passport.json` |
| Upload PPC images | `public/images/ppc/PPC-XXXX/` |
| Upload Passport images | `public/images/passport/PASS-XXXX/` |

---

## PPC Collection Status Workflow

```
Not Requested
      ↓
(You send a request to the post office)
      ↓
Requested – Awaiting Receipt
      ↓
(You receive the PPC in the mail)
      ↓
Received ✓
```

### Status badge colors

| Status | Badge Color | JSON fields |
|--------|-------------|-------------|
| Not Requested | Gray | `requested: false, received: false` |
| Requested – Awaiting Receipt | Orange | `requested: true, received: false` |
| Received | Green | `requested: true, received: true` |

---

## Adding a New PPC Entry

### 1. Get the information

Before adding a PPC, gather:
- Post Office name
- District name
- State
- PIN Code
- Subject/description of the PPC design
- Theme (Heritage, Religious, Monuments, Palaces, Nature, Wildlife, Culture, etc.)
- Inauguration date (YYYY-MM-DD format)

### 2. Assign an ID

Check the current highest ID in `src/data/ppc.json` and increment by 1.

Example: If the last entry is `PPC-0012`, use `PPC-0013`.

### 3. Copy the template

```json
{
  "id": "PPC-0013",
  "title": "Your PPC Title",
  "postOffice": "Post Office Name",
  "district": "District Name",
  "state": "State Name",
  "pinCode": "000000",
  "subject": "Subject of the PPC",
  "theme": "Heritage",
  "inaugurationDate": "2026-01-01",
  "requested": false,
  "requestedDate": "",
  "received": false,
  "receivedDate": "",
  "trackingNumber": "",
  "requestMethod": "",
  "primaryImage": "",
  "postcardFrontImage": "",
  "postcardBackImage": "",
  "description": "",
  "notes": ""
}
```

### 4. Add to ppc.json

Open `src/data/ppc.json` and add the new object to the array. Make sure the JSON is valid (no trailing commas on the last entry).

### 5. Commit

```bash
git add src/data/ppc.json
git commit -m "Add PPC-0013: [Title]"
git push origin main
```

---

## Sending a PPC Request

When you prepare a request (postcard + cover letter + return postage):

1. Open `src/data/ppc.json`
2. Find your PPC entry
3. Update:
   ```json
   "requested": true,
   "requestedDate": "2026-10-27",
   "requestMethod": "Post",
   "trackingNumber": "EM123456789IN"
   ```
4. Commit and push

---

## Recording Receipt of a PPC

When your PPC arrives:

1. Open `src/data/ppc.json`
2. Find your PPC entry
3. Update:
   ```json
   "received": true,
   "receivedDate": "2026-11-05"
   ```
4. Scan/photograph the PPC
5. Upload images (see below)
6. Update image paths in JSON
7. Commit and push

---

## Image Management

### Converting images to WebP (recommended)

WebP provides excellent quality at smaller file sizes.

**On Windows (using Paint or online tool):**
- Use [Squoosh](https://squoosh.app/) (free, browser-based)
- Drag and drop your image
- Select WebP format
- Set quality to 80-85%
- Download

**File size targets:**
- PPC cancellation image: < 300KB
- Postcard front: < 400KB
- Postcard back: < 400KB
- Passport seal: < 200KB

### Image naming convention

```
ppc.webp    → The cancellation impression close-up
front.webp  → Postcard front (stamp side or pictorial side)
back.webp   → Postcard back (with the cancellation)
seal.webp   → Philately passport seal
```

---

## Philately Passport Management

### Adding a new passport entry

1. Scan or photograph the seal clearly (good lighting, flat surface)
2. Optimize the image (< 200KB WebP recommended)
3. Upload to `public/images/passport/PASS-XXXX/seal.webp`
4. Add entry to `src/data/passport.json`
5. Commit and push

### Passport entry template

```json
{
  "id": "PASS-0006",
  "title": "Exhibition Name 2026",
  "event": "Official Exhibition Name",
  "venue": "Venue Hall, Building",
  "city": "City Name",
  "state": "State Name",
  "date": "2026-10-15",
  "sealType": "Commemorative Seal",
  "passportPage": "6",
  "image": "/images/passport/PASS-0006/seal.webp",
  "description": "Description of the event and seal",
  "notes": "Personal notes"
}
```

---

## Bulk Operations

### Replace all demo data with real data

1. Open `src/data/ppc.json`
2. Delete all entries with `"DEMO DATA"` in description or notes
3. Add your real PPC entries
4. Commit: `git commit -m "Replace demo data with real collection"`

### Export collection as CSV (manual)

The JSON data can be imported into a spreadsheet:
1. Go to [json-csv.com](https://json-csv.com/)
2. Paste the contents of `src/data/ppc.json`
3. Download as CSV

---

## Troubleshooting

### Images not showing

- Check that the image path in JSON exactly matches the file path (case-sensitive)
- Ensure images are committed to the repository (`git status` should show the files)
- Wait for GitHub Actions to complete the build

### New entry not appearing

- Verify the JSON is valid (use [jsonlint.com](https://jsonlint.com/))
- Check that GitHub Actions completed successfully (no errors in Actions tab)
- Reload the website (Ctrl+Shift+R for hard reload)

### Date not formatting correctly

- Use YYYY-MM-DD format: `"2026-10-27"` not `"27-10-2026"` or `"Oct 27, 2026"`

### GitHub Actions build failing

- Check the Actions tab in your repository
- Click on the failed workflow run
- Read the error message in the logs
- Common issues:
  - TypeScript error in a JSON file
  - Broken import
  - Invalid JSON syntax in data files

---

## JSON Validation

Before committing changes to data files, validate the JSON:

```bash
# Install node json validator (one-time)
npm install -g jsonlint

# Validate
jsonlint src/data/ppc.json
jsonlint src/data/passport.json
```

Or use the online tool at [jsonlint.com](https://jsonlint.com/).

---

*For more detailed setup instructions, see [README.md](../README.md).*
