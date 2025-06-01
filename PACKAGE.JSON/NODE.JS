{
  "name": "quantumunified-pro",
  "version": "3.0.0",
  "description": "세계 최초의 양자컴퓨터 + GPU + CPU 통합 혁신 플랫폼",
  "main": "quantum-unified.js",
  "scripts": {
    "start": "python -m http.server 8000",
    "dev": "live-server --port=8000 --open=/index.html",
    "build": "npm run build:css && npm run build:js",
    "build:css": "postcss quantum-unified.css -o dist/quantum-unified.min.css --compress",
    "build:js": "terser quantum-unified.js -o dist/quantum-unified.min.js --compress --mangle",
    "test": "jest tests/",
    "test:watch": "jest tests/ --watch",
    "test:coverage": "jest tests/ --coverage",
    "lint": "eslint quantum-unified.js",
    "lint:fix": "eslint quantum-unified.js --fix",
    "format": "prettier --write *.{js,css,html,md}",
    "validate": "html-validate index.html",
    "benchmark": "node scripts/benchmark.js",
    "deploy": "gh-pages -d .",
    "docker:build": "docker build -t quantumunified-pro .",
    "docker:run": "docker run -p 8000:8000 quantumunified-pro",
    "precommit": "npm run lint && npm run test && npm run validate"
  },
  "keywords": [
    "quantum-computing",
    "gpu-acceleration",
    "webgl",
    "web-workers",
    "color-generation",
    "performance",
    "efficiency",
    "hybrid-computing",
    "parallel-processing",
    "innovation"
  ],
  "author": {
    "name": "QuantumUnified Technologies",
    "email": "dev@quantumunified.tech",
    "url": "https://quantumunified.tech"
  },
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/quantumunified/quantumunified-pro.git"
  },
  "bugs": {
    "url": "https://github.com/quantumunified/quantumunified-pro/issues"
  },
  "homepage": "https://quantumunified.tech",
  "engines": {
    "node": ">=14.0.0",
    "npm": ">=6.0.0"
  },
  "browserslist": [
    "last 2 Chrome versions",
    "last 2 Firefox versions",
    "last 2 Safari versions",
    "last 2 Edge versions"
  ],
  "devDependencies": {
    "@babel/core": "^7.22.0",
    "@babel/preset-env": "^7.22.0",
    "eslint": "^8.42.0",
    "eslint-config-prettier": "^8.8.0",
    "eslint-plugin-webgl": "^1.2.0",
    "gh-pages": "^5.0.0",
    "html-validate": "^8.0.0",
    "jest": "^29.5.0",
    "jest-environment-jsdom": "^29.5.0",
    "live-server": "^1.2.2",
    "postcss": "^8.4.24",
    "postcss-cli": "^10.1.0",
    "postcss-csso": "^6.0.1",
    "prettier": "^2.8.8",
    "terser": "^5.18.0",
    "webpack": "^5.88.0",
    "webpack-cli": "^5.1.0",
    "webpack-dev-server": "^4.15.0"
  },
  "dependencies": {
    "canvas": "^2.11.2",
    "gl": "^6.0.2",
    "gl-matrix": "^3.4.3",
    "webgl-debug": "^2.0.1"
  },
  "peerDependencies": {
    "qiskit": "^0.39.0",
    "tensorflow": "^4.2.0"
  },
  "optionalDependencies": {
    "gpu.js": "^2.16.0",
    "opencv.js": "^1.2.1"
  },
  "jest": {
    "testEnvironment": "jsdom",
    "setupFilesAfterEnv": ["<rootDir>/tests/setup.js"],
    "testMatch": ["<rootDir>/tests/**/*.test.js"],
    "collectCoverageFrom": [
      "quantum-unified.js",
      "!node_modules/**"
    ],
    "coverageThreshold": {
      "global": {
        "branches": 80,
        "functions": 80,
        "lines": 80,
        "statements": 80
      }
    }
  },
  "eslintConfig": {
    "env": {
      "browser": true,
      "es2021": true,
      "worker": true,
      "jest": true
    },
    "extends": [
      "eslint:recommended",
      "prettier"
    ],
    "parserOptions": {
      "ecmaVersion": 2021,
      "sourceType": "module"
    },
    "rules": {
      "no-console": "warn",
      "no-debugger": "error",
      "no-unused-vars": "error",
      "prefer-const": "error",
      "no-var": "error"
    },
    "globals": {
      "QuantumUnified": "readonly",
      "COMPUTE_TYPES": "readonly",
      "QUANTUM_CONFIG": "readonly"
    }
  },
  "prettier": {
    "semi": true,
    "singleQuote": true,
    "tabWidth": 2,
    "trailingComma": "es5",
    "printWidth": 100,
    "bracketSpacing": true,
    "arrowParens": "always"
  },
  "funding": {
    "type": "opencollective",
    "url": "https://opencollective.com/quantumunified"
  },
  "config": {
    "quantum": {
      "maxQubits": 16,
      "simulationMode": "local",
      "backends": ["qasm_simulator", "statevector_simulator"]
    },
    "gpu": {
      "preferredAPI": "webgl2",
      "fallback": "webgl",
      "maxTextureSize": 4096
    },
    "performance": {
      "targetFPS": 60,
      "maxWorkers": "auto",
      "memoryLimit": "1GB"
    }
  }
}
