#!/bin/bash

# Script to create a new blog post with proper directory structure
# Usage: ./new-post.sh "my-blog-post-slug"

set -e

# Check if slug is provided
if [ $# -eq 0 ]; then
    echo "Usage: $0 <post-slug>"
    echo "Example: $0 \"my-awesome-post\""
    exit 1
fi

SLUG="$1"
CURRENT_DATE=$(date +%Y-%m-%d)
YEAR=$(date +%Y)
MONTH=$(date +%m)
DAY=$(date +%d)

# Create directory structure
POST_DIR="src/content/posts/${YEAR}/${MONTH}/${DAY}"
mkdir -p "$POST_DIR"

# Create the post file
POST_FILE="${POST_DIR}/${SLUG}.mdx"

# Check if file already exists
if [ -f "$POST_FILE" ]; then
    echo "Error: Post file already exists at $POST_FILE"
    exit 1
fi

# Create the post with frontmatter template
cat > "$POST_FILE" << EOF
---
title: ''
description: ''
date: ${CURRENT_DATE}
tags: []
draft: true
---

EOF

echo "Created new blog post: $POST_FILE"
echo "Don't forget to:"
echo "  - Add a title (max 60 chars for Open Graph)"
echo "  - Add a description (max 155 chars for Open Graph)"
echo "  - Add relevant tags"
echo "  - Set draft: false when ready to publish"

