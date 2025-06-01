#!/usr/bin/env node

/**
 * QuantumUnified Pro 성능 벤치마크 스크립트
 * Node.js 환경에서 실행되는 자동화된 성능 테스트
 * 
 * Usage: node benchmark.js [options]
 * 
 * @author QuantumUnified Technologies
 * @version 3.0.0
 */

const fs = require('fs');
const path = require('path');
const { performance } = require('perf_hooks');

// 벤치마크 설정
const BENCHMARK_CONFIG = {
    iterations: 10,
    warmupRuns: 3,
    testSizes: [16, 32, 64, 128, 256, 512],
    outputFile: 'benchmark-results.json',
    verbose: true
};

class QuantumUnifiedBenchmark {
    constructor() {
        this.results = {
            metadata: {
                timestamp: new Date().toISOString(),
                version: '3.0.0',
                platform: process.platform,
                arch: process.arch,
                nodeVersion: process.version,
                cpuCount: require('os').cpus().length,
                totalMemory: Math.round(require('os').totalmem() / 1024 / 1024 / 1024) + 'GB'
            },
            tests: {}
        };
        
        this.log('🚀 QuantumUnified Pro 벤치마크 시작');
        this.log(`📊 시스템 정보: ${this.results.metadata.platform} ${this.results.metadata.arch}`);
        this.log(`⚡ CPU: ${this.results.metadata.cpuCount}코어, RAM: ${this.results.metadata.totalMemory}`);
    }

    log(message, type = 'info') {
        if (!BENCHMARK_CONFIG.verbose) return;
        
        const timestamp = new Date().toLocaleTimeString();
        const prefix = {
            info: '📋',
            success: '✅',
            warning: '⚠️',
            error: '❌',
            start: '🎯',
            end: '🏁'
        }[type] || '📋';
        
        console.log(`[${timestamp}] ${prefix} ${message}`);
    }

    // CPU 집약적 계산 벤치마크
    async benchmarkCPUComputation(size) {
        const iterations = BENCHMARK_CONFIG.iterations;
        const times = [];
        
        for (let i = 0; i < iterations; i++) {
            const startTime = performance.now();
            
            // 수학적 계산 시뮬레이션
            let result = 0;
            for (let j = 0; j < size * 1000; j++) {
                result += Math.sin(j) * Math.cos(j) + Math.sqrt(j);
            }
            
            const endTime = performance.now();
            times.push(endTime - startTime);
        }
        
        return this.calculateStats(times, size);
    }

    // 양자 시뮬레이션 벤치마크
    async benchmarkQuantumSimulation(qubits) {
        const iterations = BENCHMARK_CONFIG.iterations;
        const times = [];
        
        for (let i = 0; i < iterations; i++) {
            const startTime = performance.now();
            
            // 양자 상태 벡터 시뮬레이션
            const states = Math.pow(2, qubits);
            const stateVector = new Array(states);
            
            // 초기 상태 설정 (균등 중첩)
            const amplitude = 1 / Math.sqrt(states);
            for (let j = 0; j < states; j++) {
                stateVector[j] = {
                    real: amplitude * Math.cos(Math.random() * 2 * Math.PI),
                    imag: amplitude * Math.sin(Math.random() * 2 * Math.PI)
                };
            }
            
            // 양자 게이트 연산 시뮬레이션
            for (let gate = 0; gate < qubits; gate++) {
                // 하다마드 게이트 적용
                for (let j = 0; j < states; j += 2) {
                    if (j + 1 < states) {
                        const temp_real = stateVector[j].real;
                        const temp_imag = stateVector[j].imag;
                        
                        stateVector[j].real = (temp_real + stateVector[j + 1].real) / Math.sqrt(2);
                        stateVector[j].imag = (temp_imag + stateVector[j + 1].imag) / Math.sqrt(2);
                        stateVector[j + 1].real = (temp_real - stateVector[j + 1].real) / Math.sqrt(2);
                        stateVector[j + 1].imag = (temp_imag - stateVector[j + 1].imag) / Math.sqrt(2);
                    }
                }
            }
            
            // 측정 확률 계산
            let totalProbability = 0;
            for (let j = 0; j < states; j++) {
                totalProbability += stateVector[j].real * stateVector[j].real + 
                                   stateVector[j].imag * stateVector[j].imag;
            }
            
            const endTime = performance.now();
            times.push(endTime - startTime);
        }
        
        return this.calculateStats(times, Math.pow(2, qubits));
    }

    // 색상 생성 벤치마크
    async benchmarkColorGeneration(count) {
        const iterations = BENCHMARK_CONFIG.iterations;
        const times = [];
        
        for (let i = 0; i < iterations; i++) {
            const startTime = performance.now();
            
            const colors = [];
            for (let j = 0; j < count; j++) {
                // 양자 기반 색상 생성 시뮬레이션
                const quantumState = Math.random();
                const phase = Math.random() * 2 * Math.PI;
                
                const hue = (quantumState * 360 + Math.sin(phase) * 60) % 360;
                const saturation = 0.7 + Math.cos(phase) * 0.3;
                const value = 0.6 + quantumState * 0.4;
                
                // HSV to RGB 변환
                const c = value * saturation;
                const x = c * (1 - Math.abs((hue / 60) % 2 - 1));
                const m = value - c;
                
                let r, g, b;
                if (hue < 60) [r, g, b] = [c, x, 0];
                else if (hue < 120) [r, g, b] = [x, c, 0];
                else if (hue < 180) [r, g, b] = [0, c, x];
                else if (hue < 240) [r, g, b] = [0, x, c];
                else if (hue < 300) [r, g, b] = [x, 0, c];
                else [r, g, b] = [c, 0, x];
                
                r = Math.round((r + m) * 255);
                g = Math.round((g + m) * 255);
                b = Math.round((b + m) * 255);
                
                colors.push({
                    hex: `#${[r, g, b].map(c => c.toString(16).padStart(2, '0')).join('')}`,
                    rgb: [r, g, b],
                    hsv: [hue, saturation, value]
                });
            }
            
            const endTime = performance.now();
            times.push(endTime - startTime);
        }
        
        return this.calculateStats(times, count);
    }

    // 메모리 사용량 벤치마크
    async benchmarkMemoryUsage(dataSize) {
        const startMemory = process.memoryUsage();
        const startTime = performance.now();
        
        // 대용량 데이터 생성
        const data = new Array(dataSize);
        for (let i = 0; i < dataSize; i++) {
            data[i] = {
                id: i,
                value: Math.random(),
                timestamp: Date.now(),
                metadata: {
                    quantum_state: Math.random(),
                    phase: Math.random() * 2 * Math.PI,
                    entanglement: Math.random() > 0.5
                }
            };
        }
        
        const endTime = performance.now();
        const endMemory = process.memoryUsage();
        
        // 메모리 정리
        data.length = 0;
        
        return {
            duration: endTime - startTime,
            memoryDelta: {
                rss: endMemory.rss - startMemory.rss,
                heapUsed: endMemory.heapUsed - startMemory.heapUsed,
                heapTotal: endMemory.heapTotal - startMemory.heapTotal,
                external: endMemory.external - startMemory.external
            },
            dataSize: dataSize
        };
    }

    // 통계 계산
    calculateStats(times, workloadSize) {
        const sorted = times.sort((a, b) => a - b);
        const mean = times.reduce((a, b) => a + b) / times.length;
        const median = sorted[Math.floor(sorted.length / 2)];
        const min = sorted[0];
        const max = sorted[sorted.length - 1];
        const stdDev = Math.sqrt(times.reduce((sq, n) => sq + Math.pow(n - mean, 2), 0) / times.length);
        
        return {
            times: times,
            stats: {
                mean: parseFloat(mean.toFixed(3)),
                median: parseFloat(median.toFixed(3)),
                min: parseFloat(min.toFixed(3)),
                max: parseFloat(max.toFixed(3)),
                stdDev: parseFloat(stdDev.toFixed(3)),
                throughput: Math.round(workloadSize / (mean / 1000))
            },
            workloadSize: workloadSize
        };
    }

    // 전체 벤치마크 실행
    async runFullBenchmark() {
        this.log('전체 벤치마크 스위트 실행 시작', 'start');
        const overallStartTime = performance.now();
        
        // 1. CPU 계산 벤치마크
        this.log('🔥 CPU 계산 성능 테스트...', 'start');
        this.results.tests.cpu_computation = {};
        
        for (const size of BENCHMARK_CONFIG.testSizes) {
            this.log(`  📊 크기 ${size} 테스트 중...`);
            this.results.tests.cpu_computation[size] = await this.benchmarkCPUComputation(size);
        }
        
        // 2. 양자 시뮬레이션 벤치마크
        this.log('⚛️ 양자 시뮬레이션 성능 테스트...', 'start');
        this.results.tests.quantum_simulation = {};
        
        for (let qubits = 2; qubits <= 8; qubits++) {
            this.log(`  🔬 ${qubits} 큐비트 시뮬레이션...`);
            this.results.tests.quantum_simulation[qubits] = await this.benchmarkQuantumSimulation(qubits);
        }
        
        // 3. 색상 생성 벤치마크
        this.log('🎨 색상 생성 성능 테스트...', 'start');
        this.results.tests.color_generation = {};
        
        for (const count of BENCHMARK_CONFIG.testSizes) {
            this.log(`  🌈 ${count}개 색상 생성...`);
            this.results.tests.color_generation[count] = await this.benchmarkColorGeneration(count);
        }
        
        // 4. 메모리 사용량 테스트
        this.log('💾 메모리 사용량 테스트...', 'start');
        this.results.tests.memory_usage = {};
        
        const memorySizes = [1000, 5000, 10000, 50000];
        for (const size of memorySizes) {
            this.log(`  📊 ${size}개 객체 메모리 테스트...`);
            this.results.tests.memory_usage[size] = await this.benchmarkMemoryUsage(size);
        }
        
        const overallEndTime = performance.now();
        this.results.metadata.totalDuration = parseFloat((overallEndTime - overallStartTime).toFixed(3));
        
        this.log(`전체 벤치마크 완료! 총 소요시간: ${this.results.metadata.totalDuration}ms`, 'end');
        
        // 결과 분석 및 출력
        this.analyzeResults();
        this.saveResults();
    }

    // 결과 분석
    analyzeResults() {
        this.log('📈 결과 분석 중...', 'start');
        
        // CPU 성능 분석
        const cpuResults = this.results.tests.cpu_computation;
        const cpuScores = Object.values(cpuResults).map(r => r.stats.throughput);
        const avgCpuScore = cpuScores.reduce((a, b) => a + b) / cpuScores.length;
        
        // 양자 시뮬레이션 분석
        const quantumResults = this.results.tests.quantum_simulation;
        const quantumScores = Object.values(quantumResults).map(r => r.stats.throughput);
        const avgQuantumScore = quantumScores.reduce((a, b) => a + b) / quantumScores.length;
        
        // 색상 생성 분석
        const colorResults = this.results.tests.color_generation;
        const colorScores = Object.values(colorResults).map(r => r.stats.throughput);
        const avgColorScore = colorScores.reduce((a, b) => a + b) / colorScores.length;
        
        // 종합 점수 계산
        const overallScore = Math.round(avgCpuScore * 0.3 + avgQuantumScore * 0.4 + avgColorScore * 0.3);
        
        this.results.analysis = {
            cpu_average_score: Math.round(avgCpuScore),
            quantum_average_score: Math.round(avgQuantumScore),
            color_average_score: Math.round(avgColorScore),
            overall_score: overallScore,
            performance_grade: this.calculateGrade(overallScore),
            recommendations: this.generateRecommendations(overallScore)
        };
        
        // 결과 출력
        console.log('\n' + '='.repeat(60));
        console.log('📊 QuantumUnified Pro 벤치마크 결과');
        console.log('='.repeat(60));
        console.log(`🔥 CPU 평균 점수:        ${this.results.analysis.cpu_average_score:>8} 연산/초`);
        console.log(`⚛️ 양자 평균 점수:       ${this.results.analysis.quantum_average_score:>8} 상태/초`);
        console.log(`🎨 색상 생성 평균:       ${this.results.analysis.color_average_score:>8} 컬러/초`);
        console.log(`📈 종합 점수:           ${this.results.analysis.overall_score:>8}`);
        console.log(`🏆 성능 등급:           ${this.results.analysis.performance_grade:>8}`);
        console.log('='.repeat(60));
        
        // 권장사항 출력
        if (this.results.analysis.recommendations.length > 0) {
            console.log('\n💡 성능 개선 권장사항:');
            this.results.analysis.recommendations.forEach((rec, i) => {
                console.log(`   ${i + 1}. ${rec}`);
            });
        }
        
        console.log(`\n⏱️ 총 벤치마크 시간: ${this.results.metadata.totalDuration}ms`);
        console.log(`📁 상세 결과: ${BENCHMARK_CONFIG.outputFile}`);
    }

    // 성능 등급 계산
    calculateGrade(score) {
        if (score >= 10000) return 'S+';
        if (score >= 8000) return 'S';
        if (score >= 6000) return 'A+';
        if (score >= 4000) return 'A';
        if (score >= 2000) return 'B';
        if (score >= 1000) return 'C';
        if (score >= 500) return 'D';
        return 'F';
    }

    // 권장사항 생성
    generateRecommendations(score) {
        const recommendations = [];
        
        if (score < 2000) {
            recommendations.push('시스템 리소스 부족 - 더 강력한 하드웨어 권장');
            recommendations.push('브라우저 최적화 - 최신 Chrome/Firefox 사용');
        }
        
        if (score < 5000) {
            recommendations.push('하이브리드 모드 사용 - 양자+GPU+CPU 통합');
            recommendations.push('백그라운드 앱 종료 - CPU/메모리 확보');
        }
        
        if (score >= 8000) {
            recommendations.push('우수한 성능! 양자 우선 모드 추천');
            recommendations.push('고급 기능 활용 - 대용량 컬러 생성 가능');
        }
        
        return recommendations;
    }

    // 결과 저장
    saveResults() {
        try {
            const outputPath = path.resolve(BENCHMARK_CONFIG.outputFile);
            fs.writeFileSync(outputPath, JSON.stringify(this.results, null, 2));
            this.log(`결과 저장 완료: ${outputPath}`, 'success');
            
            // CSV 형태로도 저장
            this.saveCsvResults();
            
        } catch (error) {
            this.log(`결과 저장 실패: ${error.message}`, 'error');
        }
    }

    // CSV 결과 저장
    saveCsvResults() {
        const csvPath = path.resolve('benchmark-results.csv');
        let csvContent = 'Test,Size,Mean(ms),Median(ms),Min(ms),Max(ms),StdDev,Throughput\n';
        
        // CPU 결과
        Object.entries(this.results.tests.cpu_computation).forEach(([size, result]) => {
            csvContent += `CPU,${size},${result.stats.mean},${result.stats.median},${result.stats.min},${result.stats.max},${result.stats.stdDev},${result.stats.throughput}\n`;
        });
        
        // 양자 결과
        Object.entries(this.results.tests.quantum_simulation).forEach(([qubits, result]) => {
            csvContent += `Quantum,${qubits}q,${result.stats.mean},${result.stats.median},${result.stats.min},${result.stats.max},${result.stats.stdDev},${result.stats.throughput}\n`;
        });
        
        // 색상 생성 결과
        Object.entries(this.results.tests.color_generation).forEach(([count, result]) => {
            csvContent += `Color,${count},${result.stats.mean},${result.stats.median},${result.stats.min},${result.stats.max},${result.stats.stdDev},${result.stats.throughput}\n`;
        });
        
        fs.writeFileSync(csvPath, csvContent);
        this.log(`CSV 결과 저장: ${csvPath}`, 'success');
    }
}

// 명령줄 인터페이스
function parseArgs() {
    const args = process.argv.slice(2);
    const options = {};
    
    for (let i = 0; i < args.length; i++) {
        const arg = args[i];
        
        if (arg === '--help' || arg === '-h') {
            console.log(`
QuantumUnified Pro 벤치마크 도구

사용법: node benchmark.js [옵션]

옵션:
  -h, --help           도움말 표시
  -v, --verbose        상세 출력 (기본값)
  -q, --quiet          간단한 출력만
  -i, --iterations N   반복 횟수 (기본값: 10)
  -o, --output FILE    출력 파일명 (기본값: benchmark-results.json)

예시:
  node benchmark.js                    # 기본 벤치마크 실행
  node benchmark.js -i 20              # 20회 반복
  node benchmark.js -q -o results.json # 조용한 모드, 커스텀 출력파일
            `);
            process.exit(0);
        }
        
        if (arg === '--verbose' || arg === '-v') {
            options.verbose = true;
        }
        
        if (arg === '--quiet' || arg === '-q') {
            options.verbose = false;
        }
        
        if (arg === '--iterations' || arg === '-i') {
            options.iterations = parseInt(args[++i]) || BENCHMARK_CONFIG.iterations;
        }
        
        if (arg === '--output' || arg === '-o') {
            options.outputFile = args[++i] || BENCHMARK_CONFIG.outputFile;
        }
    }
    
    return options;
}

// 메인 실행
async function main() {
    const options = parseArgs();
    
    // 설정 병합
    Object.assign(BENCHMARK_CONFIG, options);
    
    try {
        const benchmark = new QuantumUnifiedBenchmark();
        await benchmark.runFullBenchmark();
        
        console.log('\n🎉 벤치마크가 성공적으로 완료되었습니다!');
        console.log('📊 결과를 QuantumUnified Pro 성능 최적화에 활용하세요.');
        
        process.exit(0);
        
    } catch (error) {
        console.error('\n❌ 벤치마크 실행 중 오류 발생:');
        console.error(error.message);
        console.error('\n스택 트레이스:');
        console.error(error.stack);
        
        process.exit(1);
    }
}

// 스크립트가 직접 실행된 경우
if (require.main === module) {
    main();
}

// 모듈로 사용될 경우
module.exports = QuantumUnifiedBenchmark;
