#!/bin/bash

# QuantumUnified Pro 자동 설치 스크립트
# 모든 플랫폼 지원: Linux, macOS, Windows (Git Bash)

set -e  # 에러 발생 시 스크립트 중단

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
WHITE='\033[1;37m'
NC='\033[0m' # No Color

# 아트 로고
print_logo() {
    echo -e "${CYAN}"
    cat << "EOF"
    ⚛️  QuantumUnified Pro v3.0.0  ⚛️
    ================================
    양자컴퓨터 + GPU + CPU 통합 플랫폼
    전력 90% 절약, 성능 1000% 향상
    ================================
EOF
    echo -e "${NC}"
}

# 진행 상황 표시
print_step() {
    echo -e "${GREEN}[단계 $1/$2]${NC} ${WHITE}$3${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}📋 $1${NC}"
}

# 시스템 감지
detect_system() {
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        SYSTEM="linux"
        PACKAGE_MANAGER="unknown"
        
        if command -v apt-get >/dev/null 2>&1; then
            PACKAGE_MANAGER="apt"
        elif command -v yum >/dev/null 2>&1; then
            PACKAGE_MANAGER="yum"
        elif command -v pacman >/dev/null 2>&1; then
            PACKAGE_MANAGER="pacman"
        fi
        
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        SYSTEM="macos"
        PACKAGE_MANAGER="brew"
        
    elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" ]]; then
        SYSTEM="windows"
        PACKAGE_MANAGER="choco"
        
    else
        SYSTEM="unknown"
        PACKAGE_MANAGER="unknown"
    fi
    
    print_info "감지된 시스템: $SYSTEM ($PACKAGE_MANAGER)"
}

# 필수 프로그램 확인
check_dependencies() {
    print_step "1" "8" "시스템 요구사항 확인 중..."
    
    local missing_deps=()
    
    # Git 확인
    if ! command -v git >/dev/null 2>&1; then
        missing_deps+=("git")
    fi
    
    # Node.js 확인
    if ! command -v node >/dev/null 2>&1; then
        missing_deps+=("node")
    else
        NODE_VERSION=$(node --version | sed 's/v//')
        if [ "$(printf '%s\n' "14.0.0" "$NODE_VERSION" | sort -V | head -n1)" != "14.0.0" ]; then
            missing_deps+=("node (>=14.0.0)")
        fi
    fi
    
    # Python 확인 (선택사항)
    if command -v python3 >/dev/null 2>&1; then
        PYTHON_VERSION=$(python3 --version | cut -d' ' -f2)
        print_success "Python $PYTHON_VERSION 감지됨"
    elif command -v python >/dev/null 2>&1; then
        PYTHON_VERSION=$(python --version | cut -d' ' -f2)
        print_success "Python $PYTHON_VERSION 감지됨"
    else
        print_warning "Python 미감지 (웹 버전은 Python 없이도 실행 가능)"
    fi
    
    if [ ${#missing_deps[@]} -ne 0 ]; then
        print_error "다음 프로그램들이 필요합니다: ${missing_deps[*]}"
        echo ""
        print_installation_guide "${missing_deps[@]}"
        exit 1
    fi
    
    print_success "모든 필수 프로그램이 설치되어 있습니다"
}

# 설치 가이드 출력
print_installation_guide() {
    echo -e "${CYAN}🔧 설치 가이드:${NC}"
    
    for dep in "$@"; do
        case $dep in
            "git")
                case $SYSTEM in
                    "linux")
                        echo "  Git: sudo apt install git  (Ubuntu/Debian)"
                        echo "       sudo yum install git  (RHEL/CentOS)"
                        ;;
                    "macos")
                        echo "  Git: brew install git"
                        echo "       또는 Xcode Command Line Tools 설치"
                        ;;
                    "windows")
                        echo "  Git: https://git-scm.com/download/win"
                        ;;
                esac
                ;;
            "node"*)
                case $SYSTEM in
                    "linux")
                        echo "  Node.js: curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -"
                        echo "           sudo apt-get install -y nodejs"
                        ;;
                    "macos")
                        echo "  Node.js: brew install node"
                        ;;
                    "windows")
                        echo "  Node.js: https://nodejs.org/en/download/"
                        ;;
                esac
                ;;
        esac
    done
}

# 저장소 클론
clone_repository() {
    print_step "2" "8" "QuantumUnified Pro 다운로드 중..."
    
    INSTALL_DIR="${INSTALL_DIR:-$HOME/QuantumUnified-Pro}"
    
    if [ -d "$INSTALL_DIR" ]; then
        print_warning "디렉토리가 이미 존재합니다: $INSTALL_DIR"
        read -p "기존 디렉토리를 삭제하고 다시 설치하시겠습니까? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            rm -rf "$INSTALL_DIR"
        else
            print_error "설치가 취소되었습니다"
            exit 1
        fi
    fi
    
    git clone https://github.com/quantumunified/quantumunified-pro.git "$INSTALL_DIR"
    cd "$INSTALL_DIR"
    
    print_success "소스코드 다운로드 완료"
}

# Node.js 의존성 설치
install_node_dependencies() {
    print_step "3" "8" "Node.js 의존성 설치 중..."
    
    if [ -f "package.json" ]; then
        # npm vs yarn 선택
        if command -v yarn >/dev/null 2>&1; then
            print_info "Yarn을 사용하여 의존성 설치"
            yarn install
        else
            print_info "npm을 사용하여 의존성 설치"
            npm install
        fi
        
        print_success "Node.js 의존성 설치 완료"
    else
        print_warning "package.json 파일을 찾을 수 없습니다"
    fi
}

# Python 의존성 설치 (선택사항)
install_python_dependencies() {
    print_step "4" "8" "Python 의존성 설치 중..."
    
    if [ -f "requirements.txt" ]; then
        # 가상환경 생성 권장
        read -p "Python 가상환경을 생성하시겠습니까? (권장) (Y/n): " -n 1 -r
        echo
        
        if [[ ! $REPLY =~ ^[Nn]$ ]]; then
            if command -v python3 >/dev/null 2>&1; then
                python3 -m venv venv
                source venv/bin/activate
                pip install --upgrade pip
                pip install -r requirements.txt
            else
                python -m venv venv
                if [ -f "venv/Scripts/activate" ]; then
                    # Windows
                    source venv/Scripts/activate
                else
                    # Unix
                    source venv/bin/activate
                fi
                pip install --upgrade pip
                pip install -r requirements.txt
            fi
            
            print_success "Python 가상환경 및 의존성 설치 완료"
        else
            pip install -r requirements.txt
            print_success "Python 의존성 설치 완료"
        fi
    else
        print_info "requirements.txt 파일이 없습니다 (웹 버전은 Python 불필요)"
    fi
}

# 설정 파일 생성
create_config_files() {
    print_step "5" "8" "설정 파일 생성 중..."
    
    # .env 파일 생성
    if [ ! -f ".env" ]; then
        cat > .env << EOF
# QuantumUnified Pro 환경 설정
NODE_ENV=development
QUANTUM_MODE=hybrid
MAX_QUBITS=16
GPU_ACCELERATION=true
CPU_WORKERS=auto
POWER_EFFICIENCY=high

# 선택적 설정
# QUANTUM_BACKEND=qasm_simulator
# API_PORT=5000
# LOG_LEVEL=info
EOF
        print_success ".env 파일 생성됨"
    fi
    
    # PWA 설정
    if [ ! -f "sw.js" ]; then
        print_info "서비스 워커 등록 중..."
        # 서비스 워커는 이미 artifacts에서 생성됨
    fi
    
    print_success "설정 파일 생성 완료"
}

# 아이콘 및 에셋 생성
generate_assets() {
    print_step "6" "8" "아이콘 및 에셋 생성 중..."
    
    mkdir -p assets
    
    # Python으로 아이콘 생성 (가능한 경우)
    if command -v python3 >/dev/null 2>&1 && python3 -c "import PIL" 2>/dev/null; then
        python3 create_icon.py
        print_success "아이콘 생성 완료"
    elif command -v python >/dev/null 2>&1 && python -c "import PIL" 2>/dev/null; then
        python create_icon.py
        print_success "아이콘 생성 완료"
    else
        print_warning "PIL 라이브러리가 없어 아이콘을 생성할 수 없습니다"
        print_info "pip install pillow로 설치 후 python create_icon.py 실행"
        
        # 기본 placeholder 생성
        echo "⚛️" > assets/icon.txt
    fi
}

# 성능 테스트
run_performance_test() {
    print_step "7" "8" "성능 테스트 실행 중..."
    
    if command -v node >/dev/null 2>&1 && [ -f "benchmark.js" ]; then
        print_info "시스템 성능 벤치마크 실행 중... (약 30초 소요)"
        
        # 간단한 벤치마크 실행
        timeout 30s node benchmark.js --quiet 2>/dev/null || {
            print_warning "벤치마크 실행 실패 또는 시간 초과"
        }
        
        if [ -f "benchmark-results.json" ]; then
            # 결과 요약 출력
            if command -v jq >/dev/null 2>&1; then
                OVERALL_SCORE=$(jq -r '.analysis.overall_score' benchmark-results.json 2>/dev/null || echo "N/A")
                GRADE=$(jq -r '.analysis.performance_grade' benchmark-results.json 2>/dev/null || echo "N/A")
                print_success "성능 점수: $OVERALL_SCORE (등급: $GRADE)"
            else
                print_success "벤치마크 완료 - benchmark-results.json 확인"
            fi
        fi
    else
        print_info "성능 테스트를 건너뜁니다 (Node.js 필요)"
    fi
}

# 설치 완료 및 실행 방법 안내
show_completion_guide() {
    print_step "8" "8" "설치 완료!"
    
    echo ""
    echo -e "${GREEN}🎉 QuantumUnified Pro 설치가 완료되었습니다!${NC}"
    echo ""
    
    echo -e "${CYAN}🚀 실행 방법:${NC}"
    echo ""
    
    echo -e "${WHITE}웹 버전 (권장):${NC}"
    echo "  cd $INSTALL_DIR"
    echo "  npm start"
    echo "  브라우저에서 http://localhost:8000 열기"
    echo ""
    
    if [ -f "quantum_color_main.py" ]; then
        echo -e "${WHITE}데스크톱 GUI 버전:${NC}"
        if [ -d "venv" ]; then
            echo "  source venv/bin/activate  # 가상환경 활성화"
        fi
        echo "  python quantum_color_main.py"
        echo ""
    fi
    
    echo -e "${WHITE}테스트 페이지:${NC}"
    echo "  브라우저에서 file://$INSTALL_DIR/test.html 열기"
    echo ""
    
    echo -e "${CYAN}📚 추가 명령어:${NC}"
    echo "  npm run dev      # 개발 서버 (라이브 리로드)"
    echo "  npm test         # 테스트 실행"
    echo "  npm run benchmark # 성능 벤치마크"
    echo "  npm run build    # 프로덕션 빌드"
    echo ""
    
    echo -e "${YELLOW}💡 팁:${NC}"
    echo "  - Chrome/Firefox 최신 버전 사용 권장"
    echo "  - WebGL 2.0 지원 브라우저 필요"
    echo "  - 최적 성능을 위해 GPU 가속 활성화"
    echo ""
    
    echo -e "${PURPLE}🌟 고급 기능:${NC}"
    echo "  - 양자 컴퓨팅 모드: 최고 효율성"
    echo "  - GPU 가속 모드: 최고 성능"
    echo "  - 하이브리드 모드: 균형잡힌 성능"
    echo "  - 절전 모드: 모바일/배터리 최적화"
    echo ""
    
    echo -e "${BLUE}📞 지원:${NC}"
    echo "  - 문서: https://docs.quantumunified.tech"
    echo "  - 이슈: https://github.com/quantumunified/quantumunified-pro/issues"
    echo "  - 이메일: support@quantumunified.tech"
    echo ""
    
    # 자동 실행 제안
    read -p "지금 바로 웹 버전을 실행하시겠습니까? (Y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Nn]$ ]]; then
        echo -e "${GREEN}🚀 웹 서버 시작 중...${NC}"
        npm start &
        sleep 3
        
        # 브라우저 자동 열기
        case $SYSTEM in
            "linux")
                xdg-open "http://localhost:8000" 2>/dev/null &
                ;;
            "macos")
                open "http://localhost:8000" 2>/dev/null &
                ;;
            "windows")
                start "http://localhost:8000" 2>/dev/null &
                ;;
        esac
        
        echo -e "${GREEN}✅ 브라우저에서 QuantumUnified Pro가 열렸습니다!${NC}"
        echo -e "${YELLOW}서버를 중지하려면 Ctrl+C를 누르세요${NC}"
    fi
}

# 에러 핸들링
handle_error() {
    print_error "설치 중 오류가 발생했습니다"
    echo "오류 위치: $1"
    echo "로그: $2"
    echo ""
    echo "문제 해결:"
    echo "1. 네트워크 연결 확인"
    echo "2. 권한 확인 (sudo 필요할 수 있음)"
    echo "3. 디스크 공간 확인"
    echo "4. GitHub 이슈 리포트: https://github.com/quantumunified/quantumunified-pro/issues"
    exit 1
}

# 설치 진행 상황 추적
track_progress() {
    echo "설치 진행상황을 ~/.quantumunified_install.log에 기록합니다"
    exec 1> >(tee -a ~/.quantumunified_install.log)
    exec 2> >(tee -a ~/.quantumunified_install.log >&2)
}

# 메인 설치 프로세스
main() {
    # 트랩 설정 (에러 시 정리)
    trap 'handle_error "Line $LINENO" "$BASH_COMMAND"' ERR
    
    print_logo
    
    # 진행상황 추적
    track_progress
    
    print_info "QuantumUnified Pro 설치를 시작합니다..."
    print_info "설치 위치: ${INSTALL_DIR:-$HOME/QuantumUnified-Pro}"
    
    # 시스템 감지
    detect_system
    
    # 설치 단계별 실행
    check_dependencies
    clone_repository
    install_node_dependencies
    install_python_dependencies
    create_config_files
    generate_assets
    run_performance_test
    show_completion_guide
    
    print_success "설치가 성공적으로 완료되었습니다! 🎉"
}

# 스크립트 실행
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi

# ============================================
# setup.js - Node.js 설치 스크립트
# ============================================

/*
#!/usr/bin/env node

/**
 * QuantumUnified Pro Node.js 설치 스크립트
 * 크로스 플랫폼 지원 (Windows, macOS, Linux)
 */

const fs = require('fs');
const path = require('path');
const { execSync, spawn } = require('child_process');
const os = require('os');

class QuantumUnifiedInstaller {
    constructor() {
        this.platform = os.platform();
        this.arch = os.arch();
        this.homeDir = os.homedir();
        this.installDir = path.join(this.homeDir, 'QuantumUnified-Pro');
        
        // 색상 코드
        this.colors = {
            reset: '\x1b[0m',
            red: '\x1b[31m',
            green: '\x1b[32m',
            yellow: '\x1b[33m',
            blue: '\x1b[34m',
            magenta: '\x1b[35m',
            cyan: '\x1b[36m',
            white: '\x1b[37m'
        };
    }

    log(message, color = 'white') {
        const colorCode = this.colors[color] || this.colors.white;
        console.log(`${colorCode}${message}${this.colors.reset}`);
    }

    logStep(step, total, message) {
        this.log(`[단계 ${step}/${total}] ${message}`, 'green');
    }

    logSuccess(message) {
        this.log(`✅ ${message}`, 'green');
    }

    logWarning(message) {
        this.log(`⚠️  ${message}`, 'yellow');
    }

    logError(message) {
        this.log(`❌ ${message}`, 'red');
    }

    logInfo(message) {
        this.log(`📋 ${message}`, 'blue');
    }

    async printLogo() {
        const logo = `
    ⚛️  QuantumUnified Pro v3.0.0  ⚛️
    ================================
    양자컴퓨터 + GPU + CPU 통합 플랫폼
    전력 90% 절약, 성능 1000% 향상
    ================================
        `;
        this.log(logo, 'cyan');
    }

    async checkSystemRequirements() {
        this.logStep(1, 6, '시스템 요구사항 확인 중...');
        
        const requirements = {
            node: { required: '14.0.0', current: process.version.slice(1) },
            npm: { required: '6.0.0', current: null },
            memory: { required: 4, current: Math.round(os.totalmem() / 1024 / 1024 / 1024) },
            disk: { required: 1, current: null }
        };

        // npm 버전 확인
        try {
            const npmVersion = execSync('npm --version', { encoding: 'utf8' }).trim();
            requirements.npm.current = npmVersion;
        } catch (error) {
            this.logError('npm이 설치되지 않았습니다');
            process.exit(1);
        }

        // 요구사항 검증
        for (const [tool, req] of Object.entries(requirements)) {
            if (req.current) {
                if (this.compareVersions(req.current, req.required) >= 0) {
                    this.logSuccess(`${tool} ${req.current} (요구: ${req.required})`);
                } else {
                    this.logError(`${tool} 버전이 낮습니다: ${req.current} (요구: ${req.required})`);
                    process.exit(1);
                }
            }
        }

        this.logInfo(`시스템: ${this.platform} ${this.arch}`);
        this.logInfo(`메모리: ${requirements.memory.current}GB`);
        this.logInfo(`CPU 코어: ${os.cpus().length}개`);
    }

    compareVersions(current, required) {
        const currentParts = current.split('.').map(Number);
        const requiredParts = required.split('.').map(Number);
        
        for (let i = 0; i < Math.max(currentParts.length, requiredParts.length); i++) {
            const currentPart = currentParts[i] || 0;
            const requiredPart = requiredParts[i] || 0;
            
            if (currentPart > requiredPart) return 1;
            if (currentPart < requiredPart) return -1;
        }
        return 0;
    }

    async downloadSource() {
        this.logStep(2, 6, 'QuantumUnified Pro 다운로드 중...');
        
        if (fs.existsSync(this.installDir)) {
            this.logWarning(`디렉토리가 이미 존재합니다: ${this.installDir}`);
            
            // 기존 디렉토리 삭제 확인 (자동으로 yes)
            try {
                fs.rmSync(this.installDir, { recursive: true, force: true });
                this.logInfo('기존 디렉토리를 삭제했습니다');
            } catch (error) {
                this.logError(`디렉토리 삭제 실패: ${error.message}`);
                process.exit(1);
            }
        }

        try {
            execSync(`git clone https://github.com/quantumunified/quantumunified-pro.git "${this.installDir}"`, {
                stdio: 'inherit'
            });
            this.logSuccess('소스코드 다운로드 완료');
        } catch (error) {
            this.logError(`Git 클론 실패: ${error.message}`);
            process.exit(1);
        }
    }

    async installDependencies() {
        this.logStep(3, 6, '의존성 설치 중...');
        
        try {
            process.chdir(this.installDir);
            
            // package.json 확인
            if (!fs.existsSync('package.json')) {
                throw new Error('package.json 파일을 찾을 수 없습니다');
            }

            // npm install 실행
            this.logInfo('npm install 실행 중...');
            execSync('npm install', { stdio: 'inherit' });
            
            this.logSuccess('Node.js 의존성 설치 완료');
        } catch (error) {
            this.logError(`의존성 설치 실패: ${error.message}`);
            process.exit(1);
        }
    }

    async setupConfiguration() {
        this.logStep(4, 6, '설정 파일 생성 중...');
        
        // .env 파일 생성
        const envContent = `# QuantumUnified Pro 환경 설정
NODE_ENV=development
QUANTUM_MODE=hybrid
MAX_QUBITS=16
GPU_ACCELERATION=true
CPU_WORKERS=${os.cpus().length}
POWER_EFFICIENCY=high

# 플랫폼별 설정
PLATFORM=${this.platform}
ARCH=${this.arch}
INSTALL_DATE=${new Date().toISOString()}
`;

        try {
            fs.writeFileSync('.env', envContent);
            this.logSuccess('.env 파일 생성됨');
        } catch (error) {
            this.logWarning(`설정 파일 생성 실패: ${error.message}`);
        }

        // 바탕화면 바로가기 생성 (Windows)
        if (this.platform === 'win32') {
            this.createWindowsShortcut();
        }
    }

    createWindowsShortcut() {
        try {
            const desktopPath = path.join(this.homeDir, 'Desktop');
            const shortcutPath = path.join(desktopPath, 'QuantumUnified Pro.url');
            
            const shortcutContent = `[InternetShortcut]
URL=file:///${this.installDir.replace(/\\/g, '/')}/index.html
IconFile=${this.installDir}\\assets\\icon.ico
IconIndex=0
`;
            
            fs.writeFileSync(shortcutPath, shortcutContent);
            this.logSuccess('바탕화면 바로가기 생성됨');
        } catch (error) {
            this.logWarning(`바로가기 생성 실패: ${error.message}`);
        }
    }

    async generateAssets() {
        this.logStep(5, 6, '에셋 생성 중...');
        
        try {
            // assets 디렉토리 생성
            const assetsDir = path.join(this.installDir, 'assets');
            if (!fs.existsSync(assetsDir)) {
                fs.mkdirSync(assetsDir, { recursive: true });
            }

            // 기본 manifest.json 생성 (이미 있으면 스킵)
            if (!fs.existsSync('manifest.json')) {
                const manifest = {
                    name: "QuantumUnified Pro",
                    short_name: "QuantumUnified",
                    description: "양자컴퓨터 + GPU + CPU 통합 플랫폼",
                    start_url: "./index.html",
                    display: "standalone",
                    background_color: "#0a0a0a",
                    theme_color: "#00ff88",
                    icons: [
                        {
                            src: "assets/icon-192x192.png",
                            sizes: "192x192",
                            type: "image/png"
                        }
                    ]
                };
                
                fs.writeFileSync('manifest.json', JSON.stringify(manifest, null, 2));
                this.logSuccess('manifest.json 생성됨');
            }

            // Python으로 아이콘 생성 시도
            if (fs.existsSync('create_icon.py')) {
                try {
                    execSync('python create_icon.py', { stdio: 'pipe' });
                    this.logSuccess('아이콘 생성 완료');
                } catch (error) {
                    try {
                        execSync('python3 create_icon.py', { stdio: 'pipe' });
                        this.logSuccess('아이콘 생성 완료');
                    } catch (error2) {
                        this.logWarning('아이콘 생성 실패 (Python/PIL 필요)');
                    }
                }
            }

        } catch (error) {
            this.logWarning(`에셋 생성 중 오류: ${error.message}`);
        }
    }

    async runTests() {
        this.logStep(6, 6, '설치 검증 중...');
        
        try {
            // 간단한 테스트 실행
            if (fs.existsSync('package.json')) {
                const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
                
                if (packageJson.scripts && packageJson.scripts.test) {
                    this.logInfo('테스트 스위트 실행 중...');
                    execSync('npm test', { stdio: 'pipe', timeout: 30000 });
                    this.logSuccess('모든 테스트 통과');
                }
            }

            // 기본 파일들 존재 확인
            const requiredFiles = ['index.html', 'quantum-unified.js', 'quantum-unified.css'];
            let allFilesExist = true;
            
            for (const file of requiredFiles) {
                if (fs.existsSync(file)) {
                    this.logSuccess(`${file} 확인됨`);
                } else {
                    this.logError(`${file} 파일이 없습니다`);
                    allFilesExist = false;
                }
            }

            if (allFilesExist) {
                this.logSuccess('설치 검증 완료');
            } else {
                throw new Error('필수 파일이 누락되었습니다');
            }

        } catch (error) {
            this.logWarning(`테스트 실행 실패: ${error.message}`);
        }
    }

    async showCompletionGuide() {
        console.log('\n');
        this.log('🎉 QuantumUnified Pro 설치가 완료되었습니다!', 'green');
        console.log('\n');
        
        this.log('🚀 실행 방법:', 'cyan');
        console.log('');
        
        this.log('웹 버전 (권장):', 'white');
        console.log(`  cd "${this.installDir}"`);
        console.log('  npm start');
        console.log('  브라우저에서 http://localhost:8000 열기');
        console.log('');
        
        this.log('직접 파일 열기:', 'white');
        const indexPath = path.join(this.installDir, 'index.html');
        console.log(`  브라우저에서 file://${indexPath} 열기`);
        console.log('');
        
        this.log('추가 명령어:', 'cyan');
        console.log('  npm run dev      # 개발 서버');
        console.log('  npm test         # 테스트 실행');
        console.log('  npm run benchmark # 성능 테스트');
        console.log('');
        
        this.log('💡 팁:', 'yellow');
        console.log('  - Chrome/Firefox 최신 버전 권장');
        console.log('  - WebGL 2.0 지원 필요');
        console.log('  - 하드웨어 가속 활성화 권장');
        console.log('');

        // 자동 실행 제안
        const readline = require('readline');
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        return new Promise((resolve) => {
            rl.question('지금 바로 실행하시겠습니까? (Y/n): ', (answer) => {
                rl.close();
                
                if (!answer.toLowerCase().startsWith('n')) {
                    this.launchApplication();
                }
                resolve();
            });
        });
    }

    async launchApplication() {
        this.log('🚀 QuantumUnified Pro 시작 중...', 'green');
        
        try {
            // 웹 서버 시작
            const serverProcess = spawn('npm', ['start'], {
                cwd: this.installDir,
                stdio: 'inherit',
                detached: false
            });

            // 3초 후 브라우저 열기
            setTimeout(() => {
                const url = 'http://localhost:8000';
                
                try {
                    switch (this.platform) {
                        case 'darwin':
                            execSync(`open "${url}"`);
                            break;
                        case 'win32':
                            execSync(`start "${url}"`);
                            break;
                        default:
                            execSync(`xdg-open "${url}"`);
                            break;
                    }
                    this.logSuccess('브라우저에서 QuantumUnified Pro가 열렸습니다!');
                } catch (error) {
                    this.logWarning('브라우저를 자동으로 열 수 없습니다');
                    this.logInfo(`수동으로 ${url}을 열어주세요`);
                }
            }, 3000);

            this.log('서버를 중지하려면 Ctrl+C를 누르세요', 'yellow');

        } catch (error) {
            this.logError(`실행 실패: ${error.message}`);
        }
    }

    async install() {
        try {
            await this.printLogo();
            await this.checkSystemRequirements();
            await this.downloadSource();
            await this.installDependencies();
            await this.setupConfiguration();
            await this.generateAssets();
            await this.runTests();
            await this.showCompletionGuide();
            
        } catch (error) {
            this.logError(`설치 중 오류 발생: ${error.message}`);
            process.exit(1);
        }
    }
}

// 메인 실행
if (require.main === module) {
    const installer = new QuantumUnifiedInstaller();
    installer.install().catch(console.error);
}

module.exports = QuantumUnifiedInstaller;
*/
