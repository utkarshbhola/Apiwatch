import http from "k6/http";
import { check, sleep } from "k6";

export let options = {
    vus: 50,           // 50 users at the same time
    duration: "1s",    // run for 1 second
};

export default function () {
    const url = "http://localhost:8080/log";
    const payload = JSON.stringify({
        service: "test-service",
        endpoint: "/load-test",
        method: "GET",
        status: 200,
        latency: 120,
        timestamp: "2025-12-05T12:00:00Z"
    });

    const params = { headers: { "Content-Type": "application/json" } };

    let res = http.post(url, payload, params);

    check(res, {
        "status is 200": (r) => r.status === 200,
    });
}
