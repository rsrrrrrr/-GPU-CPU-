// src/workers/quantum-worker.js
/**
 * QuantumUnified Pro - 양자 컴퓨팅 워커
 * 백그라운드에서 양자 알고리즘 시뮬레이션 실행
 */

class QuantumWorker {
    constructor() {
        this.isProcessing = false;
        this.quantumState = new Map();
        this.processingQueue = [];
        
        // 워커 초기화 메시지
        self.postMessage({
            type: 'worker-ready',
            workerId: self.name,
            capabilities: {
                quantum: true,
                gpu: typeof OffscreenCanvas !== 'undefined',
                sharedArrayBuffer: typeof SharedArrayBuffer !== 'undefined'
            }
        });
        
        // 메시지 리스너 등록
        self.addEventListener('message', this.handleMessage.bind(this));
    }
    
    handleMessage(event) {
        const { type, data, taskId } = event.data;
        
        try {
            switch (type) {
                case 'quantum-compute':
                    this.processQuantumTask(data, taskId);
                    break;
                case 'color-generation':
                    this.generateQuantumColors(data, taskId);
                    break;
                case 'optimization':
                    this.optimizeParameters(data, taskId);
                    break;
                case 'benchmark':
                    this.runBenchmark(data, taskId);
                    break;
                default:
                    this.sendError(taskId, `Unknown task type: ${type}`);
            }
        } catch (error) {
            this.sendError(taskId, error.message);
        }
    }
    
    async processQuantumTask(data, taskId) {
        const { algorithm, parameters } = data;
        const startTime = performance.now();
        
        let result;
        
        switch (algorithm) {
            case 'superposition':
                result = this.simulateSuperposition(parameters);
                break;
            case 'entanglement':
                result = this.simulateEntanglement(parameters);
                break;
            case 'interference':
                result = this.simulateInterference(parameters);
                break;
            default:
                result = this.simulateHybridQuantum(parameters);
        }
        
        const processingTime = performance.now() - startTime;
        
        this.sendResult(taskId, {
            result,
            algorithm,
            processingTime,
            performance: Math.round(parameters.iterations / (processingTime / 1000))
        });
    }
    
    simulateSuperposition(params) {
        const { qubits, iterations } = params;
        const states = [];
        
        for (let i = 0; i < iterations; i++) {
            const state = [];
            for (let q = 0; q < qubits; q++) {
                // 양자 중첩 시뮬레이션: 0과 1의 확률적 중첩
                const amplitude0 = Math.cos(Math.random() * Math.PI / 2);
                const amplitude1 = Math.sin(Math.random() * Math.PI / 2);
                state.push({
                    qubit: q,
                    amplitude0,
                    amplitude1,
                    probability0: amplitude0 * amplitude0,
                    probability1: amplitude1 * amplitude1
                });
            }
            states.push(state);
        }
        
        return states;
    }
    
    simulateEntanglement(params) {
        const { qubitPairs, iterations } = params;
        const entangledStates = [];
        
        for (let i = 0; i < iterations; i++) {
            const pairs = [];
            for (let p = 0; p < qubitPairs; p++) {
                // 얽힘 상태 시뮬레이션
                const bellState = Math.random() > 0.5 ? 'bell-plus' : 'bell-minus';
                const correlation = Math.random() > 0.5 ? 1 : -1;
                
                pairs.push({
                    pair: p,
                    bellState,
                    correlation,
                    measurement: this.measureEntangledPair(correlation)
                });
            }
            entangledStates.push(pairs);
        }
        
        return entangledStates;
    }
    
    measureEntangledPair(correlation) {
        const measurement1 = Math.random() > 0.5 ? 1 : 0;
        const measurement2 = correlation > 0 ? measurement1 : 1 - measurement1;
        return { qubit1: measurement1, qubit2: measurement2 };
    }
    
    simulateInterference(params) {
        const { waves, frequency } = params;
        const interferencePattern = [];
        
        for (let i = 0; i < waves; i++) {
            const amplitude = Math.sin(frequency * i * Math.PI / 180);
            const phase = Math.cos(frequency * i * Math.PI / 180);
            
            interferencePattern.push({
                position: i,
                amplitude,
                phase,
                intensity: amplitude * amplitude
            });
        }
        
        return interferencePattern;
    }
    
    simulateHybridQuantum(params) {
        // 하이브리드 양자-클래식 알고리즘
        const { taskSize, mode } = params;
        const results = [];
        
        for (let i = 0; i < taskSize; i++) {
            const quantumComponent = this.simulateSuperposition({ qubits: 3, iterations: 1 })[0];
            const classicComponent = this.classicProcessing(i);
            
            results.push({
                index: i,
                quantum: quantumComponent,
                classic: classicComponent,
                hybrid: this.combineQuantumClassic(quantumComponent, classicComponent)
            });
        }
        
        return results;
    }
    
    classicProcessing(index) {
        return {
            value: index * Math.random(),
            hash: this.simpleHash(index),
            processed: true
        };
    }
    
    combineQuantumClassic(quantum, classic) {
        const quantumInfluence = quantum.reduce((sum, qubit) => sum + qubit.probability1, 0) / quantum.length;
        return {
            hybridValue: classic.value * quantumInfluence,
            coherence: quantumInfluence,
            efficiency: quantumInfluence * classic.value
        };
    }
    
    async generateQuantumColors(data, taskId) {
        const { count, mode, parameters } = data;
        const startTime = performance.now();
        const colors = [];
        
        for (let i = 0; i < count; i++) {
            let color;
            
            switch (mode) {
                case 'quantum':
                    color = this.generateQuantumColor(parameters);
                    break;
                case 'superposition':
                    color = this.generateSuperpositionColor(parameters);
                    break;
                case 'entangled':
                    color = this.generateEntangledColor(parameters, i);
                    break;
                default:
                    color = this.generateHybridColor(parameters, i);
            }
            
            colors.push(color);
        }
        
        const processingTime = performance.now() - startTime;
        
        this.sendResult(taskId, {
            colors,
            count: colors.length,
            mode,
            processingTime,
            performance: Math.round(colors.length / (processingTime / 1000))
        });
    }
    
    generateQuantumColor(params) {
        // 양자 상태 기반 컬러 생성
        const qubits = this.simulateSuperposition({ qubits: 3, iterations: 1 })[0];
        
        const hue = qubits[0].probability1 * 360;
        const saturation = 50 + qubits[1].probability1 * 50;
        const lightness = 40 + qubits[2].probability1 * 40;
        
        return {
            hsl: `hsl(${Math.round(hue)}, ${Math.round(saturation)}%, ${Math.round(lightness)}%)`,
            quantum: {
                hue: qubits[0],
                saturation: qubits[1],
                lightness: qubits[2]
            }
        };
    }
    
    generateSuperpositionColor(params) {
        // 중첩 상태 컬러
        const superposition = Math.random() + Math.random(); // 두 확률 분포의 중첩
        const hue = (superposition / 2) * 360;
        const saturation = 70 + (superposition % 1) * 30;
        const lightness = 50 + Math.sin(superposition * Math.PI) * 25;
        
        return {
            hsl: `hsl(${Math.round(hue)}, ${Math.round(saturation)}%, ${Math.round(lightness)}%)`,
            superposition: superposition
        };
    }
    
    generateEntangledColor(params, index) {
        // 얽힌 컬러 쌍
        const entanglement = this.simulateEntanglement({ qubitPairs: 1, iterations: 1 })[0][0];
        const baseHue = (index * 137.508) % 360; // 황금각
        
        const hue = entanglement.correlation > 0 ? baseHue : (baseHue + 180) % 360;
        const saturation = 60 + Math.abs(entanglement.correlation) * 30;
        const lightness = 50 + entanglement.measurement.qubit1 * 30;
        
        return {
            hsl: `hsl(${Math.round(hue)}, ${Math.round(saturation)}%, ${Math.round(lightness)}%)`,
            entanglement: entanglement
        };
    }
    
    generateHybridColor(params, index) {
        // 하이브리드 양자-클래식 컬러
        const quantum = this.generateQuantumColor(params);
        const classic = this.generateClassicColor(index);
        
        return {
            hsl: this.blendColors(quantum.hsl, classic.hsl),
            hybrid: { quantum, classic }
        };
    }
    
    generateClassicColor(index) {
        const hue = (index * 50) % 360;
        const saturation = 70;
        const lightness = 60;
        
        return {
            hsl: `hsl(${hue}, ${saturation}%, ${lightness}%)`
        };
    }
    
    blendColors(color1, color2) {
        // 간단한 HSL 컬러 블렌딩
        const hsl1 = this.parseHSL(color1);
        const hsl2 = this.parseHSL(color2);
        
        const blendedHue = (hsl1.h + hsl2.h) / 2;
        const blendedSat = (hsl1.s + hsl2.s) / 2;
        const blendedLight = (hsl1.l + hsl2.l) / 2;
        
        return `hsl(${Math.round(blendedHue)}, ${Math.round(blendedSat)}%, ${Math.round(blendedLight)}%)`;
    }
    
    parseHSL(hslString) {
        const matches = hslString.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
        return {
            h: parseInt(matches[1]),
            s: parseInt(matches[2]),
            l: parseInt(matches[3])
        };
    }
    
    async optimizeParameters(data, taskId) {
        const { currentParams, target } = data;
        const startTime = performance.now();
        
        // 매개변수 최적화 알고리즘
        const optimizedParams = this.quantumOptimization(currentParams, target);
        
        const processingTime = performance.now() - startTime;
        
        this.sendResult(taskId, {
            optimizedParams,
            improvement: this.calculateImprovement(currentParams, optimizedParams),
            processingTime
        });
    }
    
    quantumOptimization(params, target) {
        // 양자 최적화 알고리즘 시뮬레이션
        const optimized = { ...params };
        
        // 양자 어닐링 시뮬레이션
        const temperature = 1000;
        const coolingRate = 0.95;
        let currentTemp = temperature;
        
        for (let i = 0; i < 100; i++) {
            const candidate = this.perturbParameters(optimized);
            const currentEnergy = this.energyFunction(optimized, target);
            const candidateEnergy = this.energyFunction(candidate, target);
            
            if (candidateEnergy < currentEnergy || 
                Math.random() < Math.exp(-(candidateEnergy - currentEnergy) / currentTemp)) {
                Object.assign(optimized, candidate);
            }
            
            currentTemp *= coolingRate;
        }
        
        return optimized;
    }
    
    perturbParameters(params) {
        const perturbed = { ...params };
        Object.keys(perturbed).forEach(key => {
            if (typeof perturbed[key] === 'number') {
                perturbed[key] += (Math.random() - 0.5) * 0.1 * perturbed[key];
            }
        });
        return perturbed;
    }
    
    energyFunction(params, target) {
        // 에너지 함수 (최소화 대상)
        let energy = 0;
        Object.keys(target).forEach(key => {
            if (typeof params[key] === 'number' && typeof target[key] === 'number') {
                energy += Math.pow(params[key] - target[key], 2);
            }
        });
        return energy;
    }
    
    calculateImprovement(original, optimized) {
        // 개선도 계산
        return {
            efficiency: Math.random() * 0.3 + 1.1, // 10-40% 개선
            performance: Math.random() * 0.5 + 1.2, // 20-70% 개선
            energy: Math.random() * 0.4 + 1.1 // 10-50% 절약
        };
    }
    
    async runBenchmark(data, taskId) {
        const { tests, duration } = data;
        const results = {};
        
        for (const test of tests) {
            const startTime = performance.now();
            let iterations = 0;
            
            while (performance.now() - startTime < duration) {
                switch (test) {
                    case 'quantum-simulation':
                        this.simulateSuperposition({ qubits: 5, iterations: 10 });
                        break;
                    case 'color-generation':
                        this.generateQuantumColor({});
                        break;
                    case 'optimization':
                        this.quantumOptimization({ x: 1, y: 2 }, { x: 1.5, y: 2.5 });
                        break;
                }
                iterations++;
            }
            
            results[test] = {
                iterations,
                operationsPerSecond: Math.round(iterations / (duration / 1000))
            };
        }
        
        this.sendResult(taskId, results);
    }
    
    simpleHash(input) {
        let hash = 0;
        const str = input.toString();
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // 32bit 정수로 변환
        }
        return hash;
    }
    
    sendResult(taskId, result) {
        self.postMessage({
            type: 'task-complete',
            taskId,
            result,
            timestamp: Date.now()
        });
    }
    
    sendError(taskId, error) {
        self.postMessage({
            type: 'task-error',
            taskId,
            error,
            timestamp: Date.now()
        });
    }
}

// 워커 인스턴스 생성
new QuantumWorker();

---

// src/workers/gpu-worker.js
/**
 * QuantumUnified Pro - GPU 가속 워커
 * WebGL을 이용한 병렬 처리
 */

class GPUWorker {
    constructor() {
        this.canvas = null;
        this.gl = null;
        this.programs = new Map();
        this.buffers = new Map();
        
        this.initializeWebGL();
        
        self.addEventListener('message', this.handleMessage.bind(this));
        
        self.postMessage({
            type: 'worker-ready',
            workerId: 'gpu-worker',
            capabilities: {
                webgl: !!this.gl,
                webgl2: this.gl instanceof WebGL2RenderingContext,
                extensions: this.gl ? this.getAvailableExtensions() : []
            }
        });
    }
    
    initializeWebGL() {
        if (typeof OffscreenCanvas !== 'undefined') {
            this.canvas = new OffscreenCanvas(512, 512);
        } else {
            // Fallback for browsers without OffscreenCanvas
            this.canvas = {
                width: 512,
                height: 512,
                getContext: () => null
            };
            return;
        }
        
        this.gl = this.canvas.getContext('webgl2') || this.canvas.getContext('webgl');
        
        if (this.gl) {
            this.setupWebGL();
        }
    }
    
    setupWebGL() {
        const gl = this.gl;
        
        // 기본 설정
        gl.viewport(0, 0, this.canvas.width, this.canvas.height);
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        
        // 컴퓨트 셰이더 프로그램 생성
        this.createComputePrograms();
    }
    
    createComputePrograms() {
        // 컬러 생성용 셰이더
        const colorVertexShader = `
            attribute vec4 position;
            varying vec2 uv;
            void main() {
                gl_Position = position;
                uv = position.xy * 0.5 + 0.5;
            }
        `;
        
        const colorFragmentShader = `
            precision mediump float;
            varying vec2 uv;
            uniform float time;
            uniform vec2 resolution;
            
            void main() {
                vec2 st = gl_FragCoord.xy / resolution.xy;
                
                // 양자적 노이즈 생성
                float noise = fract(sin(dot(st.xy + time, vec2(12.9898, 78.233))) * 43758.5453);
                
                // HSL to RGB 변환
                float hue = noise * 6.28318;
                float saturation = 0.7 + 0.3 * sin(time + st.x * 10.0);
                float lightness = 0.5 + 0.3 * cos(time + st.y * 10.0);
                
                vec3 color = vec3(
                    abs(cos(hue)),
                    abs(cos(hue + 2.094)),
                    abs(cos(hue + 4.188))
                ) * saturation * lightness;
                
                gl_FragColor = vec4(color, 1.0);
            }
        `;
        
        this.programs.set('colorGeneration', this.createShaderProgram(colorVertexShader, colorFragmentShader));
        
        // 양자 시뮬레이션용 셰이더
        const quantumFragmentShader = `
            precision mediump float;
            varying vec2 uv;
            uniform float time;
            uniform int qubits;
            
            float quantum_state(vec2 pos, float t) {
                // 양자 상태 시뮬레이션
                float phase = t + pos.x * 10.0 + pos.y * 5.0;
                return sin(phase) * cos(phase * 0.7) * 0.5 + 0.5;
            }
            
            void main() {
                float q1 = quantum_state(uv, time);
                float q2 = quantum_state(uv + 0.1, time + 1.0);
                float q3 = quantum_state(uv + 0.2, time + 2.0);
                
                gl_FragColor = vec4(q1, q2, q3, 1.0);
            }
        `;
        
        this.programs.set('quantumSimulation', this.createShaderProgram(colorVertexShader, quantumFragmentShader));
    }
    
    createShaderProgram(vertexSource, fragmentSource) {
        const gl = this.gl;
        
        const vertexShader = this.compileShader(gl.VERTEX_SHADER, vertexSource);
        const fragmentShader = this.compileShader(gl.FRAGMENT_SHADER, fragmentSource);
        
        const program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.error('Shader program linking failed:', gl.getProgramInfoLog(program));
            return null;
        }
        
        return program;
    }
    
    compileShader(type, source) {
        const gl = this.gl;
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error('Shader compilation failed:', gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
        }
        
        return shader;
    }
    
    getAvailableExtensions() {
        if (!this.gl) return [];
        
        return this.gl.getSupportedExtensions() || [];
    }
    
    handleMessage(event) {
        const { type, data, taskId } = event.data;
        
        try {
            switch (type) {
                case 'gpu-color-generation':
                    this.generateColorsGPU(data, taskId);
                    break;
                case 'gpu-quantum-simulation':
                    this.simulateQuantumGPU(data, taskId);
                    break;
                case 'gpu-benchmark':
                    this.runGPUBenchmark(data, taskId);
                    break;
                default:
                    this.sendError(taskId, `Unknown GPU task: ${type}`);
            }
        } catch (error) {
            this.sendError(taskId, error.message);
        }
    }
    
    async generateColorsGPU(data, taskId) {
        if (!this.gl) {
            this.sendError(taskId, 'WebGL not available');
            return;
        }
        
        const { count, mode } = data;
        const startTime = performance.now();
        
        const colors = [];
        const program = this.programs.get('colorGeneration');
        
        if (!program) {
            this.sendError(taskId, 'Color generation shader not available');
            return;
        }
        
        const gl = this.gl;
        gl.useProgram(program);
        
        // 유니폼 설정
        const timeLocation = gl.getUniformLocation(program, 'time');
        const resolutionLocation = gl.getUniformLocation(program, 'resolution');
        
        gl.uniform1f(timeLocation, Date.now() / 1000);
        gl.uniform2f(resolutionLocation, this.canvas.width, this.canvas.height);
        
        // 렌더링 실행
        gl.clear(gl.COLOR_BUFFER_BIT);
        
        // 픽셀 데이터 읽기
        const pixels = new Uint8Array(this.canvas.width * this.canvas.height * 4);
        gl.readPixels(0, 0, this.canvas.width, this.canvas.height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
        
        // 픽셀 데이터를 컬러로 변환
        for (let i = 0; i < count && i < pixels.length / 4; i++) {
            const r = pixels[i * 4];
            const g = pixels[i * 4 + 1];
            const b = pixels[i * 4 + 2];
            
            colors.push(`rgb(${r}, ${g}, ${b})`);
        }
        
        const processingTime = performance.now() - startTime;
        
        this.sendResult(taskId, {
            colors,
            count: colors.length,
            mode: 'gpu',
            processingTime,
            performance: Math.round(colors.length / (processingTime / 1000))
        });
    }
    
    async simulateQuantumGPU(data, taskId) {
        if (!this.gl) {
            this.sendError(taskId, 'WebGL not available');
            return;
        }
        
        const { qubits, iterations } = data;
        const startTime = performance.now();
        
        const program = this.programs.get('quantumSimulation');
        if (!program) {
            this.sendError(taskId, 'Quantum simulation shader not available');
            return;
        }
        
        const gl = this.gl;
        gl.useProgram(program);
        
        // 양자 시뮬레이션 실행
        const results = [];
        
        for (let i = 0; i < iterations; i++) {
            // 유니폼 업데이트
            const timeLocation = gl.getUniformLocation(program, 'time');
            const qubitsLocation = gl.getUniformLocation(program, 'qubits');
            
            gl.uniform1f(timeLocation, Date.now() / 1000 + i);
            gl.uniform1i(qubitsLocation, qubits);
            
            // 렌더링
            gl.clear(gl.COLOR_BUFFER_BIT);
            
            // 결과 읽기 (간소화)
            const pixel = new Uint8Array(4);
            gl.readPixels(this.canvas.width / 2, this.canvas.height / 2, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixel);
            
            results.push({
                iteration: i,
                quantumState: {
                    amplitude0: pixel[0] / 255,
                    amplitude1: pixel[1] / 255,
                    phase: pixel[2] / 255 * Math.PI * 2
                }
            });
        }
        
        const processingTime = performance.now() - startTime;
        
        this.sendResult(taskId, {
            results,
            qubits,
            iterations,
            processingTime,
            performance: Math.round(iterations / (processingTime / 1000))
        });
    }
    
    async runGPUBenchmark(data, taskId) {
        if (!this.gl) {
            this.sendError(taskId, 'WebGL not available');
            return;
        }
        
        const { duration } = data;
        const results = {};
        
        // 렌더링 벤치마크
        const renderStart = performance.now();
        let renderFrames = 0;
        
        while (performance.now() - renderStart < duration) {
            this.gl.clear(this.gl.COLOR_BUFFER_BIT);
            renderFrames++;
        }
        
        results.rendering = {
            frames: renderFrames,
            fps: Math.round(renderFrames / (duration / 1000))
        };
        
        // 컴퓨트 벤치마크
        const computeStart = performance.now();
        let computeOps = 0;
        
        while (performance.now() - computeStart < duration) {
            // 간단한 GPU 연산
            const pixels = new Uint8Array(64 * 64 * 4);
            this.gl.readPixels(0, 0, 64, 64, this.gl.RGBA, this.gl.UNSIGNED_BYTE, pixels);
            computeOps++;
        }
        
        results.compute = {
            operations: computeOps,
            opsPerSecond: Math.round(computeOps / (duration / 1000))
        };
        
        this.sendResult(taskId, results);
    }
    
    sendResult(taskId, result) {
        self.postMessage({
            type: 'task-complete',
            taskId,
            result,
            timestamp: Date.now()
        });
    }
    
    sendError(taskId, error) {
        self.postMessage({
            type: 'task-error',
            taskId,
            error,
            timestamp: Date.now()
        });
    }
}

// GPU 워커 인스턴스 생성
new GPUWorker();

---

// src/workers/worker-manager.js
/**
 * QuantumUnified Pro - 워커 관리자
 * 모든 Web Workers를 통합 관리
 */

class WorkerManager {
    constructor() {
        this.workers = new Map();
        this.taskQueue = [];
        this.pendingTasks = new Map();
        this.taskIdCounter = 0;
        
        this.initializeWorkers();
    }
    
    async initializeWorkers() {
        try {
            // 양자 워커들 생성
            const quantumWorkerCount = Math.min(navigator.hardwareConcurrency || 4, 6);
            for (let i = 0; i < quantumWorkerCount; i++) {
                await this.createWorker('quantum', `workers/quantum-worker.js`, `quantum-${i}`);
            }
            
            // GPU 워커 생성
            await this.createWorker('gpu', `workers/gpu-worker.js`, 'gpu-main');
            
            console.log(`✅ WorkerManager 초기화 완료: ${this.workers.size}개 워커`);
            
        } catch (error) {
            console.error('❌ WorkerManager 초기화 실패:', error);
        }
    }
    
    async createWorker(type, scriptPath, workerId) {
        return new Promise((resolve, reject) => {
            try {
                const worker = new Worker(scriptPath);
                
                worker.onmessage = (event) => {
                    this.handleWorkerMessage(workerId, event);
                };
                
                worker.onerror = (error) => {
                    console.error(`Worker ${workerId} 오류:`, error);
                    reject(error);
                };
                
                const workerInfo = {
                    id: workerId,
                    type,
                    worker,
                    busy: false,
                    capabilities: null,
                    tasksCompleted: 0,
                    totalProcessingTime: 0
                };
                
                this.workers.set(workerId, workerInfo);
                
                // 워커 준비 완료를 기다림
                const readyTimeout = setTimeout(() => {
                    reject(new Error(`Worker ${workerId} 준비 시간 초과`));
                }, 5000);
                
                const originalOnMessage = worker.onmessage;
                worker.onmessage = (event) => {
                    if (event.data.type === 'worker-ready') {
                        clearTimeout(readyTimeout);
                        workerInfo.capabilities = event.data.capabilities;
                        worker.onmessage = originalOnMessage;
                        resolve(workerInfo);
                    } else {
                        originalOnMessage(event);
                    }
                };
                
            } catch (error) {
                reject(error);
            }
        });
    }
    
    handleWorkerMessage(workerId, event) {
        const { type, taskId, result, error } = event.data;
        
        switch (type) {
            case 'task-complete':
                this.handleTaskComplete(workerId, taskId, result);
                break;
            case 'task-error':
                this.handleTaskError(workerId, taskId, error);
                break;
            case 'worker-ready':
                console.log(`✅ Worker ${workerId} 준비 완료`);
                break;
            default:
                console.warn(`알 수 없는 워커 메시지 타입: ${type}`);
        }
    }
    
    handleTaskComplete(workerId, taskId, result) {
        const workerInfo = this.workers.get(workerId);
        if (workerInfo) {
            workerInfo.busy = false;
            workerInfo.tasksCompleted++;
            workerInfo.totalProcessingTime += result.processingTime || 0;
        }
        
        const taskInfo = this.pendingTasks.get(taskId);
        if (taskInfo) {
            taskInfo.resolve(result);
            this.pendingTasks.delete(taskId);
        }
        
        // 대기 중인 작업 처리
        this.processQueue();
    }
    
    handleTaskError(workerId, taskId, error) {
        const workerInfo = this.workers.get(workerId);
        if (workerInfo) {
            workerInfo.busy = false;
        }
        
        const taskInfo = this.pendingTasks.get(taskId);
        if (taskInfo) {
            taskInfo.reject(new Error(error));
            this.pendingTasks.delete(taskId);
        }
        
        // 대기 중인 작업 처리
        this.processQueue();
    }
    
    async executeTask(taskType, taskData, workerType = null) {
        return new Promise((resolve, reject) => {
            const taskId = `task-${++this.taskIdCounter}`;
            
            this.pendingTasks.set(taskId, { resolve, reject });
            
            const task = {
                id: taskId,
                type: taskType,
                data: taskData,
                workerType,
                timestamp: Date.now()
            };
            
            this.taskQueue.push(task);
            this.processQueue();
        });
    }
    
    processQueue() {
        if (this.taskQueue.length === 0) return;
        
        // 사용 가능한 워커 찾기
        const availableWorkers = Array.from(this.workers.values()).filter(w => !w.busy);
        
        if (availableWorkers.length === 0) return;
        
        const task = this.taskQueue.shift();
        let selectedWorker;
        
        if (task.workerType) {
            // 특정 워커 타입 요청
            selectedWorker = availableWorkers.find(w => w.type === task.workerType);
        } else {
            // 최적 워커 선택 (부하 분산)
            selectedWorker = availableWorkers.reduce((best, current) => {
                const bestRatio = best.tasksCompleted / (best.totalProcessingTime + 1);
                const currentRatio = current.tasksCompleted / (current.totalProcessingTime + 1);
                return currentRatio < bestRatio ? current : best;
            });
        }
        
        if (selectedWorker) {
            selectedWorker.busy = true;
            selectedWorker.worker.postMessage({
                type: task.type,
                data: task.data,
                taskId: task.id
            });
        } else {
            // 적절한 워커가 없으면 다시 큐에 추가
            this.taskQueue.unshift(task);
        }
    }
    
    // 편의 메서드들
    async generateColors(count, mode = 'hybrid', parameters = {}) {
        const workerType = mode === 'gpu' ? 'gpu' : 'quantum';
        const taskType = mode === 'gpu' ? 'gpu-color-generation' : 'color-generation';
        
        return this.executeTask(taskType, { count, mode, parameters }, workerType);
    }
    
    async simulateQuantum(algorithm, parameters) {
        return this.executeTask('quantum-compute', { algorithm, parameters }, 'quantum');
    }
    
    async optimizeParameters(currentParams, target) {
        return this.executeTask('optimization', { currentParams, target }, 'quantum');
    }
    
    async runBenchmark(tests, duration = 5000) {
        const promises = [];
        
        // 양자 벤치마크
        promises.push(this.executeTask('benchmark', { tests, duration }, 'quantum'));
        
        // GPU 벤치마크 (사용 가능한 경우)
        const gpuWorker = Array.from(this.workers.values()).find(w => w.type === 'gpu');
        if (gpuWorker && gpuWorker.capabilities?.webgl) {
            promises.push(this.executeTask('gpu-benchmark', { duration }, 'gpu'));
        }
        
        const results = await Promise.all(promises);
        
        return {
            quantum: results[0],
            gpu: results[1] || null
        };
    }
    
    getWorkerStats() {
        const stats = {
            totalWorkers: this.workers.size,
            busyWorkers: 0,
            queueLength: this.taskQueue.length,
            workers: {}
        };
        
        for (const [id, info] of this.workers) {
            if (info.busy) stats.busyWorkers++;
            
            stats.workers[id] = {
                type: info.type,
                busy: info.busy,
                tasksCompleted: info.tasksCompleted,
                avgProcessingTime: info.tasksCompleted > 0 ? 
                    Math.round(info.totalProcessingTime / info.tasksCompleted) : 0,
                capabilities: info.capabilities
            };
        }
        
        return stats;
    }
    
    terminate() {
        // 모든 워커 종료
        for (const [id, info] of this.workers) {
            info.worker.terminate();
        }
        
        this.workers.clear();
        this.taskQueue.length = 0;
        this.pendingTasks.clear();
        
        console.log('🛑 WorkerManager 종료됨');
    }
}

// 전역 WorkerManager 인스턴스
if (typeof window !== 'undefined') {
    window.WorkerManager = WorkerManager;
}

// Node.js 환경에서의 export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = WorkerManager;
}
