#!/bin/bash

set -e  # Exit on error

# ========== COMMON LOGGING FUNCTIONS ==========

success() { echo -e "\033[1;32m[SUCCESS]\033[0m $1"; }
error()   { echo -e "\033[1;31m[ERROR]\033[0m $1"; }
info()    { echo -e "\033[1;34m[INFO]\033[0m $1"; }

confirm_exit() {
  echo ""
  read -p "Are you sure you want to exit? (y/N): " response
  case "$response" in
    [yY][eE][sS]|[yY]) echo "Exiting..."; exit 1 ;;
    *) echo "Resuming..." ;;
  esac
}

# ========== INTERRUPT HANDLER ==========
trap 'echo ""; error "Process interrupted."; confirm_exit' SIGINT

# ========== VERSION BUMP ==========

BUMP_TYPE=$1

if [[ "$BUMP_TYPE" =~ ^(patch|minor|major)$ ]]; then
  info "Bumping version: $BUMP_TYPE"
  npm version "$BUMP_TYPE" --no-git-tag-version
  success "Version bumped to $(node -p "require('./package.json').version")"
else
  error "Missing or invalid version bump type. Usage: ./npm-release.sh [patch|minor|major]"
  exit 1
fi

VERSION=$(node -p "require('./package.json').version")
BRANCH="release/v$VERSION"

info "Starting release process for version v$VERSION"

# ========== GIT SETUP ==========

info "Checking out 'main' branch..."
git checkout main
git pull origin main
success "'main' branch is up to date."

# ========== BUILD ==========

info "Running build..."
npm run build
success "Build completed."

# ========== CHANGELOG ==========

info "Generating changelog..."
npm run changelog
git add CHANGELOG.md
git commit -m "docs: update changelog for v$VERSION"
success "Changelog generated."

# ========== RELEASE BRANCH ==========

info "Creating git branch: $BRANCH"
git checkout -b "$BRANCH"

# ========== COMMIT AND TAG ==========

info "Staging build artifacts..."
git add .

info "Committing release build..."
git commit -m "Release: v$VERSION"
success "Commit successful."

info "Creating git tag: v$VERSION"
git tag "v$VERSION"

# ========== PUSH ==========

info "Pushing branch and tag to origin..."
git push origin "$BRANCH"
git push origin "v$VERSION"
success "Branch and tag pushed."

# ========== PUBLISH TO NPM ==========

info "Publishing to NPM..."
npm publish --access public
success "Published to NPM: v$VERSION"

# ========== DONE ==========

echo ""
success "Release process completed for v$VERSION."
success "Branch created: $BRANCH"
success "Tag created: v$VERSION"
success "NPM package published successfully."
