/**
 * QuantumUnified Pro 서비스 워커
 * Progressive Web App (PWA) 기능 제공
 * 
 * @version 3.0.0
 * @author QuantumUnified Technologies
 */

const CACHE_NAME = 'quantumunified-v3.0.0';
const STATIC_CACHE = 'quantumunified-static-v3.0.0';
const DYNAMIC_CACHE = 'quantumunified-dynamic-v3.0.0';

// 캐시할 핵심 파일들
const CORE_FILES = [
    '/',
    '/index.html',
    '/quantum-unified.css',
    '/quantum-unified.js',
    '/test.html',
    '/manifest.json'
];

// 캐시할 추가 리소스들
const STATIC_FILES = [
    '/assets/icon-192x192.png',
    '/assets/icon-512x512.png',
    '/README.md'
];

// 캐시 전략 설정
const CACHE_STRATEGIES = {
    core: 'cache-first',           // 핵심 파일은 캐시 우선
    static: 'cache-first',        // 정적 파일은 캐시 우선
    api: 'network-first',         // API는 네트워크 우선
    dynamic: 'stale-while-revalidate'  // 동적 콘텐츠는 캐시 후 업데이트
};

// 오프라인 페이지
const OFFLINE_PAGE = '/offline.html';
const OFFLINE_FALLBACK = `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>오프라인 - QuantumUnified Pro</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background: linear-gradient(135deg, #0a0a0a, #1a1a1a);
            color: white;
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            text-align: center;
        }
        .container {
            max-width: 500px;
            padding: 40px;
            background: rgba(26, 26, 26, 0.9);
            border-radius: 20px;
            border: 1px solid rgba(0, 255, 136, 0.2);
        }
        .icon {
            font-size: 4rem;
            margin-bottom: 20px;
        }
        .title {
            font-size: 2rem;
            color: #00ff88;
            margin-bottom: 20px;
        }
        .message {
            font-size: 1.1rem;
            line-height: 1.6;
            margin-bottom: 30px;
            color: #ccc;
        }
        .retry-btn {
            background: linear-gradient(45deg, #00ff88, #00d4ff);
            color: black;
            border: none;
            padding: 15px 30px;
            border-radius: 25px;
            font-size: 1rem;
            font-weight: bold;
            cursor: pointer;
            transition: transform 0.3s ease;
        }
        .retry-btn:hover {
            transform: translateY(-2px);
        }
        .features {
            margin-top: 30px;
            text-align: left;
            font-size: 0.9rem;
            color: #999;
        }
        .features ul {
            list-style: none;
            padding: 0;
        }
        .features li {
            margin: 8px 0;
            padding-left: 20px;
        }
        .features li:before {
            content: "⚛️";
            position: absolute;
            margin-left: -20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="icon">📡</div>
        <h1 class="title">오프라인 모드</h1>
        <p class="message">
            현재 인터넷에 연결되어 있지 않습니다.<br>
            QuantumUnified Pro는 오프라인에서도 기본 기능을 제공합니다.
        </p>
        <button class="retry-btn" onclick="location.reload()">
            다시 연결 시도
        </button>
        
        <div class="features">
            <p><strong>오프라인 사용 가능 기능:</strong></p>
            <ul>
                <li>기본 컬러 생성</li>
                <li>CPU 기반 계산</li>
                <li>로컬 성능 테스트</li>
                <li>이전 결과 확인</li>
            </ul>
        </div>
    </div>
    
    <script>
        // 온라인 상태 감지
        window.addEventListener('online', () => {
            document.body.innerHTML = '<div style="text-align:center; padding:50px; color:#00ff88; font-size:1.5rem;">🌐 연결됨! 페이지를 새로고침합니다...</div>';
            setTimeout(() => location.reload(), 2000);
        });
        
        // 오프라인 알림
        window.addEventListener('offline', () => {
            console.log('📡 오프라인 모드로 전환됨');
        });
    </script>
</body>
</html>
`;

// 설치 이벤트
self.addEventListener('install', event => {
    console.log('🔧 QuantumUnified Pro 서비스 워커 설치 중...');
    
    event.waitUntil(
        Promise.all([
            // 핵심 파일 캐시
            caches.open(STATIC_CACHE).then(cache => {
                console.log('📦 핵심 파일 캐시 중...');
                return cache.addAll(CORE_FILES.concat(STATIC_FILES));
            }),
            
            // 오프라인 페이지 생성
            caches.open(DYNAMIC_CACHE).then(cache => {
                return cache.put(OFFLINE_PAGE, new Response(OFFLINE_FALLBACK, {
                    headers: { 'Content-Type': 'text/html' }
                }));
            })
        ]).then(() => {
            console.log('✅ 서비스 워커 설치 완료');
            return self.skipWaiting();
        })
    );
});

// 활성화 이벤트
self.addEventListener('activate', event => {
    console.log('🚀 QuantumUnified Pro 서비스 워커 활성화');
    
    event.waitUntil(
        Promise.all([
            // 이전 캐시 정리
            caches.keys().then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        if (cacheName !== STATIC_CACHE && 
                            cacheName !== DYNAMIC_CACHE && 
                            cacheName !== CACHE_NAME) {
                            console.log('🗑️ 이전 캐시 삭제:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            }),
            
            // 모든 클라이언트 제어
            self.clients.claim()
        ]).then(() => {
            console.log('✅ 서비스 워커 활성화 완료');
        })
    );
});

// 네트워크 요청 인터셉트
self.addEventListener('fetch', event => {
    const { request } = event;
    const url = new URL(request.url);
    
    // 같은 도메인의 요청만 처리
    if (url.origin !== location.origin) {
        return;
    }
    
    event.respondWith(handleRequest(request));
});

// 요청 처리 함수
async function handleRequest(request) {
    const url = new URL(request.url);
    const pathname = url.pathname;
    
    try {
        // 핵심 파일에 대한 캐시 우선 전략
        if (CORE_FILES.includes(pathname) || STATIC_FILES.includes(pathname)) {
            return await handleCacheFirst(request);
        }
        
        // API 요청에 대한 네트워크 우선 전략
        if (pathname.startsWith('/api/')) {
            return await handleNetworkFirst(request);
        }
        
        // HTML 파일에 대한 특별 처리
        if (request.destination === 'document') {
            return await handleDocumentRequest(request);
        }
        
        // 기타 요청에 대한 동적 캐시 전략
        return await handleStaleWhileRevalidate(request);
        
    } catch (error) {
        console.error('❌ 요청 처리 실패:', error);
        return await handleOfflineFallback(request);
    }
}

// 캐시 우선 전략
async function handleCacheFirst(request) {
    const cache = await caches.open(STATIC_CACHE);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
        console.log('💾 캐시에서 반환:', request.url);
        return cachedResponse;
    }
    
    try {
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (error) {
        console.log('📡 네트워크 실패, 오프라인 대응:', request.url);
        throw error;
    }
}

// 네트워크 우선 전략
async function handleNetworkFirst(request) {
    const cache = await caches.open(DYNAMIC_CACHE);
    
    try {
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (error) {
        console.log('📡 API 네트워크 실패, 캐시 확인:', request.url);
        const cachedResponse = await cache.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        throw error;
    }
}

// Stale While Revalidate 전략
async function handleStaleWhileRevalidate(request) {
    const cache = await caches.open(DYNAMIC_CACHE);
    const cachedResponse = await cache.match(request);
    
    // 백그라운드에서 네트워크 요청
    const networkPromise = fetch(request).then(response => {
        if (response.ok) {
            cache.put(request, response.clone());
        }
        return response;
    }).catch(() => {
        console.log('📡 백그라운드 업데이트 실패:', request.url);
    });
    
    // 캐시된 응답이 있으면 즉시 반환
    if (cachedResponse) {
        console.log('⚡ 캐시 반환 후 백그라운드 업데이트:', request.url);
        networkPromise; // 백그라운드 실행
        return cachedResponse;
    }
    
    // 캐시가 없으면 네트워크 대기
    return await networkPromise;
}

// 문서 요청 특별 처리
async function handleDocumentRequest(request) {
    try {
        const networkResponse = await fetch(request);
        
        // 네트워크 응답이 성공하면 캐시에 저장
        if (networkResponse.ok) {
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        console.log('📡 문서 네트워크 실패, 캐시 또는 오프라인 페이지 반환');
        
        // 캐시된 페이지 확인
        const cache = await caches.open(DYNAMIC_CACHE);
        const cachedResponse = await cache.match(request);
        
        if (cachedResponse) {
            return cachedResponse;
        }
        
        // 오프라인 페이지 반환
        return await cache.match(OFFLINE_PAGE);
    }
}

// 오프라인 대응
async function handleOfflineFallback(request) {
    const cache = await caches.open(DYNAMIC_CACHE);
    
    // HTML 문서인 경우 오프라인 페이지 반환
    if (request.destination === 'document') {
        return await cache.match(OFFLINE_PAGE);
    }
    
    // 이미지인 경우 기본 이미지 반환 (있다면)
    if (request.destination === 'image') {
        return new Response('', { status: 204 });
    }
    
    // 기타 요청은 에러 응답
    return new Response('오프라인 상태입니다', {
        status: 503,
        statusText: 'Service Unavailable',
        headers: { 'Content-Type': 'text/plain; charset=utf-8' }
    });
}

// 백그라운드 동기화 (미래 기능)
self.addEventListener('sync', event => {
    console.log('🔄 백그라운드 동기화:', event.tag);
    
    if (event.tag === 'quantum-computation') {
        event.waitUntil(performBackgroundComputation());
    }
});

async function performBackgroundComputation() {
    try {
        console.log('⚛️ 백그라운드 양자 계산 실행...');
        
        // 여기에 백그라운드 계산 로직 추가
        // 예: 큐에 저장된 작업 처리
        
        // 클라이언트에게 완료 알림
        const clients = await self.clients.matchAll();
        clients.forEach(client => {
            client.postMessage({
                type: 'BACKGROUND_COMPUTATION_COMPLETE',
                data: { timestamp: Date.now() }
            });
        });
        
        console.log('✅ 백그라운드 계산 완료');
    } catch (error) {
        console.error('❌ 백그라운드 계산 실패:', error);
    }
}

// Push 알림 처리 (미래 기능)
self.addEventListener('push', event => {
    console.log('📬 Push 알림 수신:', event.data?.text());
    
    const options = {
        body: event.data?.text() || 'QuantumUnified Pro 알림',
        icon: '/assets/icon-192x192.png',
        badge: '/assets/badge-72x72.png',
        tag: 'quantum-notification',
        renotify: true,
        requireInteraction: false,
        actions: [
            {
                action: 'open',
                title: '열기',
                icon: '/assets/action-open.png'
            },
            {
                action: 'dismiss',
                title: '닫기',
                icon: '/assets/action-close.png'
            }
        ]
    };
    
    event.waitUntil(
        self.registration.showNotification('QuantumUnified Pro', options)
    );
});

// 알림 클릭 처리
self.addEventListener('notificationclick', event => {
    console.log('🔔 알림 클릭:', event.action);
    
    event.notification.close();
    
    if (event.action === 'open') {
        event.waitUntil(
            self.clients.openWindow('/')
        );
    }
});

// 메시지 처리
self.addEventListener('message', event => {
    console.log('💬 클라이언트 메시지:', event.data);
    
    const { type, data } = event.data;
    
    switch (type) {
        case 'SKIP_WAITING':
            self.skipWaiting();
            break;
            
        case 'GET_VERSION':
            event.ports[0].postMessage({ version: '3.0.0' });
            break;
            
        case 'CLEAR_CACHE':
            clearAllCaches().then(() => {
                event.ports[0].postMessage({ success: true });
            });
            break;
            
        case 'CACHE_QUANTUM_RESULT':
            cacheQuantumResult(data).then(() => {
                event.ports[0].postMessage({ cached: true });
            });
            break;
    }
});

// 모든 캐시 지우기
async function clearAllCaches() {
    const cacheNames = await caches.keys();
    await Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
    );
    console.log('🗑️ 모든 캐시 삭제 완료');
}

// 양자 계산 결과 캐시
async function cacheQuantumResult(data) {
    const cache = await caches.open(DYNAMIC_CACHE);
    const response = new Response(JSON.stringify(data), {
        headers: { 'Content-Type': 'application/json' }
    });
    await cache.put(`/quantum-result-${Date.now()}`, response);
    console.log('⚛️ 양자 계산 결과 캐시됨');
}

// 에러 처리
self.addEventListener('error', event => {
    console.error('❌ 서비스 워커 에러:', event.error);
});

self.addEventListener('unhandledrejection', event => {
    console.error('❌ 처리되지 않은 Promise 거부:', event.reason);
});

console.log('⚛️ QuantumUnified Pro 서비스 워커 로드됨 - v3.0.0');
console.log('🌟 PWA 기능 활성화: 오프라인 지원, 캐싱, 백그라운드 동기화');
