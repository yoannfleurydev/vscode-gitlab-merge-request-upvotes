# Change Log

All notable changes to the "gitlab-merge-request-upvotes" extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

## [0.3.1] - 2020-07-19

### Fixed

- allow users to use http(s)

## [0.3.0] - 2020-05-25

### Deprecated

- deprecated `gitlabMergeRequestUpvotes.refreshInterval` configuration
- deprecated `gitlabMergeRequestUpvotes.enableRefresh` configuration

### Added

- new feature to handle approvals from GitLab API (only available in GitLab Starter or Bronze)
- new configuration `gitlab-merge-request-upvotes.refresh.enable` (replacing `gitlabMergeRequestUpvotes.enableRefresh`)
- new configuration `gitlab-merge-request-upvotes.refresh.interval` (replacing `gitlabMergeRequestUpvotes.refreshInterval`)
- new configuration `gitlab-merge-request-upvotes.upvotes.type`

## [0.2.0] - 2020-05-18

### Added

- better messages for users when no MR available
- rewrite part of the code for maintainability

## [0.1.3] - 2019-08-28

### Added

- add button to add instance
- add button to remove instance

### Changed

- improve the instance add behavior: when loosing focus, the quick input for token will stay open
- token input is now considered as a password, it won't be readable when pasted or written

## [0.1.2] - 2019-08-28

- add refresh button svg

## [0.1.1] - 2019-08-27

- Add config to README
- Init CHANGELOG

## [0.1.0] - 2019-08-27

- Initial release
