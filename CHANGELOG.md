# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added
- feat: rebrand to Gemini Notebook (updates URLs and titles) (#23)
- feat: show what's new panel on first launch after update (fixes #14) (#21)
- feat: persist and restore window bounds (fixes #7) (#19)

### Fixed
- fix: ensure mac and linux compatibility by handling unhandled promise rejections (#22)
- fix: handle render-process-gone crash (fixes #13) (#20)

### Documentation
- docs: update downloads messaging to 11k (#18)

## [3.0.0] - 2026-05-15
### Added
- feat: v3.0 — 5k milestone release with cross-platform, dark mode, settings, and contributor foundation
- docs: replace v2 split-view screenshots with v3 gallery
- docs: overhaul README with hero, story, and technical sections
- chore: cut v3.0.0 stable release

### Fixed
- ci: fix cross-platform build failures
- ci: drop npm cache requirement and bump to v3.0.0-beta.2

## [2.1.0] - 2026-04-10
### Added
- chore: bump version to 2.1.0 and switch to electron-builder
- chore: optimize build size by excluding dist from app package
- chore: update download count to 2k+ and add thank you message

## [2.0.1] - 2026-03-05
### Fixed
- 🐛 fix images
- Add split-view showcase
- refactor: reorganize source files into src directory
- Fix README encoding and add CONTRIBUTING.md (closes #6)

## [2.0.0] - 2026-02-28
### Added
- feat: release NotebookLM-for-Windows v2.0.0 (Ghost Mode, Quick-Clip, Split View)
- Rebranding to NotebookLM-for-Windows, update donation to Buy Me A Chai, and celebrate 150 downloads

## [1.0.0] - 2026-02-08
### Added
- feat: NotebookGLM Desktop - Native Windows wrapper for NotebookLM with notifications and system tray
- feat: Add persistent login - session data persists across app restarts
- feat: Add Buy Me a Coffee button, build improvements
