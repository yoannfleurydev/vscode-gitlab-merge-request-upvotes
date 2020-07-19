# Gitlab Merge Request Upvotes README

!["Official GitLab Merge Request Upvotes Extension Logo"](./images/gitlab-merge-request-upvotes.png)

With **Gitlab Merge Request Upvotes** you can easily follow the upvotes or
approvals on your GitLab's <abbr title="Merge Request">MR</abbr>. The Tree View
of the extension will show you the upvotes (or approvals) on the
<abbr title="Merge Request">MR</abbr> you created by instances.

## Features

* Add GitLab instance
* Remove GitLab instance
* List GitLab instances in Tree View
* List Merge Request with their upvotes and titles.
  * Click on Merge Request item to open the
    <abbr title="Merge Request">MR</abbr> web page.

![Demo](./docs/demo.gif)

### Tree View

Follow the upvotes in a dedicated preview. Items are clickable and will open 
the <abbr title="Merge Request">MR</abbr> in your default browser.

![Tree View](./docs/treeview.png)

## Extension Settings

This extension contributes the following settings:

* `gitlab-merge-request-upvotes.refresh.interval`: `number` of seconds between
  each refresh.
* `gitlab-merge-request-upvotes.refresh.enable`: `boolean` to enable or disable
  the auto refresh.
* `gitlab-merge-request-upvotes.upvotes.type`: `upvotes|approvals` to use
  `upvotes` or `approvals`.

## Release Notes

See [CHANGELOG.md](./CHANGELOG.md)
