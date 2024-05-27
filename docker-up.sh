#!/bin/bash

set -a
source ./.env.local
set +a

PROJECT_DIR=$(pwd)

NODE_UPLOAD_FILES="$PROJECT_DIR/tmp/uploads"

docker compose up
