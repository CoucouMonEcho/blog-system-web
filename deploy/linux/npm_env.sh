#!/bin/bash
set -euo pipefail

# Ensure running with bash even if invoked via sh
if [ -z "${BASH_VERSION:-}" ]; then
  exec bash "$0" "$@"
fi

# Fast path: if Node is already present and version >= 18, skip everything
if command -v node >/dev/null 2>&1; then
  NODE_MAJOR=$(node -v 2>/dev/null | sed 's/^v//' | cut -d. -f1 || echo 0)
  if [ "${NODE_MAJOR}" -ge 18 ]; then
    echo "[OK] Existing Node >= 18 detected: $(node -v). Skipping setup."
    npm -v 2>/dev/null || true
    exit 0
  fi
fi

# Ensure basic tools and Node.js (via NVM) are installed on Aliyun ECS / Linux
# - Installs curl/git/build tools via apt/yum/dnf if needed
# - Idempotent: skip if already installed
# - Robust download with multiple mirrors for NVM
# - Use CN mirror for Node binaries to avoid TLS/network hiccups

detect_pm() {
  if command -v apt-get >/dev/null 2>&1; then echo apt; return; fi
  if command -v dnf >/dev/null 2>&1; then echo dnf; return; fi
  if command -v yum >/dev/null 2>&1; then echo yum; return; fi
  echo unknown
}

run_sudo() {
  if command -v sudo >/dev/null 2>&1; then sudo "$@"; else "$@"; fi
}

pkg_installed() {
  local pkg="$1"
  case "$(detect_pm)" in
    apt)
      dpkg -s "$pkg" >/dev/null 2>&1 && return 0 || return 1 ;;
    dnf|yum)
      rpm -q "$pkg" >/dev/null 2>&1 && return 0 || return 1 ;;
    *)
      return 1 ;;
  esac
}

ensure_packages() {
  local pkgs_to_install=()
  for p in "$@"; do
    if ! pkg_installed "$p"; then
      pkgs_to_install+=("$p")
    fi
  done
  if [ ${#pkgs_to_install[@]} -gt 0 ]; then
    case "$(detect_pm)" in
      apt)
        run_sudo apt-get update -y
        run_sudo apt-get install -y "${pkgs_to_install[@]}"
        ;;
      dnf)
        run_sudo dnf install -y "${pkgs_to_install[@]}"
        ;;
      yum)
        run_sudo yum install -y "${pkgs_to_install[@]}"
        ;;
      *)
        echo "[WARN] Unknown package manager; please ensure: ${pkgs_to_install[*]}"
        ;;
    esac
  fi
}

PM=$(detect_pm)
case "$PM" in
  apt)
    ensure_packages ca-certificates curl wget git build-essential tar xz-utils
    ;;
  dnf)
    ensure_packages ca-certificates curl wget git gcc-c++ make which tar xz
    ;;
  yum)
    ensure_packages ca-certificates curl wget git gcc-c++ make which tar xz
    ;;
  *)
    echo "[WARN] Unknown package manager; please ensure curl/git/build tools are installed"
    ;;
esac

# Optionally install NVM (skipped by default for restricted networks)
export NVM_DIR="$HOME/.nvm"
SKIP_NVM="${SKIP_NVM:-1}"
if [ "$SKIP_NVM" != "1" ]; then
  if [ ! -s "$NVM_DIR/nvm.sh" ]; then
    echo "[INFO] Installing NVM..."
    tmp_install="/tmp/nvm_install.sh"
    rm -f "$tmp_install"
    urls=(
      "https://cdn.jsdelivr.net/gh/nvm-sh/nvm@v0.39.7/install.sh"
      "https://ghproxy.com/https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh"
      "https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh"
    )
    ok=0
    for u in "${urls[@]}"; do
      echo "[INFO] Trying $u"
      if curl -fsSL --connect-timeout 8 --max-time 120 --retry 5 --retry-delay 2 -o "$tmp_install" "$u"; then
        ok=1; break
      else
        echo "[WARN] curl failed: $u"
        if command -v wget >/dev/null 2>&1; then
          if wget -qO "$tmp_install" "$u"; then
            ok=1; break
          else
            echo "[WARN] wget failed: $u"
          fi
        fi
      fi
    done
    if [ "$ok" -eq 1 ]; then
      bash "$tmp_install" || true
    fi
  fi
else
  echo "[INFO] SKIP_NVM=1 (default): skip NVM and use direct Node installer"
fi

install_node_direct() {
  # Directly install Node from mainland-friendly mirrors without NVM (fallback)
  local version="${NODE_VERSION:-20.16.0}"
  local arch
  case "$(uname -m)" in
    x86_64) arch="linux-x64" ;;
    aarch64|arm64) arch="linux-arm64" ;;
    armv7l) arch="linux-armv7l" ;;
    *) echo "[ERROR] Unsupported arch: $(uname -m)" >&2; return 1 ;;
  esac
  local tgz="node-v${version}-${arch}.tar.xz"
  local urls=(
    "https://npmmirror.com/mirrors/node/v${version}/${tgz}"
    "https://mirrors.tuna.tsinghua.edu.cn/nodejs-release/v${version}/${tgz}"
    "https://mirrors.ustc.edu.cn/node/v${version}/${tgz}"
    "https://nodejs.org/dist/v${version}/${tgz}"
  )
  local tmp="/tmp/${tgz}"
  local got="0"
  for u in "${urls[@]}"; do
    echo "[INFO] Fetching Node ${version} from: $u"
    if curl -fSL --connect-timeout 8 --max-time 300 --retry 5 --retry-delay 2 -o "$tmp" "$u" >/dev/null 2>&1 || wget -qO "$tmp" "$u"; then
      got="1"; break
    else
      echo "[WARN] Download failed: $u"
    fi
  done
  if [ "$got" != "1" ] || [ ! -s "$tmp" ]; then
    echo "[ERROR] All Node mirrors failed" >&2
    return 1
  fi
  run_sudo mkdir -p /usr/local
  run_sudo tar -xJf "$tmp" -C /usr/local
  local rootdir
  rootdir=$(tar -tf "$tmp" | head -1 | cut -d/ -f1)
  if [ -z "$rootdir" ]; then
    echo "[ERROR] Could not determine extracted directory name" >&2
    return 1
  fi
  run_sudo ln -sf "/usr/local/${rootdir}/bin/node" /usr/local/bin/node
  run_sudo ln -sf "/usr/local/${rootdir}/bin/npm" /usr/local/bin/npm
  run_sudo ln -sf "/usr/local/${rootdir}/bin/npx" /usr/local/bin/npx
  echo "[OK] Node ${version} installed at /usr/local/${rootdir}"
}

# Load NVM if present; otherwise try fallback direct Node install
if [ -s "$NVM_DIR/nvm.sh" ]; then
  # shellcheck disable=SC1090
  . "$NVM_DIR/nvm.sh"
else
  echo "[WARN] NVM not found after running installer; trying git mirrors..."
  run_sudo rm -rf "$NVM_DIR" || true
  mirrors=(
    "https://gitee.com/mirrors/nvm.git"
    "https://gitcode.com/mirrors/nvm.git"
  )
  for repo in "${mirrors[@]}"; do
    echo "[INFO] Cloning NVM from mirror: $repo"
    if git clone --depth=1 -b v0.39.7 "$repo" "$NVM_DIR" >/dev/null 2>&1; then
      break
    else
      echo "[WARN] Clone failed from $repo"
    fi
  done
  if [ -s "$NVM_DIR/nvm.sh" ]; then
    # shellcheck disable=SC1090
    . "$NVM_DIR/nvm.sh"
  else
    echo "[WARN] NVM still unavailable; using direct Node installer fallback"
    install_node_direct || {
      echo "[ERROR] Node installation fallback failed" >&2
      exit 1
    }
    # Set npm registry for CN network
    npm config set registry https://registry.npmmirror.com >/dev/null 2>&1 || true
    npm config set fund false audit false >/dev/null 2>&1 || true
    node -v
    npm -v
    echo "[OK] Node environment ready (without NVM)"
    exit 0
  fi
fi

# Install Node 20 if not present (use CN mirror)
export NVM_NODEJS_ORG_MIRROR="${NVM_NODEJS_ORG_MIRROR:-https://npmmirror.com/mirrors/node}"
if ! nvm ls 20 >/dev/null 2>&1; then
  echo "[INFO] Installing Node.js 20 (mirror: $NVM_NODEJS_ORG_MIRROR) ..."
  nvm install 20
fi
nvm alias default 20
nvm use 20 >/dev/null

# Speed up npm for CN network (idempotent)
npm config set registry https://registry.npmmirror.com >/dev/null 2>&1 || true
npm config set fund false audit false >/dev/null 2>&1 || true

node -v
npm -v
echo "[OK] Node environment ready"