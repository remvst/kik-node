# Contributing

There are two different ways we do contributions to `kik-node` based on what change is being made.

## Feature Additions

Feature additions are submitted as pull requests into the `dev` branch. 
The `dev` branch holds all changes that will be released in the next minor/major version update, depending on the quantity of changes going in for a particular release.

Features are typically complete, including tests before making it into `dev`, so if you're submitting anything new, include tests, as well as updates to the appropriate documents (such as [README.md](/README.md)).

## Bug Fixes

Bug fixes take a hot path priority, and can be submitted as pull requests directly into `master`.
The `master` branch currently holds what has been published to the distribution host, and what is available to anyone through `npm`.
These changes will include a bug-fix version bump.

Never include breaking changes in a bug-fix pull request, as it is very likely that it won't be accepted into distribution, and will be recommended to be moved to a feature-addition pull request. 

These changes should be equally tested as those that are submitted into `dev`.
