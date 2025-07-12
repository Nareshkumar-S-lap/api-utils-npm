#!/bin/bash

set -e  # Exit on any error

# ========== COMMON LOGGING FUNCTIONS ==========

success() {
  echo -e "\033[1;32m[SUCCESS]\033[0m $1"
}

error() {
  echo -e "\033[1;31m[ERROR]\033[0m $1"
}

info() {
  echo -e "\033[1;34m[INFO]\033[0m $1"
}

confirm_exit() {
  echo ""
  read -p "Are you sure you want to exit? (y/N): " response
  case "$response" in
    [yY][eE][sS]|[yY])
      echo "Exiting..."
      exit 1
      ;;
    *)
      echo "Resuming..."
      ;;
  esac
}

# ========== INTERRUPT HANDLER ==========

trap 'echo ""; error "Process interrupted."; confirm_exit' SIGINT

# ========== RELEASE PROCESS ==========

VERSION=$(node -p "require('./package.json').version")
BRANCH="release/v$VERSION"

info "Starting release process for version v$VERSION"

# Checkout and update main branch
info "Checking out 'main' branch..."
git checkout main

info "Pulling latest changes from origin..."
git pull origin main
success "'main' branch is up to date."

# Create release branch
info "Creating git branch: $BRANCH"
git checkout -b "$BRANCH"

# Build the project
info "Running build..."
npm run build
success "Build completed."

# Stage and commit
info "Staging changes..."
git add .

info "Committing changes..."
git commit -m "Release: v$VERSION"
success "Commit successful."

# Tag the release
info "Creating git tag: v$VERSION"
git tag "v$VERSION"

# Push branch and tag
info "Pushing branch and tag to origin..."
git push origin "$BRANCH"
git push origin "v$VERSION"
success "Branch and tag pushed."

# Publish to NPM
info "Publishing to NPM..."
npm publish --access public
success "Published to NPM: v$VERSION"

echo ""
success "Release process completed for v$VERSION."
success "Branch created: $BRANCH"
success "Tag created: v$VERSION"
success "NPM package published successfully."
