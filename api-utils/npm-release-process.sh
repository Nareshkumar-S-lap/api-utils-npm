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

trap 'echo ""; error "Process interrupted."; confirm_exit' SIGINT

# ========== ARGUMENTS & DEFAULTS ==========

BUMP_TYPE=${1:-patch}
BRANCH_PREFIX=${2:-release}

if [[ ! "$BUMP_TYPE" =~ ^(patch|minor|major)$ ]]; then
  error "Invalid version bump type. Usage: ./npm-release.sh [patch|minor|major] [branch-prefix]"
  exit 1
fi

info "Bumping version: $BUMP_TYPE"
npm version "$BUMP_TYPE" --no-git-tag-version
success "Version bumped to $(node -p "require('./package.json').version")"

VERSION=$(node -p "require('./package.json').version")
BRANCH="$BRANCH_PREFIX/v$VERSION"

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

# ========== TEST ==========

info "Running tests..."
npm run test
success "All tests passed."

# ========== CHANGELOG ==========

info "Generating changelog..."
npm run changelog
git add CHANGELOG.md
git commit -m "docs: update changelog for v$VERSION"
success "Changelog generated."

# ========== RELEASE BRANCH ==========

info "Creating or switching to git branch: $BRANCH"
if git show-ref --verify --quiet "refs/heads/$BRANCH"; then
  git checkout "$BRANCH"
  info "Checked out existing branch: $BRANCH"
else
  git checkout -b "$BRANCH"
  success "Created new branch: $BRANCH"
fi

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


# ========== LINKS & PR INFO ==========

REPO_URL=$(node -p "require('./package.json').repository.url || ''" | sed -e 's/git+//' -e 's/\.git$//')

if [[ "$REPO_URL" == https://github.com/* ]]; then
  echo ""
  info "View release branch:"
  echo "$REPO_URL/tree/$BRANCH"

  info "View tag:"
  echo "$REPO_URL/releases/tag/v$VERSION"

  info "Create a Pull Request:"
  echo "$REPO_URL/compare/main...$BRANCH?expand=1"
else
  info "No valid GitHub repository URL found in package.json"
fi
