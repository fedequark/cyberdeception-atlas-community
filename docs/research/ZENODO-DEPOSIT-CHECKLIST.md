# Zenodo deposit gate

## Deposit structure

Create two linked Zenodo records:

1. **Dataset/software artifact:** corrective corpus release, manifests, checksums, codebook, protocols, analysis, and conformance-test data.
2. **Whitepaper:** the final PDF and source manuscript, linked to the dataset DOI with an `isSupplementedBy`/`isSupplementTo` relationship as appropriate.

Keeping the records separate allows the dataset to receive new versions without replacing the scholarly paper.

## Before upload

- Commit the corrective release so the manifest no longer points to a dirty worktree; build a fresh final version after that commit.
- Complete the AI-first pilot or state clearly that its protocol is prospective and exclude empty templates from empirical claims.
- Resolve title, author list, affiliations, ORCID identifiers, contributors, funding, conflicts, keywords, license, and related identifiers.
- Render and visually verify the whitepaper PDF.
- Verify every release-manifest hash from a clean checkout.
- Ensure no private submissions, credentials, monitoring data, personal data, or unpublished reviewer identities enter the archive.
- Decide whether the software should be MIT while data and documentation remain CC BY 4.0; state this in the record description.

## DOI workflow

1. Create both uploads as drafts.
2. Reserve the two Zenodo DOIs before publication.
3. Insert the dataset DOI into `CITATION.cff`, `.zenodo.json`, the whitepaper data-availability section, and the public downloads page.
4. Insert the whitepaper DOI into the dataset related identifiers.
5. Rebuild the final archive and PDF, upload them, and verify hashes.
6. Preview all metadata and files.
7. Publish the dataset first, then the whitepaper, and verify that reciprocal DOI relationships resolve.

Publishing a Zenodo record is irreversible in the sense that the deposited version becomes part of the scholarly record. Do not publish while author metadata, licenses, files, or DOI links are provisional.
